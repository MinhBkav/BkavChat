var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
const appRoot = require('app-root-path');
const models = require(appRoot + '/database').models;
// var models = reqlib('database').models
var moment = require('moment')
const { ObjectId } = require('mongoose').Types
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // hoặc .diskStorage()

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const currentDirectory = __dirname;
const parentDirectory = path.resolve(currentDirectory, '..', '..');
const savePathImageAvatar = `${parentDirectory}/images/avatar`;
const {updateUser,mute,getInfoUser} = require('../controllers/controller.user');
router.post('/update', upload.single('Avatar'),updateUser);
router.get('/info',getInfoUser);
router.post('/mute',mute);
module.exports = router;
