const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine the folder based on file properties or request data
    let folder;

    const userID = req.user._id.toString();

    const uniqueImgName = `${userID}_${file.originalname}`;

    if (file.fieldname === "avatar") {
      folder = "avatars";
    } else if (file.fieldname === "avatarURL") {
      folder = "pets";
    } else {
      folder = "misc";
    }
    return {
      folder: folder,
      allowed_formats: ["jpg", "jpeg", "png"], // Adjust the allowed formats as needed
      public_id: uniqueImgName, // Use original filename as the public ID
      // transformation: [
      //   { width: 350, height: 350 },
      //   { width: 700, height: 700 },
      // ],
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
