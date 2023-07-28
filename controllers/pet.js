const { ctrlWrapper, RequestError } = require("../helpers");

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
  const { _id: owner } = req.user;

  if (!req.body) {
    throw new RequestError(400, "Please fill in your text fields");
  }

  let avatarURL = null;

  if (req.file) {
    avatarURL = req.file.path;
  }

  const result = await Pet.create({
    ...req.body,
    avatarURL,
    owner,
  });
  res.status(201).json({
    message: "Your pet was succesfully added",
    result,
  });
};

const deletePet = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const pet = await Pet.findByIdAndDelete({ _id: id, owner: userId });

  if (!pet) {
    throw new RequestError(404, "Pet wasn't found");
  }

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
