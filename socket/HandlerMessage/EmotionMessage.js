
    const moment = require('moment');

    const { models } = require('../../database');
    const presence = require('../State/OnlineUsers');
    const { broadcastToRoom } = require('../Service/boardcast');
    const { ObjectId } = require('mongoose').Types
module.exports = (io,socket) =>{
    socket.on('emotion_message', async ({ messageId, emotion, roomId = null }) => {
      try {
        const userId = socket.userId;
        const message = await models.Message.findById(messageId);

        if (!message) return console.log('tin nhan khong ton tai');

        await models.Message.updateOne(
            { _id: messageId },
            { Emotion: emotion }
        );

        // Gửi cho chính người gửi
        socket.emit('message_emotion', {
          messageId,
          emotion,
          roomId: message.roomId || null,
        });

        const targetRoomId = message.roomId || roomId;
        if (targetRoomId) {
          await broadcastToRoom(io,targetRoomId, userId, 'message_emotioned', {
            messageId,
            emotion,
            roomId: targetRoomId,
          });
          console.log("gui change emotion vao nhóm line 599")
        } else {
          let idownMessage;
          const friendId = message.FriendID?.toString?.();
          console.log(friendId,userId,"line 603")
          if(friendId == userId){
            idownMessage = message.UserID?.toString?.();
            console.log("Tin nhan cua friend");
          }
              
          else
            idownMessage = friendId;
          if (idownMessage) {
            const toSocketId = presence.getSocketId(idownMessage);
            if (toSocketId) {
              io.to(toSocketId).emit('message_emotioned', { messageId, emotion });
              console.log("đã gửi emotion line 605");
            }

          }
        }

        console.log(` Emotion cập nhật cho message ${messageId} bởi ${userId}`);
      } catch (err) {
        console.error('emotion_message error:', err.message);
        socket.emit('error_message', { message: 'Cập nhật cảm xúc thất bại' });
      }
    });
}