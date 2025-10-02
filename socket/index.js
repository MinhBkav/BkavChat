// socket/index.js
const models = require('../database').models;
const moment = require('moment');
const admin = require('../firebase');
const { decode } = require('jsonwebtoken');
const { ObjectId } = require('mongoose').Types;
const Authentication = require('./Middleware/AuthSocket')
const onlineUsers = new Map(); // UserID => socket.id
const listUserOnline = require('./HandlerMessage/ListUsserOnline')
const presence = require('./State/OnlineUsers')
const registerDeleteMessage = require('./HandlerMessage/DeleteMessage');
const registerEmotionMessage = require('./HandlerMessage/EmotionMessage');
const registerRepairMessage = require('./HandlerMessage/RepairMessage');
const registerSendMessage = require('./HandlerMessage/SendMessage');
const registerHistoryMessage = require('./HandlerMessage/HistoryMessage');
const { Types } = require('mongoose');

module.exports = (io) => {
  Authentication(io);
  io.on('connection', (socket) => {
    console.log(` User ${socket.userId} connected`);
    listUserOnline(io);
    console.log("User dang online",presence.listUserIds());
    registerSendMessage(io,socket);
    registerHistoryMessage(io,socket);
    registerDeleteMessage(io,socket);
    registerEmotionMessage(io,socket);
    registerRepairMessage(io,socket);

    socket.on("disconnect", async () => {
      console.log(` User ${socket.userId} disconnected`);
      await models.Users.updateOne(
        { _id: socket.userId },
        { UpdateAt: moment().toDate()}
      );
      onlineUsers.delete(socket.userId);
      console.log(onlineUsers)
      console.log(new Date().toISOString())
  const otherOnlineUsers = Array.from(presence.getmap().entries()).map(([userId, _]) => userId);
      io.emit("online_users", otherOnlineUsers);
      console.log(otherOnlineUsers)
    });
    
       socket.on('disconnect', async () => {
      console.log(` User ${socket.userId} disconnected`);
      await models.Users.updateOne(
          { _id: socket.userId },
          { UpdateAt: moment().toDate() }
      );
      onlineUsers.delete(socket.userId);

      const otherOnlineUsers = Array.from(presence.getmap().keys());
      io.emit('online_users', otherOnlineUsers);
    });
    
  });
};