const mongoose = require('mongoose')
const { ObjectId } = require('mongoose').Types
const Room = new mongoose.Schema({
    name:        { type: String, required: true },     // tên phòng hoặc mô tả
    type:        { type: String, enum: ['private','group'], default: 'group' },
    participants:[{ userId: { type: ObjectId, ref: 'User' }, joinedAt: Date }],
    createdBy:   { type: ObjectId, ref: 'User' },
    createdAt:   { type: Date, default: Date.now },
    avatarUrl:   { type: String },
    UpdateAtUser : {type: Date, default: Date.now },
});
let RoomModel = mongoose.model('Room', Room)
module.exports = RoomModel