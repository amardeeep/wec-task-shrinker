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
    const user = req.user;
    const links = await queries.readLinks(user.id);
    if (!errors.isEmpty()) {
      return res.status(400).render("home", {
        errorsG: errors.array(),
        errorG: null,
        user,
        links,
        errorsS: null,
        errorS: null,
      });
    }
    const fullURL = req.body.fullURL;
    const userId = req.user.id;
    const link = await queries.findLinkWhereFullURL(fullURL, userId);
    if (link) {
      res.render("home", {
        errorsG: null,
        errorG: "This URL already exists.",
        errorsS: null,
        errorS: null,
        links,
        user,
      });
    } else {
      if (isValid(fullURL)) {
        let shortURL = short.generate();
        const link = await queries.findLinkWhereShortURL(shortURL);
        while (link) {
          shortURL = short.generate();
          link = await queries.findLinkWhereShortURL(shortURL);
        }
        await queries.createLinks(fullURL, shortURL, userId);
        res.redirect("/");
      } else {
        //return invalid url error
        res.render("home", {
          user,
          links,
          errorsG: null,
          errorG: "Invalid URL",
          errorS: null,
          errorsS: null,
        });
      }
    }
  },
];
const postSubmitLinks = [
  validateSubmitURL,
  async (req, res) => {
    const errors = validationResult(req);
    const user = req.user;
    const links = await queries.readLinks(user.id);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("home", {
          errorsS: errors.array(),
          errorS: null,
          links,
          user,
          errorG: null,
          errorsG: null,
        });
    }
    const fullURL = req.body.fullURL;
    const userId = req.user.id;
    const link = await queries.findLinkWhereFullURL(fullURL, userId);
    if (link) {
      res.render("home", {
        errorS: "This URL already exists.",
        errorsS: null,
        links,
        user,
        errorG: null,
        errorsG: null,
      });
    } else {
      if (isValid(fullURL)) {
        const shortURL = req.body.shortURL;
        const link = await queries.findLinkWhereShortURL(shortURL, userId);
        if (link) {
          res.render("home", {
            errorsS: null,
            errorS: "This short URL is already in use.",
            links,
            user,
            errorG: null,
            errorsG: null,
          });
        } else {
          await queries.createLinks(fullURL, shortURL, userId);
          res.redirect("/");
        }
      } else {
        //return invalid url error
        res.render("home", {
          errors: null,
          error: "Invalid URL.",
          links,
          user,
        });
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
