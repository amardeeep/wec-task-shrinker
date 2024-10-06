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
//
app.use(express.urlencoded({ extended: false }));
//
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//
const assetPath = path.join(__dirname, "public");
app.use(express.static(assetPath));

//session middleware
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      let user = await queries.getUser(username);
      if (!user) {
        return done(null, false, { message: "Incorrect Username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect Password" });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);
//serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});
//deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await queries.getUserId(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
//create session
app.use(session({ secret: "Cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.get("/login", (req, res) => {
  const error = req.session.messages;
  res.render("login", { error: error });
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  })
);
app.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.post("/signup", signupController.postUser);
app.use("/", homeRouter);
app.listen(process.env.PORT, () => {
  console.log("App is running on PORT 3000");
});
