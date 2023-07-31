const { ctrlWrapper, RequestError, removeFromCloud } = require("../helpers");

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
  if (!pets) {
    next(RequestError(404, "No pets for your request"));
  }
  res.status(200).json({
    totalResults,
    page,
    totalPages: Math.ceil(totalResults / limit),
    results: pets,
  });
};

const addPet = async (req, res, next) => {
  if (!req.file) {
    throw RequestError(400, "Image is required");
  }

  const {
    user: { _id: userId },
    body,
  } = req;

  const pet = await Pet.create({
    ...body,
    owner: userId,
    avatarURL: req.file.path,
  });

  res.status(201).json({
    message: "Your pet was succesfully added",
    pet,
  });
};

const deletePet = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const pet = await Pet.findByIdAndDelete({ _id: id, owner: userId });

  if (!pet) {
    throw new RequestError(404, "Pet wasn't found");
  }

  removeFromCloud(pet.avatarURL);

  res.status(200).json({
    message: "Your pet was removed from your account",
    pet,
  });
};

module.exports = {
  getAllPets: ctrlWrapper(getAllPets),
  addPet: ctrlWrapper(addPet),
  deletePet: ctrlWrapper(deletePet),
};
