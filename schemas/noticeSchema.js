const Joi = require("joi");

const namePatern = /^[A-Za-z]{2,16}$/;
const cityPatern = /^[A-Za-z\s]+(?:,\s*[A-Za-z\s]+)*$/;

const noticeSchema = Joi.object({
  title: Joi.string().min(4).max(30).required().messages({
    "string.base": "The title must be a string of 4 to 30 symbols.",
    "string.min": "The title must be not less 4 symbols.",
    "string.max": "The title must be no more 30 symbols.",
    "any.required": "The title field is required.",
  }),
  category: Joi.string()
    .valid("sell", "lost-found", "for-free")
    .required()
    .messages({
      "any.required": "The category field is required.",
    }),
  name: Joi.string().pattern(namePatern).required().messages({
    "string.base": "The name must be a string of 2 to 16 symbols.",
    "any.required": "The name field is required.",
  }),
  date: Joi.date().max("now").required().messages({
    "any.required": "Set birthday for notice",
  }),
  type: Joi.string().min(2).max(16).required().messages({
    "string.base": "The type must be a string of 2 to 16 symbols.",
    "any.required": "The type field is required.",
    "string.min": "The type must be not less 2 symbols.",
    "string.max": "The type must be no more 16 symbols.",
  }),
  file: Joi.string().uri().messages({
    "string.base": "The file must be a string.",
    "string.uri": "The file must be a valid URL.",
  }),
  sex: Joi.string().valid("male", "female").required().messages({
    "any.required": "The sex field is required.",
  }),
  location: Joi.string().pattern(cityPatern).required().messages({
    "string.base": "The location must be a string.",
    "any.required": "The location field is required.",
  }),
  price: Joi.number().when("category", {
    is: "sell",
    then: Joi.number().min(0.01).required().messages({
      "any.required": "The price is required for sell category.",
      "number.min": "The price must be greater than 0.",
    }),
    otherwise: Joi.number().forbidden(),
  }),
  comments: Joi.string().max(120).allow("").messages({
    "string.base": "The comments must be a string.",
    "string.max": "The comments must be no more 120 symbols.",
  }),
});

module.exports = noticeSchema;
