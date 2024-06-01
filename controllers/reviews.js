const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.showReviews = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({
    path: "reviews",
    populate: {
      path: "owner",
    },
  });
  console.log(listing);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  res.render("listings/review.ejs", { rev: listing.reviews, id });
};

module.exports.postReview = async (req, res, next) => {
  console.log("Hello");
  const { id } = req.params;
  const review = req.body.review;
  review.rating = parseInt(review.rating);

  console.log("this is the owner", review.owner);
  console.log(review);
  let result = await Listing.findById(id);
  let rnew = new Review(review);
  rnew.owner = req.user._id;
  console.log(rnew);
  result.reviews.push(rnew._id);

  await rnew.save();

  let m = await result.save();
  req.flash("sucess", "New review Created");

  console.log(m);
  res.redirect(`/listings/${id}/reviews`);
};

module.exports.destroyReview = async (req, res) => {
  const { id, reviewid } = req.params;
  await Review.findByIdAndDelete(reviewid);
  let res1 = await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewid },
  });
  console.log(res1);
  req.flash("sucess", "Review Deleted");

  res.redirect(`/listings/${id}/reviews`);
};
