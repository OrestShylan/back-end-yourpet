const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");
// const moment = require("moment");

// const birthdayRegex = /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

const noticesSchema = new Schema(
  {
    category: {
      type: String,
      enum: ["sell", "lost-found", "in-good-hands"],
      required: [true, "choose category"],
    },

    title: {
      type: String,
      minLength: 8,
      maxLength: 60,
      required: [true, "Title is required"],
      default: null,
    },
    name: {
      type: String,
      required: [true, "Pet name is required"],
      minLength: 2,
      maxLength: 16,
    },
    date: {
      type: Date,
      required: [true, "Birthday is required"],
    },
    type: {
      type: String,
      required: [true, "Pet type is required"],
    },
    sex: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    location: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: "",
    },
    comments: {
      type: String,
      minLength: 0,
      maxLength: 120,
      default: "",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    avatarURL: {
      type: String,
      default: null,
    },

    favorite: [{ type: Schema.Types.ObjectId, ref: "user" }],
  },
  { timestamps: true, versionKey: false }
);

noticesSchema.post("save", handleMongooseError);

const addSchema = Joi.object({
  category: Joi.string().allow("lost-found", "for-free", "sell").required(),
  title: Joi.string().required(),
  name: Joi.string(),
  date: Joi.date().iso().less("now").required(),
  type: Joi.string(),
  sex: Joi.string().allow("male", "female").required(),
  location: Joi.string(),
  price: Joi.string(),
  comments: Joi.string(),
  avatarURL: Joi.string(),
  favorite: [{ type: Schema.Types.ObjectId, ref: "user" }],
});

const Notice = model("notice", noticesSchema);
const schemas = { addSchema };

module.exports = { Notice, schemas };
