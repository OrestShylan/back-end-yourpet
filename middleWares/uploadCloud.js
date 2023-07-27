const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const multer = require("multer");
// const { RequestError } = require("../helpers");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

const uploadCloudinary = async (tempUpload) => {
  try {
    const result = await cloudinary.uploader.upload(tempUpload);
    return result;
  } catch (error) {
    console.log(error, "error");
  }
};

const deleteCloudinary = async (id) => {
  try {
    const result = await cloudinary.uploader.destroy(id);
    return result;
  } catch (error) {
    console.log(error);
  }
};
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: (req, file) => req.fileConfig.folder,
//     allowed_formats: ["jpg", "png", "bmp"],
//     format: (req, file) => (file.mimetype === "image/png" ? "png" : "img"),
//   },
// });
// const allowedMimes = ["images/jpeg", "image/png", "image/bmp"];

// const fileFilter = (req, file, cb) => {
//   if (allowedMimes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(
//       new RequestError(
//         400,
//         "Unsupported file type. Supported types: jpeg, png, bmp"
//       )
//     );
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 3 * 1024 * 1024,
//   },
// });

// const uploadCloud = ({ field, ...restConfig }) => {
//   const uploadMiddleware = upload.single(field);

//   return (req, res, next) => {
//     req.fileConfig = restConfig;
//     uploadMiddleware(req, res, (err) => {
//       next(err & new RequestError(err.status || 400, err.message));
//     });
//   };
// };
module.exports = {
  uploadCloudinary,
  deleteCloudinary,
};
