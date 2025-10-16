const moment = require('moment');
const { models } = require('../../database');
const presence = require('../State/OnlineUsers');
const { broadcastToRoom } = require('../Service/boardcast');
const { ObjectId } = require('mongoose').Types
module.exports = (io,socket) =>{
    socket.on("load_history", async ({ friendId = null, roomId = null, before = null, limit = 30 }) => {
      try {
        // Ép kiểu & giới hạn limit
        const userId = new ObjectId(socket.userId);
        const safeLimit = Math.min(Math.max(parseInt(limit) || 30, 1), 100);

        // Không cho truyền cả 2 hoặc không truyền cái nào
        if ((friendId && roomId) || (!friendId && !roomId)) {
          return socket.emit("chat_history", []); // hoặc emit lỗi riêng
        }

        let query = {};
        if (before) {
          query.CreatedAt = { $lt: new Date(before) };
        }

        if (friendId) {
          // ===== Chế độ 1-1 =====
          const friend = await models.Users.findById(friendId).lean();
          if (!friend) return socket.emit("chat_history", []);

          // Chỉ lấy tin nhắn 1-1 (roomId = null) giữa 2 user
          query = {
            ...query,
            roomId: null,
            $or: [
              { UserID: userId,      FriendID: friend._id },
              { UserID: friend._id,  FriendID: userId }
            ]
          };

        } else if (roomId) {
          // ===== Chế độ Room =====
        
          const roomObjectId = new ObjectId(roomId);

          // Bảo mật: chỉ trả lịch sử nếu user đang ở trong room
          const isMember = await models.Room.exists({
            _id: roomObjectId,
            'participants.userId': userId
          });
          if (!isMember) return socket.emit("chat_history", []);

          // Lấy tin theo roomId (không quan tâm FriendID/UserID)
          query = {
            ...query,
            roomId: roomObjectId
          };
        }

        // Lấy & chuẩn hoá kết quả
        const messages = await models.Message.find(query)
            .sort({ CreatedAt: -1 })
            .limit(safeLimit)
            .lean();

        const formatted = messages.reverse().map((msg) => ({
          id: msg._id,
          userID : msg.UserID,
          Content: msg.Content,
          Files: msg.Files,
          Images: msg.Images,
          CreatedAt: msg.CreatedAt,
          MessageType: (msg.UserID?.toString?.() === userId.toString()) ? 1 : 0, // 1 = mình gửi, 0 = người khác
          isSend: msg.isSend,
          isDelete: msg.isDelete,
          Emotion: msg.Emotion,
          MessageReply: msg.MessageReply
              ? {
                _id: msg.MessageReply._id,
                Content: msg.MessageReply?.Content,
                Files: msg.MessageReply?.Files,
                Images: msg.MessageReply?.Images,
                UserReplyID: msg.MessageReply?.UserID,
                whmessMain: msg.MessageReply?.whmessMain,
              }
              : null,
        }));

        socket.emit("chat_history", formatted);
        if (roomId && formatted.length > 0) {
      const lastMessageId = formatted[formatted.length - 1].id; 
      await models.MemberRoom.findOneAndUpdate(
        { roomId: new ObjectId(roomId), userId },
        {
          $max: { lastReadMessageId: lastMessageId },
          $set: { lastReadAt: new Date() }
        },
        { upsert: true }
      );
    }
      } catch (err) {
        console.error(" load_history error:", err);
      }
    });

}