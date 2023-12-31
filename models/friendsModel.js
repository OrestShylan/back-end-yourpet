const Joi = require("joi");
const { Schema, model } = require("mongoose");

const DaySchema = new Schema({ isOpen: Boolean, from: String, to: String });

const friendsSchema = new Schema(
  {
    title: {
      type: String,
    },
    url: {
      type: String,
      required: false,
    },
    addressUrl: {
      type: String,
      required: false,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      required: false,
    },
    workDays: {
      type: [DaySchema],
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
  },
  { versionKey: false, timestamps: true }
);

const Friends = model("Friends", friendsSchema);

const friends = Joi.object({
  title: Joi.string(),
  url: Joi.string(),
  addressUrl: Joi.date(),
  imageUrl: Joi.string().default(""),
  address: Joi.string(),
  workDays: Joi.array(),
  phone: Joi.string(),
  email: Joi.string(),
});

const schemas = friends;

module.exports = {
  schemas,
  Friends,
};
