const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { RequestError } = require("../helpers");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => req.fileConfig.folder,
    allowed_formats: ["jpg", "png", "bmp"],
    format: (req, file) => (file.mimetype === "image/png" ? "png" : "jpg"),
  },
});

const allowedMimes = ["image/jpeg", "image/png", "image/bmp"];

const fileFilter = (req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new RequestError(
        400,
        "Unsupported file type. Please load file types such as : jpeg, png, bmp"
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
});

const uploadCloud = ({ field, ...restConfig }) => {
  const uploadMiddleware = upload.single(field);

  return (req, res, next) => {
    req.fileConfig = restConfig;
    uploadMiddleware(req, res, (err) => {
      next(err && new RequestError(err.status || 400, err.message));
    });
  };
};

module.exports = uploadCloud;
