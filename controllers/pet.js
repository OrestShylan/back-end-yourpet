const { RequestError, ctrlWrapper } = require("../helpers");

const { Pet } = require("../models/pet");

const getAll = async (req, res, next) => {
  const result = await Pet.find();
  res.json(result);
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Pet.findById(contactId);
  if (!result) {
    throw new RequestError(404, "Not found");
  }
  res.json(result);
};

// const add = async (req, res, next) => {
//   const result = await Pet.create(req.body);
//   res.status(201).json(result);
// };

const addPet = async (req, res, next) => {
  const { id: owner } = req.user;

  const result = await Pet.create({ ...req.body, owner });
  result.status(201).json({
    message: "Hooray! Your pet was succesfully created!",
  });
};

const update = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Pet.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw new RequestError(404, "Not found");
  }
  res.json(result);
};
const updateFavorite = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Pet.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw new RequestError(404, "Not found");
  }
  res.json(result);
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
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  addPet: ctrlWrapper(addPet),
  update: ctrlWrapper(update),
  updateFavorite: ctrlWrapper(updateFavorite),
  deletePet: ctrlWrapper(deletePet),
};
