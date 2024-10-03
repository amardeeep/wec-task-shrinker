const queries = require("../prisma/queries");
//generates a short unique string which will be used as short URL
const short = require("short-uuid");
//validates if a url is valid
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
const getShortURL = async (req, res) => {
  const link = await queries.findLinkWhereShortURL(req.params.shortURL);
  if (link) {
    await queries.updateClicks(link);
    res.redirect(link.fullURL);
  } else {
    res.redirect("/");
  }
};
module.exports = { postGenerateLinks, postSubmitLinks, getShortURL };
