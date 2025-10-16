// var models = reqlib('database').models
const path = require('path');
const {sendMessage,getMessage} = require('../services/service.message')
const currentDirectory = __dirname;
const parentDirectory = path.resolve(currentDirectory, '..', '..');
const savePathImage = `${parentDirectory}/images`;
const savePathFile = `${parentDirectory}/files`;
exports.sendMessage = async(req,res) =>{
     try {
          const UserID = req.UserID;
          const { FriendID, Content } = req.body;
          const files = req.files;
          const messageSend = await sendMessage({files,UserID,FriendID,Content});
        return res.status(200).json({status : 1,data: messageSend,message:'Send sucess'})
        } catch (err) {
                          return res.status(err.status|| 400).json({status: 0,message:err.message});
        }
};
exports.getMessage = async(req,res) =>{
  try {
            const UserID = req.UserID
            const { FriendID, LastTime } = req.query
            const messageGet = await getMessage({UserID,FriendID,LastTime});
            return res.status(200).json({ status: 1, data: messageGet, message: "" })
        } catch (err) {
                          return res.status(err.status|| 400).json({status: 0,message:err.message});
        }
};