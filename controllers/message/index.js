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
    router.post('/create-room', async (req, res) => {
        try {
            const { createdBy, name, avatarUrl = null, userIds } = req.body;
            console.log(userIds)
            if (!createdBy) {
                return res.status(400).json({ status: 0, message: 'Missing required createdId' });
            }
             if (!name) {
                      return res.status(400).json({ status: 0, message: 'Missing required name' });
            }
             if( !Array.isArray(userIds))
            {
                     return res.status(400).json({ status: 0, message: 'Missing required list user' });
            }

            const creator = await models.Users.findById(createdBy);
            if (!creator) {
                return res.status(400).json({ status: 0, message: 'Creator not found' });
            }

            // Bao gồm cả người tạo trong danh sách participants
            const participants = [
                { userId: creator._id, joinedAt: moment().toDate() },
                ...userIds.filter(id => id !== createdBy).map(id => ({
                    userId: new ObjectId(id),
                    joinedAt: moment().toDate()
                }))
            ];

            const newRoom = await models.Room.create({
                name,
                avatarUrl,
                type: 'group',
                participants,
                createdBy: creator._id,
                createdAt: moment().toDate()
            });

            return res.status(201).json({
                status: 1,
                message: 'Room created successfully',
                data: {
                    id: newRoom._id,
                    name: newRoom.name,
                    avatarUrl: newRoom.avatarUrl,
                    createdAt: newRoom.createdAt,
                    UpdateAtUser: newRoom.UpdateAtUser
                }
            });
        } catch (err) {
            return res.status(500).json({ status: 0, message: err.message });
        }
    });


    router.get('/list-friend', async (req, res) => {
        try {
            const UserID = req.UserID;

            // Lấy thông tin user hiện tại
            let user = await models.Users.findOne({ _id: new ObjectId(UserID) }).exec();
            if (!user) {
                return res.status(400).json({ status: 0, data: null, message: 'User not found' });
            }

            // Lấy danh sách user khác
            const listUser = await models.Users.find({ _id: { $ne: user._id } })
                .sort({ UpdateAt: -1 })
                .exec();

            let listCustomFriend = [];

            await Promise.all(listUser.map(async (value) => {
                const queryConditions = [
                    {
                        $or: [
                            { UserID: user._id, FriendID: value._id },
                            { UserID: value._id, FriendID: user._id }
                        ]
                    }
                ];

                // Lấy tin nhắn gần nhất
                const response = await models.Message.find({ $and: queryConditions })
                    .sort({ CreatedAt: -1 })
                    .limit(1);

                // Đếm tin nhắn chưa đọc
                const unreadCount = await models.Message.countDocuments({
                    UserID: value._id,     // friend gửi
                    FriendID: user._id,    // user nhận
                    isSend: 0
                });

                listCustomFriend.push({
                    Content: response.length > 0 ? response[0]?.Content : '',
                    Files: response.length > 0 ? response[0]?.Files : null,
                    CreatedAt: response.length > 0 ? response[0]?.CreatedAt : null,
                    Images: response.length > 0 ? response[0]?.Images : null,
                    isSend: response.length > 0 ? response[0]?.isSend : 0,
                    FriendID: value._id,
                    FullName: value.FullName,
                    Username: value.Username,
                    Avatar: value.Avatar,
                    UnreadCount: unreadCount,
                    UpdateAtUser: value.UpdateAt
                });
            }));

            // Lấy danh sách room mà user đang tham gia
            const listRoom = await models.Room.find({
                'participants.userId': new ObjectId(UserID)
            }).sort({ createdAt: -1 }).exec();

            // Cập nhật thời gian online
            await models.Users.updateOne({ _id: user._id }, { UpdateAt: moment().toDate() });

            // Trả về kết quả
            return res.status(200).json({
                status: 1,
                data: {
                    friends: listCustomFriend,
                    rooms: listRoom
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