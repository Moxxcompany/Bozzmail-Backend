const multer = require("multer")
const fs = require("fs")
const path = require("path")
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const uploadDir = path.join(__dirname, "../uploads")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}
const uploadfile = multer({ dest: uploadDir })
module.exports = { upload, uploadfile }
