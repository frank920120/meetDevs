const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const userScheme = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  data: {
    type: Date,
    default: Date.now
  }
});

userScheme.methods.generateToken = function() {
  const payload = {
    user: {
      id: this._id
    }
  };
  const token = jwt.sign(payload, config.get("jwtSectet"), {
    expiresIn: 360000
  });
  return token;
};

const user = mongoose.model("User", userScheme);

module.exports = user;
