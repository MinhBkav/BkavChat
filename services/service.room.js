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
const { Types } = require('mongoose');
const { is } = require('bluebird');
const { create } = require('../database/schemas/users');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const fsp = fs.promises;
const { v4: uuidv4 } = require('uuid');
const {httpError} = require ('./helpder')
const currentDirectory = __dirname;
const parentDirectory = path.resolve(currentDirectory, '..', '..');
const savePathImageAvatar = `${parentDirectory}/images/avatar`;
async function ensureDir(p) {
  try { await fsp.mkdir(p, { recursive: true }); } catch (_) {}
}
async function assertIsParticipant(roomId, userId) {
  const exists = await models.Room.exists({
    _id: new ObjectId(roomId),
    'participants.userId': new ObjectId(userId),
  });
  return !!exists;
}

async function createRoom ({createdBy, name, avatarUrl = null, userIds}){
const creator = await models.Users.findById(createdBy).lean();
    if (!creator) {
      throw httpError(404,'Creator not found',{code: 'x5hok'})
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

    return newRoom;
};
async function updateRoom({file,roomId,userId,name}){
const canEdit = await assertIsParticipant(roomId, userId);
if(!canEdit) 
    throw httpError(403,'Chi quan tri vien moi dc update',{code: 'f79hfc'});
const room = await models.Room.findById(roomId).exec();
      if (!room) {
        throw httpError(404,'Không tìm thấy phòng',{code :'not found'});
      }
 const updateObject = {};

    if (typeof name === 'string' && name.trim()) {
      updateObject.name = name.trim();
    }

    // Xử lý file avatar nếu có
    if (file) {
      // Chỉ cho phép ảnh cơ bản
      const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'];
      if (!allowed.includes(file.mimetype)) {
        throw httpError(400,'Định dạng ảnh không hợp lệ',{code : '2sde2fkr22'});
      }
      await ensureDir(savePathImageAvatar);

      const ext = path.extname(file.originalname || '').toLowerCase() || '.png';
      const fileName = `${uuidv4()}${ext}`;
      const fullPath = path.join(savePathImageAvatar, fileName);

      await fsp.writeFile(fullPath, file.buffer);
      // Đường dẫn public bạn nhớ mount static: app.use('/avatar', express.static(path.join(parentDirectory, 'images', 'avatar')))
      updateObject.avatarUrl = `/avatar/${fileName}`;
    }

    updateObject.updatedAt = moment().toDate(); // schema Room của bạn đang có createdAt; bạn có thể bổ sung updatedAt

    if (Object.keys(updateObject).length === 0) {
      throw httpError(400,'Không có gì để cappj nhật ',{code: '1x000002kh'});
    }

    await models.Room.updateOne({ _id: new ObjectId(roomId) }, { $set: updateObject });

}
async function getInfoRoom({roomId,userId}) {

    const canView = await assertIsParticipant(roomId, userId);
    if (!canView) {
      throw httpError(403,'Không có quyền truy cập room này',{code:'5xhhhhh'});
    }

    const room = await models.Room.findById(roomId).lean();
    if (!room) {
      throw httpError(404,'Khong tim thấy room',{code:'not found'});
    }
   const infoRoom = {
        _id: room._id,
        name: room.name,
        avatarUrl: room.avatarUrl || null,
        type: room.type,
        participants: room.participants,
        createdBy: room.createdBy,
        createdAt: room.createdAt,
      }
      return infoRoom;
}
async function addMember({roomId,newUserId,userId}) {
    const room = await models.Room.findById(roomId);
    if (!room) {
      throw httpError(404,'Không tìm thấy phòng',{code:'Not found'});
    }

    const isCreator = room.createdBy.toString() === userId;
    const isParticipant = room.participants.some(p => p.userId.toString() === userId);

    if (!isCreator && !isParticipant) {
      throw httpError(403,'Khong có quyền thêm thành viên',{code:'5xhhhhh'});
    }

    const already = room.participants.some(p => p.userId.toString() === newUserId);
    if (already) {
      throw httpError(400,'Da có thành viên trong nhóm',{code:'2xhhhhh'});
    }

    const newUser = await models.Users.findById(newUserId, { FullName: 1, Avatar: 1 }).lean();
    if (!newUser) {
      throw httpError(404,'Không tìm thấy user',{code:'Not found'});
    }

    room.participants.push({
      userId: new ObjectId(newUserId),
      FullName: newUser.FullName || '',
      Avatar: newUser.Avatar || null,
      joinedAt: new Date()
    });
    room.UpdateAt = new Date();
    await room.save();
  } 
  async function removeMember({roomId,userId,memberId}) {
  
    const canRemove = await assertIsParticipant(roomId, userId);
    if (!canRemove) {
      throw httpError(403,'Không có quyền xóa thành viên',{code:'3xhhhhh'});
    }

    const room = await models.Room.findById(roomId);
    if (!room) {
      throw httpError(404,'Không tìm thấy phòng',{code:'Not found'});
    }

    const beforeCount = room.participants.length;
    room.participants = room.participants.filter(p => p.userId.toString() !== memberId);

    if (room.participants.length === beforeCount) {
      throw httpError(400,'Khong tìm thấy thành viên trong nhóm',{code:'5xhhhhh'});
    }

    room.updatedAt = new Date();
    await room.save();
};
async function removeRoom({roomId,userId}) {
    const room = await models.Room.findById(roomId);
    if (!room) {
      throw httpError(404,'Không tìm thấy phòng',{code:'Not found'});
    }

    if (room.createdBy.toString() !== userId) {
        throw httpError(403,'Chỉ người tạo nhóm mới có quyền xóa' ,{code:'3xhhhhh'});
    }
    await models.Room.deleteOne({ _id: new ObjectId(roomId) });
};

module.exports= {createRoom,updateRoom,getInfoRoom,removeMember,addMember,removeRoom};