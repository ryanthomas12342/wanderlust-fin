const express = require("express");
const router = express.Router({ mergeParams: true });
const multer = require("multer");

const { storage } = require("../cloudinary");
const upload = multer({ storage });

const asyncWrap = require("../util/wrapAsync");
const { LoggedIn, authorizeUser, validateListing } = require("../middleware");

const listingController = require("../controllers/listings");

router.get("/category/:cat", asyncWrap(listingController.categoryShow));

router.route("/").get(asyncWrap(listingController.index)).post(
  LoggedIn,
  // validateListing,x
  upload.single("listing[image]"),
  asyncWrap(listingController.postListing)
);

router.get("/new", LoggedIn, listingController.newListing);

router
  .route("/:id")
  .get(LoggedIn, asyncWrap(listingController.showListing))
  .delete(LoggedIn, authorizeUser, asyncWrap(listingController.destroyListing))
  .put(
    authorizeUser,
    LoggedIn,
    upload.single("listing[image]"),

    validateListing,
    asyncWrap(listingController.updateListing)
  );

router.get("/new", LoggedIn, listingController.newListing);

router.get("/:id/edit", LoggedIn, asyncWrap(listingController.editListing));

// CREATE

module.exports = router;
