const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(16).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(6)
    .max(16)
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}$/)
    .required()
    .messages({
      "string.base": "Password must be a string",
      "string.empty": "Password must not be empty",
      "string.min": "Password must be at least {#limit} characters long",
      "string.max": "Password must be at most {#limit} characters long",
      "string.pattern.base":
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 digit",
      "any.required": "Password is required",
    }),
  token: Joi.string().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(6)
    .max(16)
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}$/)
    .required()
    .messages({
      "string.base": "Password must be a string",
      "string.empty": "Password must not be empty",
      "string.min": "Password must be at least {#limit} characters long",
      "string.max": "Password must be at most {#limit} characters long",
      "string.pattern.base":
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 digit",
      "any.required": "Password is required",
    }),
});

// const dataUserSchema = Joi.object({
//   avatarURL: Joi.string()
//     .base64()
//     .max(3 * 1024 * 1024)
//     .required(),
//   name: Joi.string(),
//   email: Joi.string().email().required(),
//   birthday: Joi.string()
//     .pattern(/^\d{4}-\d{2}-\d{2}$/)
//     .message("The date is due to the format DD-MM-YYYY")
//     .required(),
//   phone: Joi.string()
//     .pattern(/^(\+380|0)[0-9]{9}$/)
//     .message("The number must be in the format +380671234567"),
//   city: Joi.string()
//     .pattern(/^[A-Za-z\s.-]+$/)
//     .message(
//       "The city must be in the format City. For example: Brovary, Kyiv, Akhtyrka, Sumy"
//     ),
// });

const dataUserSchema = Joi.object({
  avatar: Joi.string().allow(null),
  name: Joi.string(),
  email: Joi.string().email().required(),
  birthday: Joi.date().allow(null),
  phone: Joi.string().allow(""),
  city: Joi.string().allow(""),
});

module.exports = { registerSchema, loginSchema, dataUserSchema };
