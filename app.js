//import all the depndencies here
const express = require("express");
require("dotenv").config();
const passport = require("passport");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const path = require("node:path");
//import Routers
const { homeRouter } = require("./routes/homeRouter");
//import controllers
const signupController = require("./controllers/signupController");
//import queries
const queries = require("./prisma/queries");

//create express app
const app = express();
app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const assetPath = path.join(__dirname, "public");
app.use(express.static(assetPath));
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.post("/signup", signupController.postUser);

app.use("/", homeRouter);
app.listen(process.env.PORT, () => {
  console.log("App is running on PORT 3000");
});
