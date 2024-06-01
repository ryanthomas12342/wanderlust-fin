const mongoose = require("mongoose");
const passportMongoose = require("passport-local-mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true, //the username and password are aldready provided fields by passport-mongooose
  },
});
userSchema.plugin(passportMongoose);
const User = mongoose.model("User", userSchema);

module.exports = User;
