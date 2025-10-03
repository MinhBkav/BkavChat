var express = require('express')
const appRoot = require('app-root-path');
var router = express.Router()
var mongoose = require('mongoose')
// var models = reqlib('database').models
const models = require(appRoot + '/database').models;
var moment = require('moment')
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwtUtils')
const saltRounds = 10;
const admin = require('../firebase') // Firebase Admin SDK
const {login,register,loginsocial} = require('../controllers/controller.auth')
router.post('/register',register);
router.post('/login',login);
router.post('/loginsocial',loginsocial);
module.exports = router;
