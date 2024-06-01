const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../util/wrapAsync");
const { LoggedIn, validateReview, isReviewAuthor } = require("../middleware");

const reviewController = require("../controllers/reviews");

//REVIEW

router
  .route("/")
  .get(LoggedIn, asyncWrap(reviewController.showReviews))
  .post(LoggedIn, validateReview, asyncWrap(reviewController.postReview));

//Review Delete

router.delete(
  "/:reviewid",
  LoggedIn,
  isReviewAuthor,
  asyncWrap(reviewController.destroyReview)
);

module.exports = router;
