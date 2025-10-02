const admin = require('../../firebase') // Firebase Admin SDK
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

const currentDirectory = __dirname;
const parentDirectory = path.resolve(currentDirectory, '..', '..');
const savePathImage = `${parentDirectory}/images`;
const savePathFile = `${parentDirectory}/files`;

module.exports = () => {
router.post('/create-room', async (req, res) => {
  try {
    const { createdBy, name, avatarUrl = null, userIds } = req.body;

    // --- Validate ---
    if (!createdBy) {
      return res.status(400).json({ status: 0, message: 'Missing required createdBy' });
    }
    if (!name) {
      return res.status(400).json({ status: 0, message: 'Missing required name' });
    }
    if (!Array.isArray(userIds)) {
      return res.status(400).json({ status: 0, message: 'Missing required userIds (array)' });
    }

    // --- Tìm creator ---
    if (!Types.ObjectId.isValid(createdBy)) {
      return res.status(400).json({ status: 0, message: 'createdBy is not valid ObjectId' });
    }
    const creator = await models.Users.findById(createdBy).lean();
    if (!creator) {
      return res.status(404).json({ status: 0, message: 'Creator not found' });
    }

    // --- Danh sách participants (bao gồm cả creator) ---
    const ids = [
      creator._id,
      ...userIds.filter(id => id !== createdBy).map(id => new Types.ObjectId(id))
    ];

    // Lấy thông tin user từ DB
    const users = await models.Users.find(
      { _id: { $in: ids } },
      { FullName: 1, Avatar: 1 } // lấy thêm field cần
    ).lean();

    // Ghép vào participants
    const participants = users.map(u => ({
      userId: u._id,
      FullName: u.FullName,
      Avatar: u.Avatar,
      joinedAt: moment().toDate()
    }));

    // --- Tạo room ---
    const newRoom = await models.Room.create({
      name,
      avatarUrl,
      type: 'group',
      participants,            // đã có đủ thông tin
      createdBy: creator._id,
      createdAt: moment().toDate()
    });

    return res.status(201).json({
      status: 1,
      message: 'Room created successfully',
      data: newRoom
    });
  } catch (err) {
    return res.status(500).json({ status: 0, message: err.message });
  }
});

router.get('/list-friend', async (req, res) => {
  try {
    const UserID = req.UserID;
    const meId = new ObjectId(UserID);

    // 1) Lấy user hiện tại
    const me = await models.Users.findOne({ _id: meId }).exec();
    if (!me) {
      return res.status(400).json({ status: 0, data: null, message: 'User not found' });
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
      return res.status(200).json({
        status: 1,
        data: { friends, rooms: [] },
        message: 'success'
      });
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
    return res.status(200).json({
      status: 1,
      data: {
        friends,
        rooms: roomResults
      },
      message: "success"
    });

  } catch (error) {
    return res.status(400).json({ status: 0, data: null, message: error.message });
  }
});


    router.post('/send-message', async (req, res) => {
    try {
      const UserID = req.UserID;
      const { FriendID, Content } = req.body;
      let listImages = [];
      let listFiles = [];

      let user = await models.Users.findOne({ _id: new mongoose.Types.ObjectId(UserID) }).exec();
      if (!user) {
        return res.status(400).json({ status: 0, data: null, message: 'User not found' });
      }

      let Friend = await models.Users.findOne({ _id: new mongoose.Types.ObjectId(FriendID) }).exec();
      if (!Friend) {
        return res.status(400).json({ status: 0, data: null, message: 'Friend not found' });
      }

      for (const file of req.files) {
        if (file.fieldname === 'files') {
          const extension = file.originalname.split('.').pop();
          const nameFile = uuidv4();
          if (!file.mimetype.startsWith('image/')) {
            const fullPath = path.join(savePathFile, `${nameFile}.${extension}`);
            fs.writeFileSync(fullPath, file.buffer);
            const Link = `/files/${nameFile}.${extension}`;
            listFiles.push({
              urlFile: Link,
              FileName: file.originalname
            });
          } else {
            const fullPath = path.join(savePathImage, `${nameFile}.${extension}`);
            fs.writeFileSync(fullPath, file.buffer);
            const Link = `/images/${nameFile}.${extension}`;
            listImages.push({
              urlImage: Link,
              FileName: file.originalname
            });
          }
        }
      }

      const response = await models.Message({
        UserID: user._id,
        FriendID: Friend._id,
        Content: Content,
        Files: listFiles,
        Images: listImages,
        CreatedAt: moment().toDate(),
        UpdateAt: moment().toDate(),
        isSend: 0
      }).save();

      await models.Users.updateOne({ _id: user._id }, { UpdateAt: moment().toDate() });
      console.log("response",response)
      //  Gửi thông báo FCM
      // await sendFCMToFriend({
      //   toUser: Friend,
      //   fromUser: user,
      //   messageText: Content
      // });

      return res.status(200).json({
        status: 1,
        data: {
          id: response?._id,
          Content: response?.Content,
          Files: response?.Files,
          Images: response?.Images,
          isSend: response?.isSend,
          CreatedAt: response?.CreatedAt,
          MessageType: 1
        },
        message: ""
      });

    } catch (error) {
      return res.status(400).json({ status: 0, data: null, message: error.message });
    }
  });

  //  Hàm gửi thông báo FCM
  // const sendFCMToFriend = async ({ toUser, fromUser, messageText }) => {
  //   if (!toUser?.fcmToken) return;

  //   const payload = {
  //     token: toUser.fcmToken,
  //     notification: {
  //       title: 'Tin nhắn mới',
  //       body: `${fromUser.FullName || fromUser.Username}: ${messageText}`
  //     },
  //     data: {
  //       type: 'chat',
  //       senderId: fromUser._id.toString(),
  //       content: messageText
  //     }
  //   };

  //   try {
  //     const response = await admin.messaging().send(payload);
  //     console.log(' Đã gửi FCM:', response);
  //   } catch (err) {
  //     console.error(' FCM lỗi:', err.message);
  //   }
  // };

    router.get('/get-message', async (req, res) => {
        try {
            const UserID = req.UserID
            const { FriendID, LastTime } = req.query
            let user = await models.Users.findOne({ _id: new ObjectId(UserID) }).exec()
            if (user == null) {
                return res.status(400).json({ status: 0, data: null, message: 'User not found' })
            }

            let Friend = await models.Users.findOne({ _id: new ObjectId(FriendID) }).exec()
            if (Friend == null) {
                return res.status(400).json({ status: 0, data: null, message: 'Friend not found' })
            }
            const queryConditions = [
                {
                    $or: [
                        { UserID: user._id, FriendID: Friend._id },
                        { UserID: Friend._id, FriendID: user._id }
                    ]
                }
            ];

            if (LastTime) {
                queryConditions.push({ CreatedAt: { $gt: LastTime } });
            }
            const response = await models.Message.find({ $and: queryConditions }).sort({ CreatedAt: 1 });
            const data = await Promise.all(response?.map(async (value) => {
                if (value.UserID.equals(user._id)) {
                    return ({
                        id: value._id,
                        Content: value?.Content,
                        Files: value?.Files,
                        Images: value?.Images,
                        isSend: value?.isSend,
                        CreatedAt: value?.CreatedAt,
                        MessageType: 1
                    })
                }
                else {
                    if (value?.isSend === 0) {
                        await models.Message.updateOne({ _id: value._id }, { isSend: 1 });
                    }
                    return ({
                        id: value._id,
                        Content: value?.Content,
                        Files: value?.Files,
                        Images: value?.Images,
                        isSend: 1,
                        CreatedAt: value?.CreatedAt,
                        MessageType: 0
                    })
                }

            }));
            await models.Users.updateOne({ _id: user._id }, { UpdateAt: moment().toDate() })
            return res.status(200).json({ status: 1, data: data, message: "" })
        } catch (error) {
            return res.status(400).json({ status: 0, data: null, message: error.message })
        }
    })

    return router
}