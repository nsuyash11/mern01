const {
  User,
  validateUserSignUp,
  validateUserSignIn,
} = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//signing in for already registered users
exports.signIn = async (req, res) => {
  try {
    const { error } = validateUserSignIn(req.body);
    if (error) {
      console.log(error.details[0].message);
      return res.status(400).json({
        error: "Bad request body - user details",
        message: error.details[0].message,
        location: "signIn function - auth controller - joi validate part",
      });
    }

    console.log(req.body);

    // find the user based on email
    const { email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        error: "Error fetching user with this email",
        location: "signIn function - auth controller - find one email part",
      });
    }

    // if user is found make sure the email and password match
    const isCredentialsValid = await bcrypt.compare(password, user.password);
    if (!isCredentialsValid) {
      return res.status(400).json({
        error: "Invalid Email - Password credentials combination",
        location:
          "signIn function - auth controller - email password match part",
      });
    }

    // generate a signed token
    const token = jwt.sign(
      { _id: this._id, name: this.name, email: this.email, role: this.role },
      process.env.JWT_SECRET
    );

    console.log(token);

    // persist the token as 't' in cookie with expiry date
    res.cookie("token", token, { expire: new Date() + 9999 });

    return res.header("x-auth-token", token).status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Some error caught while signing in",
      message: err,
      location: "signIn function - auth controller - catch part",
    });
  }
};

//register user for first time
exports.signUp = async (req, res) => {
  try {
    console.log(req.body);

    const { error } = validateUserSignUp(req.body);
    if (error) {
      console.log(error.details[0].message);
      return res.status(400).json({
        error: "Bad request body - user details",
        message: error.details[0].message,
        location: "signUp function - auth controller - joi validate part",
      });
    }

    const user = await new User(req.body);

    //hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save((err, user) => {
      if (err) {
        console.error(err);
        return res.status(400).json({
          error: "Some error saving user to db",
          message: err.message,
          location: "signUp function - auth controller - db save part",
        });
      }
      return res.status(200).json({
        user,
        message: "User saved successfully",
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      error: "Some error caught while signing up",
      message: err,
      location: "signUp function - auth controller - catch part",
    });
  }
};

exports.signOut = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Signout success" });
};
