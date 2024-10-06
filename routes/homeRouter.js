const { Router } = require("express");
const queries = require("../prisma/queries");
const controllers = require("../controllers/homeControllers");
const homeRouter = Router();
homeRouter.get("/", async (req, res) => {
  const user = req.user;
  if (user) {
    const links = await queries.readLinks(user.id);
    res.render("home", { links, user });
  } else {
    res.render("home", { links: null, user });
  }
});
homeRouter.get("/generateLinks", (req, res) => {
  const user = req.user;
  if (user) {
    res.render("generateLinks", { errors: null, error: null });
  } else {
    res.render("home", { links: null, user: null });
  }
});
homeRouter.get("/submitLinks", (req, res) => {
  const user = req.user;
  if (user) {
    res.render("submitLinks", { errors: null, error: null });
  } else {
    res.render("home", { links: null, user: null });
  }
});
homeRouter.get("/:shortURL/shortURL", controllers.getShortURL);
homeRouter.get("/:id/delete", controllers.deleteLink);
homeRouter.post("/submitLinks", controllers.postSubmitLinks);
homeRouter.post("/generateLinks", controllers.postGenerateLinks);
module.exports = { homeRouter };
