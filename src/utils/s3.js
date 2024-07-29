const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const {
  S3_ACCESS_KEY_ID,
  S3_REGION,
  S3_BUCKET_NAME,
  S3_SECRET_ACCESS_KEY,
} = require("../constant/constants")
const { logger } = require("./logger")

const s3Client = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
})

const uploadFile = async (fileBuffer, fileName, contentType) => {
  const uploadParams = {
    Bucket: S3_BUCKET_NAME,
    Body: fileBuffer,
    Key: fileName,
    ContentType: contentType,
  }
  try {
    return await s3Client.send(new PutObjectCommand(uploadParams))
  } catch (error) {
    logger.error(error)
    throw error
  }
}

const deleteFile = async (fileName) => {
  const deleteParams = {
    Bucket: S3_BUCKET_NAME,
    Key: fileName,
  }
  try {
    return await s3Client.send(new DeleteObjectCommand(deleteParams))
  } catch (error) {
    logger.error(error)
    throw error
  }
}

const getObjectSignedUrl = async (key) => {
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: key,
  }
  try {
    const command = new GetObjectCommand(params)
    return await getSignedUrl(s3Client, command)  
  } catch (error) {
    logger.error(error)
    throw error
  }
}

module.exports = {
  uploadFile,
  deleteFile,
  getObjectSignedUrl,
}
