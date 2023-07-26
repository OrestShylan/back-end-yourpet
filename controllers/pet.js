const { RequestError, ctrlWrapper } = require("../helpers");

const { Pet } = require("../models/petsModel");

const getAllPets = async (req, res, next) => {
  
  const { _id: userId } = req;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const result = await Pet.find({ owner: userId, favorite: true }, "", {
    skip,
    limit,
    sort: {
      updateAt: -1,
    },
  }).populate("owner");

  if (!result) {
    return res.status(404).json({
      message: " Sorry, you have no pets.",
    });
  }
  res.json(result);
};

const addPet = async (req, res, next) => {
  const { id: userId } = req;

  const result = await Pet.create({ ...req.body, owner: userId });
  res.status(201).json(result);
};

const deletePet = async (req, res) => {
  const { id } = req.params;

  const result = await Pet.findByIdAndDelete(id);

  if (!result) {
    throw new RequestError(404, `Pet with id ${id} non found`);
  }
  res.status(200).json({
    message: "Your pet was removed from your account",
  });
};

module.exports = {
  getAllPets: ctrlWrapper(getAllPets),
  addPet: ctrlWrapper(addPet),
  deletePet: ctrlWrapper(deletePet),
};
