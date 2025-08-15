const mongoose = require('mongoose')
const { ObjectId } = require('mongoose').Types
let image = new mongoose.Schema({
    urlImage: { type: String, required: null },
    FileName: { type: String, required: null }
})

let file = new mongoose.Schema({
    urlFile: { type: String, required: null },
    FileName: { type: String, required: null }
})
const messageReplySchema = new mongoose.Schema({
  _id: { type: ObjectId },             // ID của tin nhắn được reply
  Content: { type: String },
  Files: { type: file },
  Images : {type : image },
  UserReplyID :{type : String},
    whmessMain : {type : Object},

}, { _id: false });

let Message = new mongoose.Schema({
  UserID: { type: ObjectId, required: true },
  FriendID: { type: ObjectId, default : null },
  Content: { type: String },
  Files: { type: [file] },
  Images: { type: [image] },
  CreatedAt: { type: Date, default: null },
  UpdateAt: { type: Date, default: null },
  isSend: { type: Number, default: 0 },
  isDelete: { type: Boolean, default: false },
  MessageReply: { type: messageReplySchema, default: null },
  Emotion : {type : Number,default: null},
  roomId:    { type: ObjectId, ref: 'Room', default : null },
});
Message.pre('validate', function (next) {
  const hasFriend = !!this.FriendID;
  const hasRoom = !!this.roomId;

  if (hasFriend === hasRoom) {
    return next(new Error('Message must have either FriendID or roomId, but not both.'));
  }

  next();
});

let MessageModel = mongoose.model('message', Message)
module.exports = MessageModel