 const { verifyToken } = require('../../utils/jwtUtils');
const models = require('../../database').models;
const moment = require('moment');
const admin = require('../../firebase');
const { decode } = require('jsonwebtoken');
const { ObjectId } = require('mongoose').Types;
const presence = require('../State/OnlineUsers'); // map online

 module.exports =(io) =>{
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
      socket.userId = decoded.uuid; //  Gán đúng MongoDB _id để dùng sau
      console.log(user._id)
      console.log(decoded.uuid)
      presence.setOnline(decoded.uuid, socket.id);
      console.log(socket.id);
      await models.Users.updateOne({ _id: decoded.uuid }, { UpdateAt: moment().toDate() });
      next();
    } catch (err) {
      return next(new Error("Authentication error"));
    }
  });
 }