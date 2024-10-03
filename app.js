//import all the depndencies here
const express = require("express");
require("dotenv").config();

const path = require("node:path");
const { homeRouter } = require("./routes/homeRouter");

//create express app
const app = express();
app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const assetPath = path.join(__dirname, "public");
app.use(express.static(assetPath));

app.use("/", homeRouter);
app.listen(process.env.PORT, () => {
  console.log("App is running on PORT 3000");
});
