const { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME
const S3_REGION = process.env.S3_REGION
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY

if (
  !S3_BUCKET_NAME ||
  !S3_REGION ||
  !S3_ACCESS_KEY_ID ||
  !S3_SECRET_ACCESS_KEY
) {
  throw new Error('Environment variables for aws storage are not set.');
}


const s3Client = new S3Client({
  S3_REGION,
  credentials: {
    S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY
  }
})

const uploadFile = async (fileBuffer, fileName, contentType) => {
  const uploadParams = {
    Bucket: S3_BUCKET_NAME,
    Body: fileBuffer,
    Key: fileName,
    ContentType: contentType
  }
  return await s3Client.send(new PutObjectCommand(uploadParams));
}

const deleteFile = async (fileName) => {
  const deleteParams = {
    Bucket: S3_BUCKET_NAME,
    Key: fileName,
  }

  return await s3Client.send(new DeleteObjectCommand(deleteParams));
}

const getObjectSignedUrl = async (key) => {
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: key
  }
  const command = new GetObjectCommand(params);
  return await getSignedUrl(s3Client, command);

};

module.exports = {
  uploadFile,
  deleteFile,
  getObjectSignedUrl
}

