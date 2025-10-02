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

const currentDirectory = __dirname;
const parentDirectory = path.resolve(currentDirectory, '..', '..');
const savePathImage = `${parentDirectory}/images`;
const savePathFile = `${parentDirectory}/files`;
const {getListFriend} = require('../controllers/controller.friend')
router.get('/list-friend', getListFriend); 
module.exports = router;
