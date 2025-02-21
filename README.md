## File Upload to AWS S3 (with 500×500 Dimension Check)

This repository contains two parts:

Backend (Express.js) - An API endpoint to upload files to AWS S3.
Frontend (React) - A UI to select a file and upload it to the backend.
The system enforces a constraint where only images up to 500×500 pixels are accepted.

### Features

***Dimension Check:*** Uses sharp to validate image dimensions before upload.
***Multer:*** Handles file uploads in memory.
***AWS SDK:*** Uploads images to an AWS S3 bucket.
***React UI:*** A clean interface allowing users to select an image file and initiate the upload.

### Prerequisites
**Node.js**
**AWS Account**
**S3 Bucket**

