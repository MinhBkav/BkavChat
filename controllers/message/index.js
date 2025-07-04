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

const currentDirectory = __dirname;
const parentDirectory = path.resolve(currentDirectory, '..', '..');
const savePathImage = `${parentDirectory}/images`;
const savePathFile = `${parentDirectory}/files`;

module.exports = () => {
    router.get('/list-friend', async (req, res) => {
        try {
            const UserID = req.UserID
            let user = await models.Users.findOne({ _id: new ObjectId(UserID) }).exec()
            if (user == null) {
                return res.status(400).json({ status: 0, data: null, message: 'User not found' })
            }
            const listUser = await models.Users.find({ _id: { $ne: user._id } }).sort({ UpdateAt: -1 }).exec()
            let listCustomFriend = []
            await Promise.all(listUser.map(async (value) => {
                const queryConditions = [
                    {
                        $or: [
                            { UserID: user._id, FriendID: value._id },
                            { UserID: value._id, FriendID: user._id }
                        ]
                    }
                ];

                const response = await models.Message.find({ $and: queryConditions }).sort({ CreatedAt: -1 }).limit(1);
                const unreadCount = await models.Message.countDocuments({
                    UserID: value._id,     // friend gửi
                    FriendID: user._id,    // user nhận
                    isSend: 0
                });
                listCustomFriend.push({
                    Content: response.length > 0 ? response[0]?.Content : '',
                    Files: response.length > 0 ? response[0]?.Files : null,
                    CreatedAt: response.length > 0 ? response[0]?.CreatedAt : null, // <--- thêm dòng này
                    Images: response.length > 0 ? response[0]?.Images : null,
                    isSend: response.length > 0 ? response[0]?.isSend : 0,
                    FriendID: value._id,
                    FullName: value.FullName,
                    Username: value.Username,
                    Avatar: value.Avatar,
                    isOnline: moment(value.UpdateAt).isSameOrAfter(moment().subtract(10, 'minutes')),
                    UnreadCount: unreadCount
                })
            }))
            await models.Users.updateOne({ _id: user._id }, { UpdateAt: moment().toDate() })
            return res.status(200).json({ status: 1, data: listCustomFriend, message: "success" })

        } catch (error) {
            return res.status(400).json({ status: 0, data: null, message: error.message })
        }
    })

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

      // ✅ Gửi thông báo FCM
      await sendFCMToFriend({
        toUser: Friend,
        fromUser: user,
        messageText: Content
      });

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

  // ✅ Hàm gửi thông báo FCM
  const sendFCMToFriend = async ({ toUser, fromUser, messageText }) => {
    if (!toUser?.fcmToken) return;

    const payload = {
      token: toUser.fcmToken,
      notification: {
        title: 'Tin nhắn mới',
        body: `${fromUser.FullName || fromUser.Username}: ${messageText}`
      },
      data: {
        type: 'chat',
        senderId: fromUser._id.toString(),
        content: messageText
      }
    };

    try {
      const response = await admin.messaging().send(payload);
      console.log('✅ Đã gửi FCM:', response);
    } catch (err) {
      console.error('❌ FCM lỗi:', err.message);
    }
  };

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