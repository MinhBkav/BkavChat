
    const moment = require('moment');
    const { models } = require('../../database');
    const presence = require('../State/OnlineUsers');
    const { broadcastToRoom } = require('../Service/boardcast');
    const { ObjectId } = require('mongoose').Types
module.exports = (io,socket) =>{
         socket.on('repair_message', async ({ messageId, Content, roomId = null }) => {
      try {
        const userId = socket.userId;
        const message = await models.Message.findById(messageId);

        if (!message) return console.log('tin nhan khong ton tai');
        if (!message.UserID.equals(userId)) {
          return console.log('khong the sua tin nhan cua nguoi khac');
        }
        if (message.isDelete) {
          return console.log('khong duoc sua tin nhan da xoa');
        }

        await models.Message.updateOne(
            { _id: messageId },
            { Content, Files: [], Images: [] }
        );

        // Gửi cho chính người gửi
        socket.emit('message_repaired', {
          messageId,
          Content,
          roomId: message.roomId || null,
        });

        const targetRoomId = message.roomId || roomId;
        if (targetRoomId) {
          await broadcastToRoom(io,targetRoomId, userId, 'message_repaired', {
            messageId,
            Content,
            roomId: targetRoomId,
          });
        } else {
          const friendId = message.FriendID?.toString?.();
          if (friendId) {
            const toSocketId = presence.getSocketId(friendId);
            if (toSocketId) {
              io.to(toSocketId).emit('message_repaired', { messageId, Content });
            }
          }
        }

        console.log(` Tin nhắn ${messageId} đã sửa bởi ${userId}`);
      } catch (err) {
        console.error(' repair_message error:', err.message);
        socket.emit('error_message', { message: 'sửa tin nhắn thất bại' });
      }
    });
}