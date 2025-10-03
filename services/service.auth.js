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
const {httpError} = require ('./helpder');
const admin = require('../firebase') // Firebase Admin SDK
async function register({idToken,Username}){
        const decoded = await admin.auth().verifyIdToken(idToken)
        const firebaseUid = decoded.uid
        const email = decoded.email || null
        const name = Username

        // Kiểm tra đã có trong DB chưa
        let existing = await models.Users.findOne({ firebase_uid: firebaseUid }).exec()
        if (existing) {
           throw httpError(400,'Missing Firebase exists',{code:'8xhhhhh'});

        }

        // Tạo mới user
        const user = await models.Users.create({
            firebase_uid: firebaseUid,
            Username: email.split('@')[0],
            FullName: name,
            CreatedAt: moment().toDate(),
            UpdateAt: moment().toDate()
        })

        // Tạo JWT nội bộ (tùy)
        const token = await generateToken({ uuid: user._id, FullName: user.FullName })

       return {
                token,
                Username: user.Username,
                FullName: user.FullName,
                Avatar: user.Avatar || null
            }
}
async function login({ idToken, fcmToken }){
        const decoded = await admin.auth().verifyIdToken(idToken)
        const firebaseUid = decoded.uid
        console.log("uid firebase",decoded.uid)

        // Kiểm tra tồn tại user
        const user = await models.Users.findOne({ firebase_uid: firebaseUid }).exec()

        if (!user) {
             throw httpError(404,'User not found. Please register first.',{code:'Not found'});
             }
        await models.Users.updateOne(
      { _id: user._id },
      {
        $set: {
          fcmToken: fcmToken || null,
        }
      }
    );
        // Cập nhật thời gian hoạt động
        // await models.Users.updateOne({ _id: user._id }, { UpdateAt: moment().toDate() })

        const token = await generateToken({ uuid: user._id, FullName: user.FullName })

        return  {
                token,
                Username: user.Username,
                FullName: user.FullName,
                Avatar: user.Avatar || null,
                id : user._id
            }
};
async function loginsocial({ idToken, fcmToken }){  
        // Giải mã idToken
        const decoded = await admin.auth().verifyIdToken(idToken);
        console.log(decoded);
        
        const firebaseUid = decoded.uid;
        const email = decoded.email || null;
        const name = decoded.name || email || 'NoName';

        // Tìm user trong DB
        let user = await models.Users.findOne({ firebase_uid: firebaseUid }).exec();

        // Nếu chưa có thì tạo mới
        if (!user) {
            user = await models.Users.create({
                firebase_uid: firebaseUid,
                Username: email.split('@')[0],
                FullName: name,
                Avatar: decoded.picture || null,
                CreatedAt: moment().toDate(),
                UpdateAt: moment().toDate()
            });
        } else {
            // Cập nhật thời gian hoạt động
            // await models.Users.updateOne({ _id: user._id }, { UpdateAt: moment().toDate() });
        }

         await models.Users.updateOne(
      { _id: user._id },
      {
        $set: {
          fcmToken: fcmToken || null,
        }
      }
    );
        // Tạo JWT
        const token = await generateToken({ uuid: user._id, FullName: user.FullName });

        return  {
                token,
                Username: user.Username,
                FullName: user.FullName,
                Avatar: user.Avatar || null,
                id : user._id
            }

}
module.exports = {login,register,loginsocial};