var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
const appRoot = require('app-root-path');
const models = require(appRoot + '/database').models;
// var models = reqlib('database').models
var moment = require('moment')
const { ObjectId } = require('mongoose').Types
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // hoặc .diskStorage()
const {httpError} = require ('./helpder')
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const currentDirectory = __dirname;
const parentDirectory = path.resolve(currentDirectory,  '..');
const savePathImageAvatar = `${parentDirectory}/images/avatar`;
async function updateUser({file,UserID,FullName}) {
                console.log(UserID);
                const user = await models.Users.findOne({ _id: new ObjectId(UserID) }).exec();
                if (!user) {
                  throw httpError(404,'Không tìm thấy user',{code:'Not found'});
                }
                const updateObject = {Avatar : null,FullName : null};
                if (FullName) updateObject.FullName = FullName;
    
                //  Xử lý file avatar nếu có
                if (file) {
                    const extension = file.originalname.split('.').pop();
                    const nameFile = uuidv4();
                    const fullPath = path.join(savePathImageAvatar, `${nameFile}.${extension}`);
                    console.log(fullPath);
                    fs.writeFileSync(fullPath, file.buffer);
                    updateObject.Avatar = `/avatar/${nameFile}.${extension}`;
                }
                console.log(updateObject);
                updateObject.UpdateAt = moment().toDate();
                if (Object.keys(updateObject).length > 0) {
                    await models.Users.updateOne({ _id: user._id }, updateObject);
                }
                return updateObject;
};
async function getInfoUser({UserID}){
            let user = await models.Users.findOne({ _id: new ObjectId(UserID) }).exec()
            if (user == null) {
                  throw httpError(404,'Không tìm thấy user',{code:'Not found'});
            }
            const InfoUser = {
                    Username: user?.Username,
                    FullName: user?.FullName,
                    Avatar: user?.Avatar
                }
            return InfoUser;       
}
async function mute({userID,type,id}) {
     
    const userObjId = new ObjectId(userID);
    if (type === 'solo') {
      // toggle giữa userID (người nhận) và FriendID = id (người gửi/đối tác)
      const friendObjId = new ObjectId(id);
      if (userObjId.equals(friendObjId)) {
         throw httpError(400,'Không thể mute chính mình',{code:'8xhhhh'});
      }

      // tìm cặp
      console.log(userObjId,friendObjId)
      let doc = await models.FriendShip.findOne({ UserID: userObjId, FriendID: friendObjId });
      console.log(doc)
      if (!doc) {
        // chưa có => tạo mới và đặt isGetNotification = false
        doc = await models.FriendShip.create({
          UserID: userObjId,
          FriendID: friendObjId,
          isGetNotification: false
        });
        return {
          ok: true,
          scope: 'solo',
          targetId: id,
          isGetNotification: doc.isGetNotification // false
        };
      } else {
        // đã có => đảo trạng thái
        doc.isGetNotification = !doc.isGetNotification;
        await doc.save();
        return {
          ok: true,
          scope: 'solo',
          targetId: id,
          isGetNotification: doc.isGetNotification
        };
      }

    } else if (type === 'group') {
      // toggle giữa userId và roomId = id
      const roomObjId = new ObjectId(id);

      let mr = await models.MemberRoom.findOne({ userId: userObjId, roomId: roomObjId });

      if (!mr) {
        // chưa có => tạo mới và đặt isGetNotification = false
        mr = await models.MemberRoom.findOneAndUpdate(
          { userId: userObjId, roomId: roomObjId },
          { $setOnInsert: { userId: userObjId, roomId: roomObjId, isGetNotification: false } },
          { upsert: true, new: true }
        );
        return {
          ok: true,
          scope: 'group',
          roomId: id,
          isGetNotification: mr.isGetNotification // false
        };
      } else {
        // đã có => đảo trạng thái
        mr.isGetNotification = !mr.isGetNotification;
        await mr.save();
        return {
          ok: true,
          scope: 'group',
          roomId: id,
          isGetNotification: mr.isGetNotification
        };
      }

    } else {
        throw httpError(400,'type phải là "solo" hoặc "group"',{code:'8xhhhh'});
    }
  };
module.exports = {getInfoUser,updateUser,mute};