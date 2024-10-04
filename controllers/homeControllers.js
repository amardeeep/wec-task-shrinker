const { body, validationResult } = require("express-validator");
const queries = require("../prisma/queries");
//generates a short unique string which will be used as short URL
const short = require("short-uuid");
//validates if a url is valid
const isUrl = require("is-url");
//function to validate if a url is valid
const isValid = (url) => {
  return isUrl(url);
};
const isEmpty = "can not be empty.";
const validateURL = [
  body("fullURL").trim().not().isEmpty().withMessage(`fullURL ${isEmpty}`),
  body("shortURL").trim().not().isEmpty().withMessage(`shortURl ${isEmpty}`),
];
const postGenerateLinks = [
  validateURL,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("generateLinks", { errors: errors.array() });
    }
    const fullURL = req.body.fullURL;
    const link = await queries.findLinkWhereFullURL(fullURL);
    if (link) {
      res.render("duplicateURL");
    } else {
      if (isValid(fullURL)) {
        let shortURL = short.generate();
        const link = await queries.findLinkWhereShortURL(shortURL);
        while (link) {
          shortURL = short.generate();
          link = await queries.findLinkWhereShortURL(shortURL);
        }
        await queries.createLinks(fullURL, shortURL);
        res.redirect("/");
      } else {
        //return invalid url error
        res.render("invalidURL");
      }
    }
  },
];
const postSubmitLinks = [
  validateURL,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("submitLinks", { errors: errors.array() });
    }
    const fullURL = req.body.fullURL;
    const link = await queries.findLinkWhereFullURL(fullURL);
    if (link) {
      res.render("duplicateURL");
    } else {
      if (isValid(fullURL)) {
        const shortURL = req.body.shortURL;
        const link = await queries.findLinkWhereShortURL(shortURL);
        if (link) {
          res.render("duplicateURL");
        } else {
          await queries.createLinks(fullURL, shortURL);
          res.redirect("/");
        }
      } else {
        //return invalid url error
        res.render("invalidURL");
      }
    }
  },
];
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
