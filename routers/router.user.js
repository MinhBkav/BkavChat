var express = require('express')
var router = express.Router()
// var models = reqlib('database').models
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // hoặc .diskStorage()

const {updateUser,mute,getInfoUser} = require('../controllers/controller.user');
router.post('/update', upload.single('Avatar'),updateUser);
router.get('/info',getInfoUser);
router.post('/mute',mute);
module.exports = router;
