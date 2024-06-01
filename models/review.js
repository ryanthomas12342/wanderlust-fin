const mongoose = require("mongoose");
const User = require("./user");

const { Schema } = mongoose;

const reviewSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
