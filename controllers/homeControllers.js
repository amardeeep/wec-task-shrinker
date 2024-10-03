const queries = require("../prisma/queries");
const short = require("short-uuid");
const isUrl = require("is-url");
//function to validate if a url is valid
const isValid = (url) => {
  return isUrl(url);
};
const postGenerateLinks = async (req, res) => {
  const fullURL = req.body.fullURL;
  if (isValid(fullURL)) {
    const shortURL = short.generate();
    await queries.createLinks(fullURL, shortURL);
    res.redirect("/");
  } else {
    //return invalid url error
    res.redirect("/generateLinks");
  }
};
const postSubmitLinks = async (req, res) => {
  const fullURL = req.body.fullURL;
  if (isValid(fullURL)) {
    const shortURL = req.body.shortURL;
    await queries.createLinks(fullURL, shortURL);
    res.redirect("/");
  } else {
    //return invalid url error
    res.redirect("/submitLinks");
  }
};
module.exports = { postGenerateLinks, postSubmitLinks };
