const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const appRoot = require('app-root-path');
const models = require(appRoot + '/database').models;
const moment = require('moment');
const { ObjectId } = require('mongoose').Types;
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const currentDirectory = __dirname;
const parentDirectory = path.resolve(currentDirectory, '..', '..');
const savePathImageAvatar = `${parentDirectory}/images/avatar`;

// Helper: đảm bảo thư mục tồn tại
async function ensureDir(p) {
  try { await fsp.mkdir(p, { recursive: true }); } catch (_) {}
}

// Helper: kiểm tra user có trong room
async function assertIsParticipant(roomId, userId) {
  const exists = await models.Room.exists({
    _id: new ObjectId(roomId),
    'participants.userId': new ObjectId(userId),
  });
  return !!exists;
}

// =================== UPDATE ROOM ===================
// POST /rooms/:roomId/update
router.post('/:roomId/update', upload.single('avatar'), async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const userId = req.UserID; // giả sử middleware auth đã gắn
    const { name } = req.body;
    if (!ObjectId.isValid(roomId)) {
      return res.status(400).json({ status: 0, message: 'roomId không hợp lệ' });
    }

    // Chỉ cho phép participant cập nhật
    const canEdit = await assertIsParticipant(roomId, userId);
    if (!canEdit) {
      return res.status(403).json({ status: 0, message: 'Không có quyền cập nhật room này' });
    }

    const room = await models.Room.findById(roomId).exec();
    if (!room) {
      return res.status(404).json({ status: 0, message: 'Room not found' });
    }

    const updateObject = {};

    if (typeof name === 'string' && name.trim()) {
      updateObject.name = name.trim();
    }

    // Xử lý file avatar nếu có
    if (req.file) {
      // Chỉ cho phép ảnh cơ bản
      const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'];
      if (!allowed.includes(req.file.mimetype)) {
        return res.status(400).json({ status: 0, message: 'Định dạng ảnh không hợp lệ' });
      }

      await ensureDir(savePathImageAvatar);

      const ext = path.extname(req.file.originalname || '').toLowerCase() || '.png';
      const fileName = `${uuidv4()}${ext}`;
      const fullPath = path.join(savePathImageAvatar, fileName);

      await fsp.writeFile(fullPath, req.file.buffer);
      // Đường dẫn public bạn nhớ mount static: app.use('/avatar', express.static(path.join(parentDirectory, 'images', 'avatar')))
      updateObject.avatarUrl = `/avatar/${fileName}`;
    }

    updateObject.updatedAt = moment().toDate(); // schema Room của bạn đang có createdAt; bạn có thể bổ sung updatedAt

    if (Object.keys(updateObject).length === 0) {
      return res.status(400).json({ status: 0, message: 'Không có gì để cập nhật' });
    }

    await models.Room.updateOne({ _id: new ObjectId(roomId) }, { $set: updateObject });

    return res.status(200).json({ status: 1, message: 'Update success' });
  } catch (error) {
    return res.status(400).json({ status: 0, message: error.message });
  }
});

// =================== ROOM INFO ===================
// GET /rooms/:roomId/info
router.get('/:roomId/info', async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const userId = req.UserID;
    if (!ObjectId.isValid(roomId)) {
      return res.status(400).json({ status: 0, data: null, message: 'roomId không hợp lệ' });
    }

    // Chỉ cho phép participant xem info
    const canView = await assertIsParticipant(roomId, userId);
    if (!canView) {
      return res.status(403).json({ status: 0, data: null, message: 'Không có quyền truy cập room này' });
    }

    const room = await models.Room.findById(roomId).lean();
    if (!room) {
      return res.status(404).json({ status: 0, data: null, message: 'Room not found' });
    }

    return res.status(200).json({
      status: 1,
      data: {
        _id: room._id,
        name: room.name,
        avatarUrl: room.avatarUrl || null,
        type: room.type,
        participants: room.participants,
        createdBy: room.createdBy,
        createdAt: room.createdAt,
      },
      message: '',
    });
  } catch (error) {
    return res.status(400).json({ status: 0, data: null, message: error.message });
  }
});

// =================== ADD MEMBER ===================
// POST /rooms/:roomId/addmember
router.post('/:roomId/addmember', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { newUserId } = req.body;
    const userId = req.UserID;

    if (!ObjectId.isValid(roomId) || !ObjectId.isValid(newUserId)) {
      return res.status(400).json({ status: 0, message: 'roomId hoặc newUserId không hợp lệ' });
    }

    const room = await models.Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ status: 0, message: 'Room not found' });
    }

    const isCreator = room.createdBy.toString() === userId;
    const isParticipant = room.participants.some(p => p.userId.toString() === userId);

    if (!isCreator && !isParticipant) {
      return res.status(403).json({
        status: 0,
        message: 'Không có quyền thêm thành viên'
      });
    }

    const already = room.participants.some(p => p.userId.toString() === newUserId);
    if (already) {
      return res.status(400).json({ status: 0, message: 'Người dùng đã có trong nhóm' });
    }

    // 🔹 Lấy thông tin user mới
    const newUser = await models.Users.findById(newUserId, { FullName: 1, Avatar: 1 }).lean();
    if (!newUser) {
      return res.status(404).json({ status: 0, message: 'User not found' });
    }

    // 🔹 Thêm user đầy đủ thông tin vào participants
    room.participants.push({
      userId: new ObjectId(newUserId),
      FullName: newUser.FullName || '',
      Avatar: newUser.Avatar || null,
      joinedAt: new Date()
    });
    room.UpdateAt = new Date();
    await room.save();

    return res.status(200).json({ status: 1, message: 'Thêm thành viên thành công' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 0, message: error.message });
  }
});


// =================== REMOVE MEMBER ===================
// DELETE /rooms/:roomId/removemember/:memberId
router.delete('/:roomId/removemember/:memberId', async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const userId = req.UserID;
    const memberId = req.params.memberId;

    if (!ObjectId.isValid(roomId) || !ObjectId.isValid(memberId)) {
      return res.status(400).json({ status: 0, message: 'roomId hoặc memberId không hợp lệ' });
    }

    const canRemove = await assertIsParticipant(roomId, userId);
    if (!canRemove) {
      return res.status(403).json({ status: 0, message: 'Không có quyền xóa thành viên' });
    }

    const room = await models.Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ status: 0, message: 'Room not found' });
    }

    const beforeCount = room.participants.length;
    room.participants = room.participants.filter(p => p.userId.toString() !== memberId);

    if (room.participants.length === beforeCount) {
      return res.status(400).json({ status: 0, message: 'Thành viên không tồn tại trong nhóm' });
    }

    room.updatedAt = new Date();
    await room.save();

    return res.status(200).json({ status: 1, message: 'Xóa thành viên thành công' });
  } catch (error) {
    return res.status(400).json({ status: 0, message: error.message });
  }
});

// =================== DELETE ROOM ===================
// DELETE /rooms/:roomId/delete
router.delete('/:roomId/delete', async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const userId = req.UserID;

    if (!ObjectId.isValid(roomId)) {
      return res.status(400).json({ status: 0, message: 'roomId không hợp lệ' });
    }

    const room = await models.Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ status: 0, message: 'Room not found' });
    }

    if (room.createdBy.toString() !== userId) {
      return res.status(403).json({ status: 0, message: 'Chỉ người tạo nhóm mới có quyền xóa' });
    }

    await models.Room.deleteOne({ _id: new ObjectId(roomId) });

    return res.status(200).json({ status: 1, message: 'Xóa nhóm thành công' });
  } catch (error) {
    return res.status(400).json({ status: 0, message: error.message });
  }
});


module.exports = () => router;
