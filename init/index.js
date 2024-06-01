const mongoose = require("mongoose");
const sampListing = require("./data");
const Listing = require("../models/listing");

const main = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
};

main()
  .then(() => console.log("connection established"))
  .catch((err) => console.log(err));

const inidb = async () => {
  console.log("helo");
  await Listing.deleteMany({});
  sampListing.data = sampListing.data.map((el) => ({
    ...el,
    owner: "665589fb8af193daaef618c0",
  }));
  await Listing.insertMany(sampListing.data);
  console.log("Sucessdfully initilaized ");
};

inidb();
