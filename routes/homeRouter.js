const { Router } = require("express");
const queries = require("../prisma/queries");
const controllers = require("../controllers/homeControllers");
const homeRouter = Router();
homeRouter.get("/", async (req, res) => {
  const links = await queries.readLinks();
  const user = req.user;
  res.render("home", { links, user });
});
homeRouter.get("/generateLinks", (req, res) => {
  res.render("generateLinks", { errors: null, error: null });
});
homeRouter.get("/submitLinks", (req, res) => {
  res.render("submitLinks", { errors: null, error: null });
});
homeRouter.get("/:shortURL/shortURL", controllers.getShortURL);
homeRouter.get("/:id/delete", controllers.deleteLink);
homeRouter.post("/submitLinks", controllers.postSubmitLinks);
homeRouter.post("/generateLinks", controllers.postGenerateLinks);
module.exports = { homeRouter };
