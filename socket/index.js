// socket/index.js
const { verifyToken } = require('../utils/jwtUtils');
const models = require('../database').models;
const moment = require('moment');
const admin = require('../firebase');
const { decode } = require('jsonwebtoken');
const { ObjectId } = require('mongoose').Types;

const onlineUsers = new Map(); // UserID => socket.id

module.exports = (io) => {
  // Middleware xác thực JWT khi kết nối socket
  io.use(async (socket, next) => {
    try {
      const rawToken = socket.handshake.auth?.token;
      console.log(rawToken)
      if (!rawToken) return next(new Error("Unauthorized"));

      const token = rawToken.replace("Bearer ", "");
      const decoded = verifyToken(token);
      if (!decoded) return next(new Error("Invalid token"));

      const user = await models.Users.findOne({ _id: decoded.uuid });
      if (!user) return next(new Error("User not found"));
      socket.userId = decoded.uuid; // 👈 Gán đúng MongoDB _id để dùng sau
      console.log(user._id)
      console.log(decoded.uuid)
      onlineUsers.set(decoded.uuid, socket.id);
      console.log(socket.id);
      await models.Users.updateOne({ _id: decoded.uuid }, { UpdateAt: moment().toDate() });
      next();
    } catch (err) {
      return next(new Error("Authentication error"));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User ${socket.userId} connected`);
    const otherOnlineUsers = Array.from(onlineUsers.entries()).map(([userId, _]) => userId);
    io.emit("online_users", otherOnlineUsers);
    const broadcastToRoom = async (roomId, excludeUserId, event, payload) => {
      try {
        const room = await models.Room.findById(roomId).lean();
        if (!room) return;

        for (const p of room.participants || []) {
          const pid =
              (p.userId || p._id || p.id)?.toString?.() ||
              (typeof p === 'string' ? p : null);
          if (!pid || pid === excludeUserId.toString()) continue;

          const sid = onlineUsers.get(pid);
          if (sid) io.to(sid).emit(event, payload);
        }
      } catch (e) {
        console.error('broadcastToRoom error:', e.message);
      }
    };

    console.log("User dang online", otherOnlineUsers)
    // Gửi tin nhắn (đã refactor)
    // socket.on("send_message", async ({ toUserId = null,roomId = null, content, images = [], files = [], messagereplyId = null,whmessMain = null }) => {
    //   console.log("line 456",messagereplyId)
    //   console.log("line 45", whmessMain);
    //   console.log(files,images);
    //    try {
    //      const user = await models.Users.findById(socket.userId);
    //
    //       let friend = null;
    //       if(toUserId){
    //         friend = await models.Users.findById(toUserId);
    //       }
    //       else {
    //         friend = await models.Room.findById(roomId);
    //       }
    //
    //      if (!friend) return;
    //      const replied = messagereplyId ? await models.Message.findById(messagereplyId) : null;
    //      const message = await models.Message.create({
    //        UserID: user._id,
    //        FriendID: friend._id,
    //        Content: content,
    //        Files: files,
    //        Images: images,
    //        CreatedAt: moment().toDate(),
    //        UpdateAt: moment().toDate(),
    //        isSend: 0,
    //        MessageReply: replied
    //            ? {
    //              _id: replied._id,
    //              Content: replied.Content,
    //              Files: replied?.Files[0],
    //              Images : replied?.Images[0],
    //              UserReplyID: replied.UserID,
    //              whmessMain : whmessMain
    //            }
    //            : null,
    //
    //
    //      });
    //
    //      const toSocketId = onlineUsers.get(toUserId);
    //      console.log(toSocketId);
    //      if (toSocketId) {
    //        console.log("Nguoi dung online")
    //        io.to(toSocketId).emit("receive_message", {
    //          id: message._id,
    //          Content: content,
    //          Files: files,
    //          Images: images,
    //          CreatedAt: message.CreatedAt,
    //          MessageType: 0,
    //          senderId: user._id.toString(), // hoặc FriendID
    //          isSend: 0,
    //          MessageReply: replied
    //              ? {
    //                _id: replied._id,
    //                Content: replied.Content,
    //                Files: replied?.Files[0],
    //                Images : replied?.Images[0],
    //                UserReplyID: replied.UserID,
    //                whmessMain : whmessMain
    //              }
    //              : null,
    //
    //        });
    //        await models.Message.updateOne({ _id: message._id }, { isSend: 1 });
    //        if (friend.fcmToken) {
    //          try {
    //            const payload = {
    //              token: friend.fcmToken,
    //              notification: {
    //                title: `${user.FullName || user.Username}`,
    //                body: content || "Bạn nhận được một tệp tin"
    //              },
    //              data: {
    //                type: 'chat',
    //                senderId: user._id.toString(),
    //                content: content || ''
    //              }
    //            };
    //            await admin.messaging().send(payload);
    //          } catch (err) {
    //            console.error("❌ FCM lỗi:", err.message);
    //          }
    //        }
    //      } else {
    //        console.log("nguoi dung offline");
    //        // Gửi FCM nếu offline
    //        // if (friend.fcmToken) {
    //        //   try {
    //        //     const payload = {
    //        //       token: friend.fcmToken,
    //        //       notification: {
    //        //         title: `${user.FullName || user.Username}`,
    //        //         body: content || "Bạn nhận được một tệp tin"
    //        //       },
    //        //       data: {
    //        //         type: 'chat',
    //        //         senderId: user._id.toString(),
    //        //         content: content || ''
    //        //       }
    //        //     };
    //        //     await admin.messaging().send(payload);
    //        //   } catch (err) {
    //        //     console.error("❌ FCM lỗi:", err.message);
    //        //   }
    //        // }
    //      }
    //
    //      socket.emit("message_sent", {
    //        id: message._id,
    //        Content: content,
    //        Files: files,
    //        Images: images,
    //        CreatedAt: message.CreatedAt,
    //        MessageType: 1,
    //        isDelete: false,
    //        isSend : 0,
    //        MessageReply: replied
    //            ? {
    //              _id: replied._id,
    //              Content: replied.Content,
    //              Files: replied?.Files[0],
    //              Images : replied?.Images[0],
    //              UserReplyID: replied.UserID,
    //              whmessMain : whmessMain
    //            }
    //            : null,
    //
    //      });
    //    } catch (error) {
    //      console.error("❌ send_message error:", error);
    //    }
    //
    //
    // });
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
          // 🔁 Gửi tin nhắn đến tất cả thành viên room (ngoại trừ người gửi)
          const room = await models.Room.findById(roomId);
          if (!room) return;

          for (const participant of room.participants) {
            const participantId = participant.userId.toString();
            if (participantId === socket.userId.toString()) continue;

            const toSocketId = onlineUsers.get(participantId);
            if (toSocketId) {
              io.to(toSocketId).emit("receive_message", msgPayload);
              await models.Message.updateOne({ _id: message._id }, { isSend: 1 });

              // 🔔 Gửi FCM
              const participantUser = await models.Users.findById(participantId);
              if (participantUser?.fcmToken) {
                const payload = {
                  token: participantUser.fcmToken,
                  notification: {
                    title: `${user.FullName || user.Username}`,
                    body: content || "Bạn nhận được một tệp tin"
                  },
                  data: {
                    type: 'chat',
                    senderId: user._id.toString(),
                    roomId: roomId
                  }
                };
                try {
                  await admin.messaging().send(payload);
                } catch (err) {
                  console.error("❌ FCM lỗi:", err.message);
                }
              }
            } else {
              console.log(`🔕 User ${participantId} offline`);
            }
          }
        } else if (toUserId) {
          // 👤 Chat cá nhân
          const friend = await models.Users.findById(toUserId);
          if (!friend) return;

          const toSocketId = onlineUsers.get(toUserId);
          if (toSocketId) {
            io.to(toSocketId).emit("receive_message", msgPayload);
            await models.Message.updateOne({ _id: message._id }, { isSend: 1 });

            // 🔔 Gửi FCM
            if (friend.fcmToken) {
              const payload = {
                token: friend.fcmToken,
                notification: {
                  title: `${user.FullName || user.Username}`,
                  body: content || "Bạn nhận được một tệp tin"
                },
                data: {
                  type: 'chat',
                  senderId: user._id.toString(),
                  content: content || ''
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

        // ✅ Gửi lại tin nhắn cho chính sender
        socket.emit("message_sent", {
          ...msgPayload,
          MessageType: 1
        });

      } catch (error) {
        console.error("❌ send_message error:", error);
      }
    });

    // Load lịch sử chat
    const { Types } = require('mongoose');
    const { ObjectId } = Types;

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
        // Áp dụng mốc thời gian "before" (nếu có)
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
      } catch (err) {
        console.error("❌ load_history error:", err);
      }
    });

    socket.on("disconnect", async () => {
      console.log(`❌ User ${socket.userId} disconnected`);
      await models.Users.updateOne(
        { _id: socket.userId },
        { UpdateAt: moment().toDate() }
      );
      onlineUsers.delete(socket.userId);
      console.log(onlineUsers)
      console.log(new Date().toISOString())
      const otherOnlineUsers = Array.from(onlineUsers.entries()).map(([userId, _]) => userId);
      io.emit("online_users", otherOnlineUsers);
      console.log(otherOnlineUsers)
    });
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
          await broadcastToRoom(targetRoomId, userId, 'message_deleted', {
            messageId,
            roomId: targetRoomId,
          });
        } else {
          const friendId = message.FriendID?.toString?.();
          if (friendId) {
            const toSocketId = onlineUsers.get(friendId);
            if (toSocketId) {
              io.to(toSocketId).emit('message_deleted', { messageId });
            }
          }
        }

        console.log(`🗑️ Tin nhắn ${messageId} đã bị xóa bởi ${userId}`);
      } catch (err) {
        console.error('❌ delete_message error:', err.message);
        socket.emit('error_message', { message: 'Xóa tin nhắn thất bại' });
      }
    });
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
          await broadcastToRoom(targetRoomId, userId, 'message_repaired', {
            messageId,
            Content,
            roomId: targetRoomId,
          });
        } else {
          const friendId = message.FriendID?.toString?.();
          if (friendId) {
            const toSocketId = onlineUsers.get(friendId);
            if (toSocketId) {
              io.to(toSocketId).emit('message_repaired', { messageId, Content });
            }
          }
        }

        console.log(`✏️ Tin nhắn ${messageId} đã sửa bởi ${userId}`);
      } catch (err) {
        console.error('❌ repair_message error:', err.message);
        socket.emit('error_message', { message: 'sửa tin nhắn thất bại' });
      }
    });
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
          await broadcastToRoom(targetRoomId, userId, 'message_emotioned', {
            messageId,
            emotion,
            roomId: targetRoomId,
          });
        } else {
          const friendId = message.FriendID?.toString?.();
          if (friendId) {
            const toSocketId = onlineUsers.get(friendId);
            if (toSocketId) {
              io.to(toSocketId).emit('message_emotioned', { messageId, emotion });
            }
          }
        }

        console.log(`😊 Emotion cập nhật cho message ${messageId} bởi ${userId}`);
      } catch (err) {
        console.error('❌ emotion_message error:', err.message);
        socket.emit('error_message', { message: 'Cập nhật cảm xúc thất bại' });
      }
    });

    // ========== DISCONNECT ==========
    socket.on('disconnect', async () => {
      console.log(`❌ User ${socket.userId} disconnected`);
      await models.Users.updateOne(
          { _id: socket.userId },
          { UpdateAt: moment().toDate() }
      );
      onlineUsers.delete(socket.userId);

      const otherOnlineUsers = Array.from(onlineUsers.keys());
      io.emit('online_users', otherOnlineUsers);
    });
  });
};