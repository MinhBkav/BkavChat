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
async function sendMessage({files,UserID,FriendID,Content}) {
      let listImages = [];
      let listFiles = [];
      let user = await models.Users.findOne({ _id: new mongoose.Types.ObjectId(UserID) }).exec();
      if (!user) {
          throw httpError(404,'Không tìm thấy user',{code:'Not found'});
      }

      let Friend = await models.Users.findOne({ _id: new mongoose.Types.ObjectId(FriendID) }).exec();
      if (!Friend) {
          throw httpError(404,'Không tìm thấy friend',{code:'Not found'});
      }

      for (const file of files) {
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

    const messageSend ={
          id: response?._id,
          Content: response?.Content,
          Files: response?.Files,
          Images: response?.Images,
          isSend: response?.isSend,
          CreatedAt: response?.CreatedAt,
          MessageType: 1
        }
   return messageSend;
};
async function getMessage({UserID,FriendID,LastTime}) {
                let user = await models.Users.findOne({ _id: new ObjectId(UserID) }).exec()
                if (user == null) {
                  throw httpError(404,'Không tìm thấy user',{code:'Not found'});
                }
    
                let Friend = await models.Users.findOne({ _id: new ObjectId(FriendID) }).exec()
                if (Friend == null) {
                   throw httpError(404,'Không tìm thấy friend',{code:'Not found'});
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
                return data;
};
module.exports =  {getMessage,sendMessage};