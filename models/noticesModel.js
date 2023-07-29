const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");
const moment = require("moment");

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
    birthday: {
      type: Date,
      get: (v) => moment(v).format("DD.MM.YYYY"),
      set: (v) => moment(v, "DD.MM.YYYY").toDate(),
      validate: {
        validator: function (value) {
          return moment(value, "DD.MM.YYYY", true).isValid();
        },
        message: "Invalid birth date format (must be dd.mm.yyyy)",
      },
      default: null,
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
  birthday: Joi.string(),
  type: Joi.string(),
  sex: Joi.string().allow("male", "female").required(),
  location: Joi.string(),
  price: Joi.string(),
  comments: Joi.string(),
});

const Notice = model("Notice", noticesSchema);
const schemas = { addSchema };

module.exports = { Notice, schemas };
