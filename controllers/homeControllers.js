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
const validateSubmitURL = [
  body("fullURL").trim().not().isEmpty().withMessage(`Full URL ${isEmpty}`),
  body("shortURL").trim().not().isEmpty().withMessage(`Short URL ${isEmpty}`),
];
const validateGenerateURL = [
  body("fullURL").trim().not().isEmpty().withMessage(`Full URL ${isEmpty}`),
];
const postGenerateLinks = [
  validateGenerateURL,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("generateLinks", { errors: errors.array(), error: null });
    }
    const fullURL = req.body.fullURL;
    const link = await queries.findLinkWhereFullURL(fullURL);
    if (link) {
      res.render("generateLinks", {
        errors: null,
        error: "This Full URL already exists.",
      });
    } else {
      if (isValid(fullURL)) {
        let shortURL = short.generate();
        const link = await queries.findLinkWhereShortURL(shortURL);
        while (link) {
          shortURL = short.generate();
          link = await queries.findLinkWhereShortURL(shortURL);
        }
        const userId = req.user.id;
        await queries.createLinks(fullURL, shortURL, userId);
        res.redirect("/");
      } else {
        //return invalid url error
        res.render("generateLinks", { errors: null, error: "Invalid URL" });
      }
    }
  },
];
const postSubmitLinks = [
  validateSubmitURL,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("submitLinks", { errors: errors.array(), error: null });
    }
    const fullURL = req.body.fullURL;
    const link = await queries.findLinkWhereFullURL(fullURL);
    if (link) {
      // res.render("duplicateURL");
      res.render("submitLinks", {
        error: "This Full URL already exists.",
        errors: null,
      });
    } else {
      if (isValid(fullURL)) {
        const shortURL = req.body.shortURL;
        const link = await queries.findLinkWhereShortURL(shortURL);
        if (link) {
          res.render("submitLinks", {
            errors: null,
            error:
              "This short URL is already in use. Please Enter a different URL or generate a random URL.",
          });
        } else {
          const userId = req.user.id;
          await queries.createLinks(fullURL, shortURL, userId);
          res.redirect("/");
        }
      } else {
        //return invalid url error
        res.render("submitLinks", { errors: null, error: "Invalid URL." });
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
const deleteLink = async (req, res) => {
  const id = req.params.id;
  await queries.deleteLink(id);
  res.redirect("/");
};
module.exports = {
  postGenerateLinks,
  postSubmitLinks,
  getShortURL,
  deleteLink,
};
