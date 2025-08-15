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

module.exports = () => {
    router.post('/update', upload.single('Avatar'), async (req, res) => {
        try {
            const UserID = req.UserID;
            const { FullName } = req.body;
            console.log("Body keys:", Object.keys(req.body)); // kiểm tra có dữ liệu không
            console.log(UserID);
            const user = await models.Users.findOne({ _id: new ObjectId(UserID) }).exec();
            if (!user) {
                return res.status(400).json({ status: 0, message: 'User not found' });
            }

            const updateObject = {};
            if (FullName) updateObject.FullName = FullName;

            // ✅ Xử lý file avatar nếu có
            if (req.file) {
                const file = req.file;
                const extension = file.originalname.split('.').pop();
                const nameFile = uuidv4();
                const fullPath = path.join(savePathImageAvatar, `${nameFile}.${extension}`);
                console.log(fullPath);
                fs.writeFileSync(fullPath, file.buffer);
                updateObject.Avatar = `/avatar/${nameFile}.${extension}`;
            }
            console.log(updateObject);
            updateObject.UpdateAt = moment().toDate();
            if (Object.keys(updateObject).length > 0) {
                await models.Users.updateOne({ _id: user._id }, updateObject);
            }

            return res.status(200).json({ status: 1, message: 'Update success' });
        } catch (error) {
            return res.status(400).json({ status: 0, message: error.message });
        }
    });


    router.get('/info', async (req, res) => {
        try {
            const UserID = req.UserID
            let user = await models.Users.findOne({ _id: new ObjectId(UserID) }).exec()
            if (user == null) {
                return res.status(400).json({ status: 0, data: null, message: 'User not found' })
            }
            return res.status(200).json({
                status: 1, data: {
                    Username: user?.Username,
                    FullName: user?.FullName,
                    Avatar: user?.Avatar
                }, message: ''
            })
        } catch (error) {
            return res.status(400).json({ status: 0, data: null, message: error.message })
        }
    })
    return router
}