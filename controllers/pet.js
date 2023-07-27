const { ctrlWrapper } = require("../helpers");
const { deleteCloudinary } = require("../middleWares/uploadCloud");

const { Pet } = require("../models/petsModel");

const getAllPets = async (req, res, next) => {
  const {
    user: { _id: userId },
    query,
  } = req;

  const { page = 1, limit = 20 } = query;
  const skip = (page - 1) * limit;

  const totalResults = await Pet.find({ owner: userId }).count();
  const pets = await Pet.find({ owner: userId }, null, {
    skip,
    limit,
    sort: {
      updatedAt: -1,
    },
  }).lean();

  res.json({
    totalResults,
    page,
    totalPages: Math.ceil(totalResults / limit),
    results: pets,
  });
};

const addPet = async (req, res, next) => {
  const {
    user: { _id: userId },
    body,
  } = req;
  // body.photoUrl = file.path;
  const pet = (await Pet.create({ ...body, owner: userId })).toObject();
  res.status(201).json(pet);
};

const deletePet = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const pet = await Pet.findOne({ _id: id, owner: userId });

  if (!pet) {
    return res.status(404).json({
      message: "Pet not found",
    });
  }

  const { photoId } = pet;

  await deleteCloudinary(photoId);
  await pet.remove();

  res.status(200).json({
    message: "Your pet was removed from your account",
  });
};

module.exports = {
  getAllPets: ctrlWrapper(getAllPets),
  addPet: ctrlWrapper(addPet),
  deletePet: ctrlWrapper(deletePet),
};
