if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const dbUrl = process.env.ATLASDB_URL;
console.log(process.env.secret);
console.log("MongoDB URL:", process.env.ATLASDB_URL);
console.log("Secret:", process.env.secret);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");

const ExpressError = require("./util/ExpressError");

const User = require("./models/user");
const listings = require("./routes/listing");
const reviews = require("./routes/review");
const users = require("./routes/user");

const Listing = require("./models/listing");
const asyncWrap = require("./util/wrapAsync");
app.engine("ejs", ejsMate);
const main = async () => {
  await mongoose.connect(dbUrl);
};

main()
  .then(() => console.log("connection established"))
  .catch((err) => console.log(err));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },

  thouchAfter: 3600 * 24,
});

store.on("error", (err) => {
  console.log("THRE IS AN ERROR IN THE MONGO SESSION STORE", err);
});

const sessionObj = {
  store,
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,

  cookie: {
    exprire: Date.now() + 7 * 24 * 60 * 60 * 100,
    maxAge: 7 * 24 * 60 * 60 * 100,
    httpOnly: true,
  },
};
app.use(session(sessionObj));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.error = req.flash("error");
  res.locals.sucess = req.flash("sucess");
  next();
});
// Utility function for async error handling

// Routes

app.use("/listings", listings);

//REView
app.use("/listings/:id/reviews", reviews);

//User signup

app.use("/", users);

app.get(
  "/demouser",
  asyncWrap(async (req, res) => {
    const u1 = new User({
      email: "ryanthomasjam@gmail.com",
      username: "ryan123",
    });

    let res1 = await User.register(u1, "pass123");

    res.send(res1);
  })
);

// Error Handling Middleware
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "SOMETHING WENT WRONG" } = err;
  console.log(err);
  res.status(status).render("listings/error.ejs", { message });
});

app.listen(3000, () => {
  console.log("the server is listening");
});
