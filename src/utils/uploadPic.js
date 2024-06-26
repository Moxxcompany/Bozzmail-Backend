const multer = require("multer");
const fs = require("fs");
const imageSize = 2 * 1048576;

const uploadDir = "./src/uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const fileStorage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const imageFilter = (req, file, cb) => {
  const checkImageTypes = ["image/png", "image/jpg", "image/jpeg"];

  if (checkImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploads = multer({
  storage: fileStorage,
  fileFilter: imageFilter,
  limits: { fileSize: imageSize },
});
module.exports = { uploads };