const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

const petsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Pet name is required"],
    },
    date: {
      type: Date,
      required: [true, "Birthday is required"],
    },
    type: {
      type: String,
      required: [true, "Pet type is required"],
    },
    comments: {
      type: String,
      default: "",
    },
    avatarURL: {
      type: String,
      default: null,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

petsSchema.post("save", handleMongooseError);

const Pet = model("Pet", petsSchema);

const addPetJoiSchema = Joi.object().keys({
  name: Joi.string().min(2).max(16).required(),
  date: Joi.date().max("now").required(),
  type: Joi.string().min(2).max(16).required(),
  comments: Joi.string().min(0).max(120).required(),
  avatarURL: Joi.string(),
});

const getParams = Joi.object({
  page: Joi.number().integer().min(1).empty(""),
  limit: Joi.number().integer().min(1).max(1).required(),
});

// const photoConfig = {
//   field: "photo",
//   folder: "pets",
// };

const schemas = {
  addPetJoiSchema,
  getParams,
};

module.exports = {
  Pet,
  schemas,
};
