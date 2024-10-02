//import all the depndencies here
const express = require("express");
require("dotenv").config();

//create express app
const app = express();
app.listen(process.env.PORT, () => {
  console.log("App is running on PORT 3000");
});
