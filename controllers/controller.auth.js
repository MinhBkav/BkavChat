var express = require('express')
const appRoot = require('app-root-path');
var router = express.Router()
var mongoose = require('mongoose')
// var models = reqlib('database').models
const models = require(appRoot + '/database').models;
var moment = require('moment')
const {login,register,loginsocial} = require('../services/service.auth');
exports.register = async(req,res) =>{
       try {
        const { idToken, Username } = req.body
        if (!idToken) {
            return res.status(400).json({ status: 0, message: 'Missing Firebase token' })
        }
        const resRegister = await register({idToken,Username});

        return res.status(200).json({
            status: 1,
            data: resRegister,
            message: 'Register successful'
        })

    } catch (err) {
        console.error(err)
                          return res.status(err.status|| 400).json({status: 0,message:err.message});
    }
}
exports.login = async(req,res) =>{
    try {
    const { idToken, fcmToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ status: 0, message: 'Missing Firebase token' })
        }
        const resLogin = await login({idToken,fcmToken});
        return res.status(200).json({
            status: 1,
            data: resLogin,
            message: 'Login successful'
        })
    } catch (err) {
        console.error(err)
                          return res.status(err.status|| 400).json({status: 0,message:err.message});
    } 
}
exports.loginsocial = async(req,res) =>{
      try {
    const { idToken, fcmToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ status: 0, message: 'Missing Firebase token' });
        }

      const resLoginsocial = await loginsocial({idToken,fcmToken});
        return res.status(200).json({
            status: 1,
            data: resLoginsocial,
            message: 'Login successful'
        });

    } catch (err) {
        console.error(err);
                          return res.status(err.status|| 400).json({status: 0,message:err.message});
    }
}