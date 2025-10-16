var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
// var models = reqlib('database').models
const appRoot = require('app-root-path');
const models = require(appRoot + '/database').models;
var moment = require('moment')
const { ObjectId } = require('mongoose').Types
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Types } = require('mongoose');
const { is } = require('bluebird');
const {httpError} = require ('./helpder')
const currentDirectory = __dirname;
const parentDirectory = path.resolve(currentDirectory, '..', '..');
const savePathImage = `${parentDirectory}/images`;
const savePathFile = `${parentDirectory}/files`;
async function getListFriend({UserID}){
        const meId = new ObjectId(UserID);
        // 1) Lấy user hiện tại
        const me = await models.Users.findOne({ _id: meId }).exec();
        if (!me) {
          throw httpError(404,'Không tìm thấy user',{code:'Not found'});
        }
    
        // 2) Danh sách user khác (phần bạn bè 1-1 giữ nguyên cách làm cũ)
        const listUser = await models.Users.find({ _id: { $ne: me._id } })
          .sort({ UpdateAt: -1 })
          .exec();
    
        const friends = [];
      
    
        await Promise.all(listUser.map(async (u) => {
          let doc = await models.FriendShip.findOne({ UserID: me._id, FriendID: u._id });
          let isNotification ;
          if(doc)
            isNotification = doc.isGetNotification;
          else
            isNotification = true;
          const last1v1 = await models.Message.find({
            roomId: null,
            $or: [
              { UserID: me._id, FriendID: u._id },
              { UserID: u._id,  FriendID: me._id }
            ]
          }).sort({ CreatedAt: -1 }).limit(1).lean();
    
          const unreadCount = await models.Message.countDocuments({
            UserID: u._id,
            FriendID: me._id,
            isSend: 0
          });
          friends.push({
            muted :isNotification,
            Content:   last1v1[0]?.Content || '',
            Files:     last1v1[0]?.Files || null,
            CreatedAt: last1v1[0]?.CreatedAt || null,
            Images:    last1v1[0]?.Images || null,
            isSend:    last1v1[0]?.isSend || 0,
            FriendID:  u._id,
            FullName:  u.FullName,
            Username:  u.Username,
            Avatar:    u.Avatar,
            unreadCount: unreadCount,
            UpdateAtUser: u.UpdateAt
          });
        }));
    
        // 3) Lấy danh sách room user tham gia (không lookup lastMessage ở bước này)
        const rooms = await models.Room.aggregate([
          { $match: { 'participants.userId': meId } },
          { $sort: { createdAt: -1 } }
        ]).exec();
    
        const roomIds = rooms.map(r => r._id);
        // Nếu không ở room nào, trả kết quả luôn
        if (roomIds.length === 0) {
          await models.Users.updateOne({ _id: me._id }, { UpdateAt: moment().toDate() });
          return { friends, rooms: [] }
        
        }
    
        // 4) Lấy tin nhắn cuối cho TẤT CẢ room (1 aggregate)
        // Cần index: db.messages.createIndex({ roomId: 1, _id: -1 })
        const lastByRoom = await models.Message.aggregate([
          { $match: { roomId: { $in: roomIds } } },
          { $sort: { _id: -1 } }, // ObjectId tăng theo thời gian
          {
            $group: {
              _id: '$roomId',
              lastMessageId: { $first: '$_id' },
              lastMessage:   { $first: '$$ROOT' }
            }
          }
        ]).exec();
        const lastMap = new Map(lastByRoom.map(x => [x._id.toString(), x]));
    
        // 5) Lấy trạng thái đọc của mình trong TẤT CẢ room (1 query)
        // Cần index: db.roommembers.createIndex({ roomId: 1, userId: 1 }, { unique: true })
        const myStates = await models.MemberRoom.find(
          { roomId: { $in: roomIds }, userId: meId },
          { roomId: 1, lastReadMessageId: 1 }
        ).lean();
        const readMap = new Map(
          myStates.map(s => [s.roomId.toString(), s.lastReadMessageId || null])
        );
    
        // 6) Tính unreadCount cho từng room
        //   - Theo bạn yêu cầu: chỉ đếm số tin có _id > lastReadMessageId
        //   - Nếu lastReadMessageId null => tính tất cả tin trong room
        const roomResults = [];
        for (const r of rooms) {
          const mr =await models.MemberRoom.findOne({userId : me._id,roomId : r._id});
           let isNotification;
          if(mr)
            isNotification = mr.isGetNotification;
          else
            isNotification = true;
          const key = r._id.toString();
          const lastInfo = lastMap.get(key);
          const lastMsgDoc = lastInfo?.lastMessage || null;
          const lastReadId = readMap.get(key) || null;
          
          let unreadCount = 0;
          if (lastMsgDoc) {
            if (lastReadId) {
              unreadCount = await models.Message.countDocuments({
                roomId: r._id,
                _id: { $gt: lastReadId }
              });
            } else {
              unreadCount = await models.Message.countDocuments({ roomId: r._id });
            }
          }
          console.log(isNotification,"notifi")
          roomResults.push({
            muted: isNotification,
            _id: r._id,
            name: r.name,
            type: r.type,
            participants: r.participants,
            createdBy: r.createdBy,
            createdAt: r.createdAt,
            avatarUrl: r.avatarUrl,
            UpdateAt: r.UpdateAt,
            unreadCount ,
            lastMessage: lastMsgDoc ? {
              _id: lastMsgDoc._id,
              Content: lastMsgDoc.Content || '',
              Files: lastMsgDoc.Files || null,
              Images: lastMsgDoc.Images || null,
              CreatedAt: lastMsgDoc.CreatedAt || null,
              isSend: lastMsgDoc.isSend || 0,
              UserID: lastMsgDoc.UserID,
              Emotion: lastMsgDoc.Emotion ?? null,
              MessageReply: lastMsgDoc.MessageReply ? {
                _id: lastMsgDoc.MessageReply._id,
                Content: lastMsgDoc.MessageReply.Content,
                Files: lastMsgDoc.MessageReply.Files,
                Images: lastMsgDoc.MessageReply.Images,
                UserReplyID: lastMsgDoc.MessageReply.UserID,
                whmessMain: lastMsgDoc.MessageReply.whmessMain,
              } : null
            } : null
          });
        }
    
        // 7) Cập nhật online
        await models.Users.updateOne({ _id: me._id }, { UpdateAt: moment().toDate() });
    
        // 8) Trả về
        
        return {
            friends,
            rooms: roomResults
          }
}
module.exports = {getListFriend};