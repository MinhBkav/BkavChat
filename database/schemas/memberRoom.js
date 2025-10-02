const mongoose = require('mongoose')
const { ObjectId } = require('mongoose').Types
const MemberRoom = new mongoose.Schema({
  roomId:   { type: ObjectId, ref: 'Room', required: true,index :true },
  userId:   { type: ObjectId, ref: 'User', required: true, index : true },
  lastReadMessageId: { type: ObjectId, default: null }, // so sánh theo ObjectId time-order
  lastReadAt:        { type: Date, default: null },
  isGetNotification : {type : Boolean, default : true},
});
MemberRoom.index({ roomId: 1, userId: 1 }, { unique: true });
let MemberRoomModel = mongoose.model('MemberRoom', MemberRoom)
module.exports = MemberRoomModel;