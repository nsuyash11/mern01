const jwt = require("jsonwebtoken");

exports.isAuthenticated = (req, res, next) => {
  let token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({
      error: "Token Required to access this",
      message: "Error extracting token from request header",
      location:
        "isAuthenticated function - auth middleware - token extract part",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: err,
      message: "Error decoding token",
      location:
        "isAuthenticated function - auth middleware - token decode part",
    });
  }
};

exports.isAdmin = (req, res, next) => {
  let token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({
      error: "Token Required to access this",
      message: "Error extracting token from request header",
      location:
        "isAuthenticated function - auth middleware - token extract part",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role) {
      next();
    } else {
      return res.status(403).json({
        error: "Access denied, no permission",
        message: "Require Admin level Access",
        location: "isAdmin function - auth middleware - access logic part",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: err,
      message: "Error decoding token",
      location: "isAdmin function - auth middleware - token decode part",
    });
  }
};
