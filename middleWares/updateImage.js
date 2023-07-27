const Jimp = require("jimp");
const fs = require("fs/promises");
const { uploadCloudinary } = require("./uploadCloud");

const updateImage = async (req, res, next) => {
  if (req.file) {
    const { path: tempUpload } = req.file;

    const file = await Jimp.read(tempUpload);
    await file.resize(250, 250).writeAsync(tempUpload);

    const { secure_url: photoURL, public_id: photoId } = await uploadCloudinary(
      tempUpload
    );

    await fs.unlink(tempUpload);

    req.body.photoURL = photoURL;
    req.body.photoId = photoId;
  }
  next();
};

module.exports = updateImage;
