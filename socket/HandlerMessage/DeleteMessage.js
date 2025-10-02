
    const moment = require('moment');
    const { models } = require('../../database');
    const presence = require('../State/OnlineUsers');
    const { broadcastToRoom } = require('../Service/boardcast');
    const { ObjectId } = require('mongoose').Types
module.exports = (io,socket) =>{
socket.on('delete_message', async ({ messageId, roomId = null }) => {
      try {
        const userId = socket.userId;
        const message = await models.Message.findById(messageId);

        if (!message) return console.log('tin nhan khong ton tai');
        if (!message.UserID.equals(userId)) {
          return console.log('khong the xoa tin nhan cua nguoi khac');
        }

        await models.Message.updateOne(
            { _id: messageId },
            {
              Content: 'Tin nhắn đã thu hồi',
              Files: [],
              Images: [],
              isDelete: true,
              MessageReply: null,
              Emotion: null,
            }
        );

        // Gửi cho chính người gửi
        socket.emit('message_deleted', {
          messageId,
          roomId: message.roomId || null,
          
        });

        // Group hay Solo?
        const targetRoomId = message.roomId || roomId;
        if (targetRoomId) {
          await broadcastToRoom(io,targetRoomId, userId, 'message_deleted', {
            messageId,
            roomId: targetRoomId,
          });
        } else {
          const friendId = message.FriendID?.toString?.();
          if (friendId) {
            const toSocketId = presence.getSocketId(friendId);
            if (toSocketId) {
              io.to(toSocketId).emit('message_deleted', { messageId });
            }
          }
        }

        console.log(`🗑️ Tin nhắn ${messageId} đã bị xóa bởi ${userId}`);
      } catch (err) {
        console.error(' delete_message error:', err.message);
        socket.emit('error_message', { message: 'Xóa tin nhắn thất bại' });
      }
    });    }