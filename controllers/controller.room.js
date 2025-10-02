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
const { is, reduce } = require('bluebird');
const {createRoom,updateRoom,getInfoRoom,removeMember,addMember,removeRoom} = require('../services/service.room.js')
exports.createRoom = async(req,res) =>{
    try{
     const { createdBy, name, avatarUrl = null, userIds } = req.body;
         if (!createdBy) {
      return res.status(400).json({ status: 0, message: 'Missing required createdBy' });
    }
    if (!name) {
      return res.status(400).json({ status: 0, message: 'Missing required name' });
    }
    if (!Array.isArray(userIds)) {
      return res.status(400).json({ status: 0, message: 'Missing required userIds (array)' });
    }

    // --- Tìm creator ---
    if (!Types.ObjectId.isValid(createdBy)) {
      return res.status(400).json({ status: 0, message: 'createdBy is not valid ObjectId' });
    }
    const newRoom = await createRoom({createdBy, name, avatarUrl, userIds});
    return res.status(201).json({ status: 1, message: 'Room created successfully', newRoom });
    }
    catch(err){
        return res.status(err.status).json({status: 0,message:err.message,code:err.code});
    }
}
exports.updateRoom = async(req,res) =>{
   try {
    const roomId = req.params.roomId;
      const userId = req.UserID; // giả sử middleware auth đã gắn
      const { name } = req.body;
      const file = req.file;
      if (!ObjectId.isValid(roomId)) {
        return res.status(400).json({ status: 0, message: 'roomId không hợp lệ' });
      }
      await updateRoom({file,roomId,userId,name});
      return res.status(200).json({ status: 1, message: 'Update success' });
    } catch (err) {
      return res.status(err.status).json({ status: 0, message: err.message,code:err.code });
    }
}
exports.getInfoRoom = async(req,res)=> {
  try {
    const roomId = req.params.roomId;
    const userId = req.UserID;
    if (!ObjectId.isValid(roomId)) {
      return res.status(400).json({ status: 0, data: null, message: 'roomId không hợp lệ' });
    }
    const  infoRoom = await getInfoRoom({roomId,userId});
    return res.status(200).json({status : 1,data: infoRoom,message:'success'});
  } catch (err) {
    return res.status(err.status).json({ status: 0, data: null, message: err.message,code:err.code });
  }
};
exports.removeMember = async (req,res) =>{
 try {
    const roomId = req.params.roomId;
    const userId = req.UserID;
    const memberId = req.params.memberId;

    if (!ObjectId.isValid(roomId) || !ObjectId.isValid(memberId)) {
      return res.status(400).json({ status: 0, message: 'roomId hoặc memberId không hợp lệ' });
    }
    await removeMember({roomId,userId,memberId});
    return res.status(200).json({ status: 1, message: 'Xóa thành viên thành công' });
  }
  catch{
    return res.status(err.status).json({ status: 0, data: null, message: err.message,code:err.code });
  }
};
exports.addMember = async (req,res) =>{
   try {
    const { roomId } = req.params;
    const { newUserId } = req.body;
    const userId = req.UserID;

    if (!ObjectId.isValid(roomId) || !ObjectId.isValid(newUserId)) {
      return res.status(400).json({ status: 0, message: 'roomId hoặc newUserId không hợp lệ' });
    }
  await addMember({roomId,newUserId,userId});
    return res.status(200).json({ status: 1, message: 'Thêm thành viên thành công' });
  } catch (err) {
    return res.status(err.status).json({ status: 0, data: null, message: err.message,code:err.code });
  }
};
exports.removeRoom = async(req,res) =>{
  try {
    const roomId = req.params.roomId;
    const userId = req.UserID;

    if (!ObjectId.isValid(roomId)) {
      return res.status(400).json({ status: 0, message: 'roomId không hợp lệ' });
    }
    await removeRoom({roomId,userId});
    return res.status(200).json({ status: 1, message: 'Xóa nhóm thành công' });
  } catch (err) {
    return res.status(err.status).json({ status: 0, data: null, message: err.message,code:err.code });
  }
}