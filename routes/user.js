const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../util/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/user");

router
  .route("/signup")
  .get(userController.showSignUp)
  .post(asyncWrap(userController.signUp));

router
  .route("/login")
  .get(userController.showLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    asyncWrap(userController.loginUser)
  );

router.get("/logout", userController.logoutuser);

module.exports = router;
