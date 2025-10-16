const moment = require('moment');
const { models } = require('../../database');
const presence = require('../State/OnlineUsers');
const { broadcastToRoom } = require('../Service/boardcast');
const admin = require('../../firebase');
const { ObjectId } = require('mongoose').Types
module.exports = (io,socket) =>{
    socket.on("send_message", async ({ toUserId = null, roomId = null, content, images = [], files = [], messagereplyId = null, whmessMain = null }) => {
          try {
            const user = await models.Users.findById(socket.userId);
            if (!user) return;
    
            const replied = messagereplyId ? await models.Message.findById(messagereplyId) : null;
    
            // Tạo tin nhắn
            const message = await models.Message.create({
              UserID: user._id,
              FriendID: toUserId ? toUserId : null,
              roomId: roomId ? roomId : null,
              Content: content,
              Files: files,
              Images: images,
              CreatedAt: moment().toDate(),
              UpdateAt: moment().toDate(),
              isSend: 0,
              MessageReply: replied ? {
                _id: replied._id,
                Content: replied.Content,
                Files: replied?.Files[0],
                Images: replied?.Images[0],
                UserReplyID: replied.UserID,
                whmessMain: whmessMain
              } : null
            });
    
            const msgPayload = {
              id: message._id,
              Content: content,
              Files: files,
              userID : user._id,
              roomId: roomId,
              Images: images,
              CreatedAt: message.CreatedAt,
              isSend: 0,
              isDelete: false,
              MessageReply: replied ? {
                _id: replied._id,
                Content: replied.Content,
                Files: replied?.Files[0],
                Images: replied?.Images[0],
                UserReplyID: replied.UserID,
                whmessMain: whmessMain
              } : null,
              senderId: user._id.toString(),
              MessageType: 0
            };
    
            if (roomId) {
              //  Gửi tin nhắn đến tất cả thành viên room (ngoại trừ người gửi)
              const room = await models.Room.findById(roomId);
              await models.Room.updateOne({ _id: roomId }, { UpdateAt: moment().toDate() });
              if (!room) return;
    
              for (const participant of room.participants) {
                const participantId = participant.userId.toString();
                if (participantId === socket.userId.toString()) continue;
    
                const toSocketId = presence.getSocketId(participantId);
                if (!toSocketId) {
                  //Kiểm tra trạng thái thông báo
                  const pref = await models.MemberRoom.findOne(
                { userId: participantId, roomId: roomId },
                { isGetNotification: 1, _id: 0 }
              ).lean();
              const allow = pref ? pref.isGetNotification !== false : true; // mặc định true
    
                  io.to(toSocketId).emit("receive_message", msgPayload);
                  //  Gửi FCM
                     if (!allow) continue; // tắt => không gửi socket và FCM
                  const participantUser = await models.Users.findById(participantId);
                  if (participantUser?.fcmToken) {
                    const payload = {
                      token: participantUser.fcmToken,
                      // notification: {
                      //   title: `${user.FullName || user.Username}\n ${room.name}`,
                      //   body: content || "Bạn nhận được một tệp tin"
                      // },
                      data: {
                        type: 'chat',
                        senderId: user._id.toString(),
                        roomId: roomId,
                        url : `/main-chat/group/${roomId}`,
                        userID : user._id.toString()
                      }
                    };
                    try {
                      await admin.messaging().send(payload);
                    } catch (err) {
                      console.error(" FCM lỗi:", err.message);
                    }
                  }
                } else {
                  console.log(` User ${participantId} offline`);
                }
              }
            } else if (toUserId) {
              //  Chat cá nhân
              const friend = await models.Users.findById(toUserId);
              if (!friend) return;
    
              const toSocketId = presence.getSocketId(toUserId);
              if (!toSocketId) {
                const pref = await models.FriendShip.findOne(
              { UserID: toUserId, FriendID: user._id },
              { isGetNotification: 1, _id: 0 }
            ).lean();
            const allow = pref ? pref.isGetNotification !== false : true; // mặc định true
                  io.to(toSocketId).emit("receive_message", msgPayload);
            if(!allow)
            {
    
            }
            else{
    
                //  Gửi FCM
                if (friend.fcmToken) {
                  const payload = {
                    token: friend.fcmToken,
                    // notification: {
                    //   title: `${user.FullName || user.Username}`,
                    //   body: content || "Bạn nhận được một tệp tin"
                    // },
                    data: {
                      title: `${user.FullName || user.Username}`,
                      type: 'chat',
                      senderId: user._id.toString(),
                      content: content || '',
                      url : `/main-chat/solo/${user._id}`,
                      userID: user._id.toString()
                    }
                  };
                  try {
                    await admin.messaging().send(payload);
                  } catch (err) {
                    console.error("❌ FCM lỗi:", err.message);
                  }
                }
            }
            
              }
         
            }
            const userId = new ObjectId(socket.userId);
                 await models.MemberRoom.findOneAndUpdate(
            { roomId: new ObjectId(roomId), userId },
            {
              $max: { lastReadMessageId: message._id },
              $set: { lastReadAt: new Date() }
            },
            { upsert: true }
          );
            //  lại tin nhắn cho chính sender
            socket.emit("message_sent", {
              ...msgPayload,
              MessageType: 1
            });
    
          } catch (error) {
            console.error("❌ send_message error:", error);
          }
        });
    
}