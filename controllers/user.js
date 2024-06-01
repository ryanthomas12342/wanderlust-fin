const User = require("../models/user");

module.exports.signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({
      username,
      email,
    });
    let res1 = await User.register(newUser, password);
    console.log(res1);
    ///TO AUTOMATICALLY LOGIN AFTER SIGNUP
    req.login(newUser, (err) => {
      if (err) {
        throw next(err);
      }
      req.flash("sucess", "Welcome to WonderLust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.showLogin = (req, res) => {
  res.render("listings/login.ejs");
};

module.exports.loginUser = async (req, res) => {
  console.log("this is it", res.locals.redirectUrl);
  req.flash("sucess", "User successfully logged in");
  if (res.locals.redirectUrl) {
    res.redirect(res.locals.redirectUrl);
  } else {
    res.redirect("/listings");
  }
};

module.exports.logoutuser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("sucess", "You have sucessfully loggedout");
    res.redirect("/login");
  });
};

module.exports.showSignUp = (req, res) => {
  res.render("listings/signup.ejs");
};
