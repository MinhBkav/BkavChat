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

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const currentDirectory = __dirname;
const parentDirectory = path.resolve(currentDirectory, '..', '..');
const savePathImageAvatar = `${parentDirectory}/images/avatar`;

module.exports = () => {
    router.post('/update', upload.single('Avatar'), async (req, res) => {
        try {
            const UserID = req.UserID;
            const { FullName } = req.body;
            console.log("Body keys:", Object.keys(req.body)); // kiểm tra có dữ liệu không
            console.log(UserID);
            const user = await models.Users.findOne({ _id: new ObjectId(UserID) }).exec();
            if (!user) {
                return res.status(400).json({ status: 0, message: 'User not found' });
            }
            const updateObject = {Avatar : null,FullName : null};
            if (FullName) updateObject.FullName = FullName;

            //  Xử lý file avatar nếu có
            if (req.file) {
                const file = req.file;
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
            return res.status(200).json({ status: 1, message: 'Update success',updateObject });
        } catch (error) {
            return res.status(400).json({ status: 0, message: error.message });
        }
    });


    router.get('/info', async (req, res) => {
        try {
            const UserID = req.UserID
            let user = await models.Users.findOne({ _id: new ObjectId(UserID) }).exec()
            if (user == null) {
                return res.status(400).json({ status: 0, data: null, message: 'User not found' })
            }
            return res.status(200).json({
                status: 1, data: {
                    Username: user?.Username,
                    FullName: user?.FullName,
                    Avatar: user?.Avatar
                }, message: ''
            })
        } catch (error) {
            return res.status(400).json({ status: 0, data: null, message: error.message })
        }
    })
    const { Types: { ObjectId } } = require('mongoose');

/// Mute Notification
router.post('/mute', async (req, res) => {
  try {
    const userID = req.UserID;
    const { type, id } = req.body;
    console.log(userID,id);
    if (!userID || !type || !id) {
      return res.status(400).json({ ok: false, message: 'Thiếu userID/type/id' });
    }
    if (!ObjectId.isValid(userID) || !ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, message: 'ID không hợp lệ' });
    }

    const userObjId = new ObjectId(userID);

    if (type === 'solo') {
      // toggle giữa userID (người nhận) và FriendID = id (người gửi/đối tác)
      const friendObjId = new ObjectId(id);
      if (userObjId.equals(friendObjId)) {
        return res.status(400).json({ ok: false, message: 'Không thể mute chính mình' });
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
        return res.json({
          ok: true,
          scope: 'solo',
          targetId: id,
          isGetNotification: doc.isGetNotification // false
        });
      } else {
        // đã có => đảo trạng thái
        doc.isGetNotification = !doc.isGetNotification;
        await doc.save();
        return res.json({
          ok: true,
          scope: 'solo',
          targetId: id,
          isGetNotification: doc.isGetNotification
        });
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
        return res.json({
          ok: true,
          scope: 'group',
          roomId: id,
          isGetNotification: mr.isGetNotification // false
        });
      } else {
        // đã có => đảo trạng thái
        mr.isGetNotification = !mr.isGetNotification;
        await mr.save();
        return res.json({
          ok: true,
          scope: 'group',
          roomId: id,
          isGetNotification: mr.isGetNotification
        });
      }

    } else {
      return res.status(400).json({ ok: false, message: 'type phải là "solo" hoặc "group"' });
    }

  } catch (err) {
    console.error('POST /mute error:', err);
    // duplicate key khi thiếu unique index?
    if (err?.code === 11000) {
      return res.status(409).json({ ok: false, message: 'Trùng cặp (duplicate key)' });
    }
    return res.status(500).json({ ok: false, message: 'Internal server error' });
  }
});

    return router
}