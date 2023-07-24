const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

// const dateRegex = "(^0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(d{4}$)";

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
      required: [true, "Comments is required"],
    },
    avatarURL: {
      type: String,
      default: null,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Pet owner is required"],
    },
  },
  { timestamps: true, versionKey: false }
);

// const { Schema, model } = require("mongoose");
// const { handleMongooseError } = require("../helpers");
// const Joi = require("joi");
// const contactSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Set name for contact"],
//     },
//     email: {
//       type: String,
//       required: [true, "Set email for contact"],
//     },
//     phone: {
//       type: String,
//       required: [true, "Set phone for contact"],
//     },
//     favorite: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     versionKey: false,
//     timestamps: true,
//   }
// );
// contactSchema.post("save", handleMongooseError);

// const addschema = Joi.object({
//   name: Joi.string().alphanum().min(3).required().messages({
//     "string.base": "Name should be a string",
//     "string.min": "Name should have a minimum length of {#limit}",
//     "any.required": "Missing required name field",
//   }),

//   email: Joi.string()
//     .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
//     .required()
//     .messages({
//       "string.email": "Invalid email format",
//       "any.required": "Missing required email field",
//     }),

//   phone: Joi.string().required().messages({
//     "any.required": "Missing required phone field",
//   }),
//   favorite: Joi.boolean().messages({
//     "any.required": `missing field favorite`,
//   }),
// });
// const updateFavoriteSchema = Joi.object({
//   favorite: Joi.boolean().required().messages({
//     "any.required": `missing field favorite`,
//   }),
// });

//

// const schemas = {
//   addschema,
//   updateFavoriteSchema,
// };

// module.exports = { Pet, schemas };
petsSchema.post("save", handleMongooseError);

const addPetJoiSchema = Joi.object({
  name: Joi.string().min(2).max(16).required().messages({
    "any.required": "Set name for pet",
    "string.min": "Pet name must have minimum of 2 characters",
    "string.max": "Pet name is not suppsoed to exceed 16 characters",
  }),
  birthday: Joi.string().required(),
});

const Pet = model("pet", petsSchema);

module.exports = {
  Pet,
  addPetJoiSchema,
};
