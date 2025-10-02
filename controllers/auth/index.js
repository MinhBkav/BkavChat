var express = require('express')
const appRoot = require('app-root-path');
var router = express.Router()
var mongoose = require('mongoose')
// var models = reqlib('database').models
const models = require(appRoot + '/database').models;
var moment = require('moment')
const bcrypt = require('bcrypt');
const { generateToken } = require('../../utils/jwtUtils')
const saltRounds = 10;
const admin = require('../../firebase') // Firebase Admin SDK

module.exports = () => {
    // router.post('/register', async (req, res) => {
    //     try {
    //         const { FullName, Username, Password } = req.body
    //         let info = await models.Users.findOne({ Username: Username }).exec()
    //         if (info != null) {
    //             return res.status(400).json({ status: 0, data: null, message: 'Username already exists' })
    //         }
    //         bcrypt.hash(Password, saltRounds, async (err, hash) => {
    //             if (err) {
    //                 return res.status(400).json({ status: 0, data: null, message: err })
    //             }
    //             const user = await models.Users({
    //                 FullName: FullName,
    //                 Username: Username,
    //                 Password: hash,
    //                 CreatedAt: moment().toDate(),
    //                 UpdateAt: moment().toDate()
    //             }).save()
    //             // const token = await generateToken({
    //             //     uuid: user._id,
    //             //     FullName: FullName
    //             // })
    //             return res.status(200).json({
    //                 status: 1, 
    //                 // data: {
    //                 //     token: token,
    //                 //     Username: Username,
    //                 //     FullName: FullName,
    //                 //     Avatar: null
    //                 // },
    //                 message: 'success register'
    //             })
    //         });
    //     } catch (error) {
    //         return res.status(400).json({ status: 0, data: null, message: error.message })
    //     }
    // })
router.post('/register', async (req, res) => {
    try {
        const { idToken, Username } = req.body
        if (!idToken) {
            return res.status(400).json({ status: 0, message: 'Missing Firebase token' })
        }

        const decoded = await admin.auth().verifyIdToken(idToken)
        const firebaseUid = decoded.uid
        const email = decoded.email || null
        const name = Username

        // Kiểm tra đã có trong DB chưa
        let existing = await models.Users.findOne({ firebase_uid: firebaseUid }).exec()
        if (existing) {
            return res.status(400).json({ status: 0, message: 'User already exists' })
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

        return res.status(200).json({
            status: 1,
            data: {
                token,
                Username: user.Username,
                FullName: user.FullName,
                Avatar: user.Avatar || null
            },
            message: 'Register successful'
        })

    } catch (error) {
        console.error(error)
        return res.status(400).json({ status: 0, message: error.message })
    }
})
    // router.post('/login', async (req, res) => {
    //     try {
    //         const { Username, Password } = req.body
    //         let info = await models.Users.findOne({ Username: Username }).exec()
    //         if (info == null) {
    //             return res.status(400).json({
    //                 status: 0, data: null, message: 'Username not found'
    //             })
    //         }
    //         bcrypt.compare(Password, info.Password, async (err, isMatch) => {
    //             if (err) {
    //                 return res.status(400).json({ status: 0, data: null, message: err })
    //             }

    //             if (isMatch) {
    //                 await models.Users.updateOne({ _id: info._id }, { UpdateAt: moment().toDate() })
    //                 const token = await generateToken({
    //                     uuid: info._id,
    //                     FullName: info.FullName
    //                 })
    //                 return res.status(200).json({
    //                     status: 1, data: {
    //                         token: token,
    //                         Username: info?.Username,
    //                         FullName: info?.FullName,
    //                         Avatar: info?.Avatar
    //                     }, message: 'success register'
    //                 })
    //             } else {
    //                 return res.status(401).json({
    //                     status: 0, data: null, message: "Incorrect password"
    //                 })
    //             }
    //         });
    //     } catch (error) {
    //         return res.status(400).json({ status: 0, data: null, message: error.message })
    //     }
    // })
   router.post('/login', async (req, res) => {
    try {
    const { idToken, fcmToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ status: 0, message: 'Missing Firebase token' })
        }

        const decoded = await admin.auth().verifyIdToken(idToken)
        const firebaseUid = decoded.uid
        console.log("uid firebase",decoded.uid)

        // Kiểm tra tồn tại user
        const user = await models.Users.findOne({ firebase_uid: firebaseUid }).exec()

        if (!user) {
            return res.status(404).json({ status: 0, message: 'User not found. Please register first.' })
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

        return res.status(200).json({
            status: 1,
            data: {
                token,
                Username: user.Username,
                FullName: user.FullName,
                Avatar: user.Avatar || null,
                id : user._id
            },
            message: 'Login successful'
        })
    } catch (error) {
        console.error(error)
        return res.status(400).json({ status: 0, message: error.message })
    }
})
 router.post('/loginsocial', async (req, res) => {
    try {
    const { idToken, fcmToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ status: 0, message: 'Missing Firebase token' });
        }

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

        return res.status(200).json({
            status: 1,
            data: {
                token,
                Username: user.Username,
                FullName: user.FullName,
                Avatar: user.Avatar || null,
                id : user._id
            },
            message: 'Login successful'
        });

    } catch (error) {
        console.error(error);
        return res.status(400).json({ status: 0, message: error.message });
    }
});
    return router
}