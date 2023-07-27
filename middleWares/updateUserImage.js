const Jimp = require("jimp");
const fs = require("fs/promises");
const { deleteCloudinary, uploadCloudinary } = require("./uploadCloud");

const updateUserImage = async (req, res, next) => {
  if (req.file) {
    const { path: tempUpload } = req.file;
    const { avatarId: oldID } = req.user;

    const file = await Jimp.read(tempUpload);
    await file.resize(250, 250).writeAsync(tempUpload);

    if (oldID) await deleteCloudinary(oldID);

    const { secure_url: avatarURL, public_id: avatarId } =
      await uploadCloudinary(tempUpload);

    await fs.unlink(tempUpload);

    req.body.avatarURL = avatarURL;
    req.body.avatarId = avatarId;
  }
  next();
};

module.exports = {
  updateUserImage,
};
