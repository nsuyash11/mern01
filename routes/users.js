const express = require("express");
const { getAllUsers } = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

router.get("/", isAuthenticated, getAllUsers);

module.exports = router;
