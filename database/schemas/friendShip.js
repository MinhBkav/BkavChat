const mongoose = require('mongoose')
const { ObjectId } = require('mongoose').Types
const FriendShip = new mongoose.Schema({
  UserID: { type: ObjectId, required: true },
  FriendID: { type: ObjectId, default : null },
  isGetNotification : {type : Boolean, default : true},
});
FriendShip.index({ UserID: 1, FriendID: 1 }, { unique: true });
let FriendShipModel = mongoose.model('FriendShip', FriendShip)
module.exports = FriendShipModel;