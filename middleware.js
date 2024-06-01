const { listingSchema } = require("./schemaVal");
const reviewSchema = require("./revschemaVal");
const Listing = require("./models/listing");
const ExpressError = require("./util/ExpressError");
const Review = require("./models/review");

const LoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log(req.originalUrl);
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "User Must log in to add new listing");
    return res.redirect("/login");
  }
  next();
};

const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
const authorizeUser = async (req, res, next) => {
  const { id } = req.params;
  // console.og(res.locals.user);
  const listOwn = await Listing.findById(id);
  if (!listOwn.owner._id.equals(res.locals.user._id)) {
    req.flash("error", "Not a valid user to edit");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
const validateListing = (req, res, next) => {
  console.log(req.file);
  const { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    console.log("hello", errMsg);
    throw new ExpressError(400, errMsg);
  } else {
    console.log("yes");
    next();
  }
};
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    console.log(errMsg);
    throw new ExpressError(400, errMsg);
  } else {
    console.log("Valid review");
    next();
  }
};

const isReviewAuthor = async (req, res, next) => {
  let { reviewid } = req.params;
  console.log("Revid", reviewid);
  let review = await Review.findById(reviewid);
  console.log("dang review", review);
  if (!review.owner.equals(res.locals.user._id)) {
    req.flash("error", "NOt a valid user to perform action");
    return res.redirect("/listings");
  }
  next();
};
module.exports = {
  LoggedIn,
  saveRedirectUrl,
  authorizeUser,
  validateListing,
  validateReview,
  isReviewAuthor,
};
