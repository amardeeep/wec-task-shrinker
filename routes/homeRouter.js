const { Router } = require("express");
const queries = require("../prisma/queries");
const homeRouter = Router();
homeRouter.get("/", async (req, res) => {
  const links = await queries.readLinks();
  const user = "Some user";
  res.render("home", { links, user });
});
homeRouter.post("/links", async (req, res) => {
  const fullURL = req.body.fullURL;
  const shortURL = req.body.shortURL;
  await queries.createLinks(fullURL, shortURL);
  res.redirect("/");
});

module.exports = { homeRouter };
