const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

// const dateRegex = "(^0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(d{4}$)";

const petsSchema = new Schema(
  {
    category: {
      type: String,
      enum: ["sell", "lost-found", "for-free"],
      default: "my-pet",
    },
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
  birthday: Joi.date().iso().less("now").required(),
  type: Joi.string().min(2).max(16).required(),
  comments: Joi.string().min(0).max(120).required(),
  photoURL: Joi.string().uri().required(),
});

module.exports = {
  Pet,
  addPetJoiSchema,
};
