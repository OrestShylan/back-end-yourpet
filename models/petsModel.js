const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

const petsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Pet name is required"],
    },
    birthday: {
      type: String,
      required: [true, "Pet birthday is required"],
    },
    type: {
      type: String,
      required: [true, "Pet type is required"],
    },
    comments: {
      type: String,
      default: "",
    },
    photoURL: {
      type: String,
      required: [true, "Pet photo is required"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true, versionKey: false }
);

petsSchema.post("save", handleMongooseError);

const Pet = model("Pet", petsSchema);

const addPetJoiSchema = Joi.object().keys({
  name: Joi.string().min(2).max(16).required(),
  birthday: Joi.string().required(),
  type: Joi.string().min(2).max(16).required(),
  comments: Joi.string().min(0).max(120).required(),
  photoURL: Joi.string().uri().required(),
});

const getParams = Joi.object({
  page: Joi.number().integer().min(1).empty(""),
  limit: Joi.number().integer().min(1).max(1).required(),
});

const photoConfig = {
  field: "photo",
  folder: "pets",
};

const schemas = {
  addPetJoiSchema,
  getParams,
  photoConfig,
};

module.exports = {
  Pet,
  schemas,
};
