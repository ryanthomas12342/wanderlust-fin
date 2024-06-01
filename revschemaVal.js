const Joi = require("joi");
const Review = require("./models/review");

module.exports = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }),
});
