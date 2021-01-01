//imports
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

//root route
app.get("/", (req, res) => {
  res.send("Welcome to Backend Server running on port - " + port);
});

//routes middleware
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


//server spin
const port = process.env.SERVER_PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//db connection
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected successfully"))
  .catch((err) => console.log(`DB Connection error :- \n${err}`));
