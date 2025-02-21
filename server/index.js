import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';
import cors from 'cors';
import sharp from 'sharp';

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  try {
    const metadata = await sharp(req.file.buffer).metadata();
    if (metadata.width > 500 || metadata.height > 500) {
      return res.status(400).json({ error: 'Image dimensions must not exceed 500×500 pixels.' });
    }
  } catch (err) {
    console.error("Error processing image:", err);
    return res.status(400).json({ error: 'Invalid image file' });
  }

  const file = req.file;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(500).json({ error: 'Error uploading file' });
    }
    res.json({ url: data.Location });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});