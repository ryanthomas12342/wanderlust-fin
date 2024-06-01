const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const User = require("./user");
const link =
  "https://media.istockphoto.com/id/1618008896/photo/beautiful-indonesian-relaxing-under-yellow-stripped-umbrella-at-the-infinity-pool-side.jpg?s=1024x1024&w=is&k=20&c=7KtzXH5h7mEDSi8N-8I32H_kI3UatVwES3B0QBOyTJM=";
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default: link,
      set: (v) => (v === "" ? link : v),
    },
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    required: true,
    type: String,
  },
  country: {
    required: true,
    type: String,
  },
  category: {
    required: true,
    type: String,
    enum: [
      "trending",
      "rooms",
      "iconic cities",
      "mountains",
      "castle",
      "castle",
      "amazing pools",
      "camping",
      "farms",
      "article",
    ],
  },

  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  owner: { type: Schema.Types.ObjectId, ref: "User" },
});

listingSchema.post("findOneAndDelete", async (data) => {
  if (data.reviews.length) {
    let res = await Review.deleteMany({ _id: { $in: data.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
