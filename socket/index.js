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
      await models.Users.updateOne({ _id: decoded.uuid }, { UpdateAt: moment().toDate()});
      next();
    } catch (err) {
      return next(new Error("Authentication error"));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User ${socket.userId} connected`);

    // Gửi tin nhắn (đã refactor)
    socket.on("send_message", async ({ toUserId, content, images = [], files = [] }) => {
      try {
        const user = await models.Users.findById(socket.userId);
        const friend = await models.Users.findById(toUserId);
        if (!friend) return;

        const message = await models.Message.create({
          UserID: user._id,
          FriendID: friend._id,
          Content: content,
          Files: files,
          Images: images,
          CreatedAt: moment().toDate(),
          UpdateAt: moment().toDate(),
          isSend: 0
        });

        const toSocketId = onlineUsers.get(toUserId);
        console.log(toSocketId);
        if (toSocketId) {
          console.log("Nguoi dung online")
          io.to(toSocketId).emit("receive_message", {
            id: message._id,
            Content: content,
            Files: files,
            Images: images,
            CreatedAt: message.CreatedAt,
            MessageType: 0,
              senderId: user._id.toString(), // hoặc FriendID
              isSend : 0
          });
          await models.Message.updateOne({ _id: message._id }, { isSend: 1 });
           if (friend.fcmToken) {
            try {
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
              await admin.messaging().send(payload);
            } catch (err) {
              console.error("❌ FCM lỗi:", err.message);
            }
          }
        } else {
          console.log("nguoi dung offline");
          // Gửi FCM nếu offline
          // if (friend.fcmToken) {
          //   try {
          //     const payload = {
          //       token: friend.fcmToken,
          //       notification: {
          //         title: `${user.FullName || user.Username}`,
          //         body: content || "Bạn nhận được một tệp tin"
          //       },
          //       data: {
          //         type: 'chat',
          //         senderId: user._id.toString(),
          //         content: content || ''
          //       }
          //     };
          //     await admin.messaging().send(payload);
          //   } catch (err) {
          //     console.error("❌ FCM lỗi:", err.message);
          //   }
          // }
        }

        socket.emit("message_sent", {
          id: message._id,
          Content: content,
          Files: files,
          Images: images,
          CreatedAt: message.CreatedAt,
          MessageType: 1,

        });
      } catch (error) {
        console.error("❌ send_message error:", error);
      }
    });

    // Load lịch sử chat
     socket.on("load_history", async ({ friendId, before, limit = 30 }) => {
  try {
    const userId = socket.userId;
    const friend = await models.Users.findById(friendId);
    if (!friend) return;

    const query = {
      $or: [
        { UserID: new ObjectId(userId), FriendID: friend._id },
        { UserID: friend._id, FriendID: new ObjectId(userId) }
      ]
    };

    if (before) {
      query.CreatedAt = { $lt: new Date(before) }; //  lấy các tin nhắn trước mốc thời gian
      console.log("load them tin nhan");
    }
  else {
          console.log("load dau tin nhan");

  }
    const messages = await models.Message.find(query)
      .sort({ CreatedAt: -1 }) //  lấy tin nhắn mới nhất trước
      .limit(limit);

    const formatted = messages.reverse().map((msg) => ({
      id: msg._id,
      Content: msg.Content,
      Files: msg.Files,
      Images: msg.Images,
      CreatedAt: msg.CreatedAt,
      MessageType: msg.UserID.equals(userId) ? 1 : 0,
      isSend: msg.isSend
    }));

    socket.emit("chat_history", formatted);
  } catch (err) {
    console.error("❌ load_history error:", err.message);
  }
});
    socket.on("disconnect", () => {
      console.log(`❌ User ${socket.userId} disconnected`);
      onlineUsers.delete(socket.userId);
      console.log(onlineUsers)
      console.log(new Date().toISOString())
    });
  });
};
