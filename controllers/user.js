const { User } = require("../models/user");

exports.getAllUsers = async (req, res) => {
  try {
    var users = await User.find();
    console.log(users);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: "Error getting users from DB",
      location: "getAllUsers function - user controller - catch part",
    });
  }

  res.status(200).json({
    users: users,
  });
};
