// controllers/upload/index.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const currentDirectory = __dirname;
const parentDirectory = path.resolve(currentDirectory, '..', '..');
const imagePath = `${parentDirectory}/images`;
const filePath = `${parentDirectory}/files`;

module.exports = () => {
  // 📷 Upload ảnh
  router.post('/upload-image', upload.any(), async (req, res) => {
    try {
      const file = req.files?.[0];
      if (!file || !file.mimetype.startsWith('image/')) {
        return res.status(400).json({ status: 0, message: 'Chỉ chấp nhận ảnh' });
      }

      const extension = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${extension}`;
      const fullPath = path.join(imagePath, fileName);

      fs.writeFileSync(fullPath, file.buffer);

      return res.status(200).json({
        status: 1,
        data: {
          url: `/images/${fileName}`,
          fileName: file.originalname
        }
      });
    } catch (err) {
      return res.status(400).json({ status: 0, message: err.message });
    }
  });

  // 📎 Upload file (không phải ảnh)
  router.post('/upload-file', upload.any(), async (req, res) => {
    try {
      const file = req.files?.[0];
      if (!file || file.mimetype.startsWith('image/')) {
        return res.status(400).json({ status: 0, message: 'Không chấp nhận ảnh ở đây' });
      }

      const extension = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${extension}`;
      const fullPath = path.join(filePath, fileName);

      fs.writeFileSync(fullPath, file.buffer);

      return res.status(200).json({
        status: 1,
        data: {
          url: `/files/${fileName}`,
          fileName: file.originalname
        }
      });
    } catch (err) {
      return res.status(400).json({ status: 0, message: err.message });
    }
  });

  return router;
};
