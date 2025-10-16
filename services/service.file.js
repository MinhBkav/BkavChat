const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const {httpError} = require ('./helpder')
const currentDirectory = __dirname;
const parentDirectory = path.resolve(currentDirectory, '..', '..');
const savePathImage = `${parentDirectory}/images`;
const savePathFile = `${parentDirectory}/files`;


  // Upload nhiều ảnh
async function  uploadImage({files}){
      const savedImages = [];
      for (const file of files) {
        if (!file.mimetype.startsWith('image/')) continue;

        const extension = file.originalname.split('.').pop();
        const fileName = `${uuidv4()}.${extension}`;
        const fullPath = path.join(savePathImage, fileName);

        fs.writeFileSync(fullPath, file.buffer);
          console.log(fileName)
        savedImages.push({
          url: `/images/${fileName}`,
          fileName: file.originalname,
        });
      }

      if (savedImages.length === 0) {
           throw httpError(400,'Khong tim thay file anh ',{code:'8xhhhhh'});
      }

      return  savedImages ;
    }    

  // Upload nhiều file (loại trừ ảnh)
async function uploadFile({files}) {
      const savedFiles = [];
      for (const file of files) {
        if (file.mimetype.startsWith('image/')) continue;

        const extension = file.originalname.split('.').pop();
        const fileName = `${uuidv4()}.${extension}`;
        const fullPath = path.join(savePathFile, fileName);

        fs.writeFileSync(fullPath, file.buffer);
        console.log(fileName)
        savedFiles.push({
          url: `/files/${fileName}`,
          fileName: file.originalname,
        });
      }

      if (savedFiles.length === 0) {
        throw httpError(400,'Không có file hợp lệ ',{code:'8xhhhhh'});
      }

      return savedFiles ;
    }
    module.exports ={uploadFile,uploadImage};