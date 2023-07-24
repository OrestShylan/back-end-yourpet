const { RequestError, ctrlWrapper } = require("../helpers");

const { Pet } = require("../models/petsModel");

const addPet = async (req, res, next) => {
  const { id: owner } = req.user;

  const result = await Pet.create({ ...req.body, owner });
  result.status(201).json({
    message: "Hooray! Your pet was succesfully created!",
  });
};

const deletePet = async (req, res) => {
  const { id } = req.params;
  const result = await Pet.findByIdAndRemove(id);
  if (!result) {
    throw new RequestError(404, "Pet wasn't found");
  }

  res.json({
    message: "Your pet was removed from your account",
  });
};

module.exports = {
  addPet: ctrlWrapper(addPet),
  deletePet: ctrlWrapper(deletePet),
};
