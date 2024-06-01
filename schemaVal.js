const Joi = require("joi");
const Listing = require("./models/listing");
const reviewSchema = require("./revschemaVal");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    country: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string().allow("", null),
    price: Joi.number().required().min(0),
    reviews: Joi.array().items(reviewSchema),
    category: Joi.string().required(),
  }).required(),
});

const userSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = {
  listingSchema,
  userSchema,
};
