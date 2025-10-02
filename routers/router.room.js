var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
// var models = reqlib('database').models
const appRoot = require('app-root-path');
const models = require(appRoot + '/database').models;
var moment = require('moment')
const { ObjectId } = require('mongoose').Types
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Types } = require('mongoose');
const { is } = require('bluebird');
var router = express.Router()
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const {createRoom,updateRoom,removeMember,removeRoom,addMember,getInfoRoom} = require('../controllers/controller.room.js')
router.post('/create-room',createRoom);
router.post('/:roomId/update', upload.single('avatar'), updateRoom);
router.get('/:roomId/info', getInfoRoom);
router.post('/:roomId/addmember',addMember);
router.delete('/:roomId/removemember/:memberId',removeMember);
router.delete('/:roomId/delete',removeRoom);
module.exports = router;
