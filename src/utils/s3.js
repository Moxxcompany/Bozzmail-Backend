const { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const bucketName = process.env.S3_BUCKET_NAME
const region = process.env.S3_REGION
const accessKeyId = process.env.S3_ACCESS_KEY_ID
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})

const uploadFile = async (fileBuffer, fileName, contentType) => {
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: contentType
  }
  const response = await s3Client.send(new PutObjectCommand(uploadParams));
  return response
}

const deleteFile = async (fileName) => {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  }

  const response = await s3Client.send(new DeleteObjectCommand(deleteParams));
  return response
}

const getObjectSignedUrl = async (key) => {
  const params = {
    Bucket: bucketName,
    Key: key
  }
  const command = new GetObjectCommand(params);
  const url = await getSignedUrl(s3Client, command);

  return url
};

module.exports = {
  uploadFile,
  deleteFile,
  getObjectSignedUrl
}

