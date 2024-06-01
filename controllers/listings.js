const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const data = await Listing.find({});

  res.render("listings/index.ejs", { data });
};

module.exports.newListing = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const det = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "owner",
        },
      })
      .populate("owner"); ///nested popoulate for pulating owner inside review
    if (!det) {
      req.flash("error", "THE  LISTING WAS NOT FOUND");
      res.redirect("/listings");
    }
    console.log(det.reviews);
    res.render("listings/show.ejs", { det });
  } catch (err) {
    next(err);
  }
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const editp = await Listing.findById(id);
  let originalUrl = editp.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/w_250/");
  console.log(editp);
  if (!editp) {
    req.flash("error", "The listing is not avalialble to be edited");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { editp, originalUrl });
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  console.log("yes being deleted");
  req.flash("sucess", "Listing sucessfully deleted!!");
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listings = req.body.listing;

  let list = await Listing.findByIdAndUpdate(id, listings);
  if (typeof req.file !== "undefined") {
    list.image.url = req.file.path;
    list.image.filename = req.file.filename;
    await list.save();
  }

  req.flash("sucess", "Listing has been updated");
  res.redirect(`/listings/${id}`);
};

module.exports.postListing = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  const url = req.file.path;
  const filename = req.file.filename;
  console.log(url, "..", filename);
  req.session.title = req.body.listing.title;
  req.flash("sucess", `${req.session.title} has been added`);
  newListing.owner = req.user._id;
  newListing.image.filename = req.file.filename;
  newListing.image.url = req.file.path;
  await newListing.save();
  console.log("Successfully created", newListing);
  res.redirect("/listings");
};

module.exports.categoryShow = async (req, res) => {
  const { cat } = req.params;
  console.log(cat);
  const data = await Listing.find({ category: cat });
  console.log(data);
  res.render("listings/index.ejs", { data });
};
