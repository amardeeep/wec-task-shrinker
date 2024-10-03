const queries = require("../prisma/queries");
const short = require("short-uuid");
const postGenerateLinks = async (req, res) => {
  const fullURL = req.body.fullURL;
  const shortURL = short.generate();
  await queries.createLinks(fullURL, shortURL);
  res.redirect("/");
};
const postSubmitLinks = async (req, res) => {
  const fullURL = req.body.fullURL;
  const shortURL = req.body.shortURL;
  await queries.createLinks(fullURL, shortURL);
  res.redirect("/");
};
module.exports = { postGenerateLinks, postSubmitLinks };
