const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const key = process.env.SECRET_KEY;
const hashing = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashing.hash(this.password, 12);
    this.cpassword = await hashing.hash(this.cpassword, 12);
  }
  next();
});

adminSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, key);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

const Admin = mongoose.model("ADMIN", adminSchema);
module.exports = Admin;
