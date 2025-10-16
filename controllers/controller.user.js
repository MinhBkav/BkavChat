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
const {getInfoUser,updateUser,mute} = require('../services/service.user');
exports.getInfoUser= async (req,res) =>{
         try {
            const UserID = req.UserID;
            const InfoUser = await getInfoUser({UserID});
            return res.status(200).json({status: 1,data: InfoUser,message:'Sucess'});
        } catch (err) {
                          return res.status(err.status|| 400).json({status: 0,message:err.message});
        }
};
exports.updateUser = async(req,res) =>{
      try {
                const UserID = req.UserID;
                const { FullName } = req.body;
                const file  = req.file;
                const InfoUpdate = await updateUser({file,UserID,FullName})
                return res.status(200).json({ status: 1, message: 'Update success',InfoUpdate });
            } catch (err) {
                          return res.status(err.status|| 400).json({status: 0,message:err.message});
            }
};
exports.mute  = async(req,res) =>{
      try {
    const userID = req.UserID;
    const { type, id } = req.body;
    console.log(userID,id);
    if (!userID || !type || !id) {
      return res.status(400).json({ ok: false, message: 'Thiếu userID/type/id' });
    }
    if (!ObjectId.isValid(userID) || !ObjectId.isValid(id)) {
                          return res.status(err.status|| 400).json({status: 0,message:err.message});
    }

    data = await mute({userID,type,id});
                    return res.status(200).json({ status: 1, message: 'Update success',data });
  } catch (err) {
         return res.status(err.status|| 400).json({status: 0,message:err.message});
  }
};