const joi = require("joi");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = () => {
  return jwt.sign(
    { _id: this._id, name: this.name, email: this.email, role: this.role },
    process.env.JWT_SECRET
  );
};

//helper validating functions
function validateUserSignUp(body) {
  const schema = joi.object({
    name: joi.string().min(3).max(32).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(32).required(),
    role: joi.number(),
  });

  return schema.validate(body);
}

function validateUserSignIn(body) {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  return schema.validate(body);
}

module.exports.User = mongoose.model("User", userSchema);
module.exports.validateUserSignUp = validateUserSignUp;
module.exports.validateUserSignIn = validateUserSignIn;
