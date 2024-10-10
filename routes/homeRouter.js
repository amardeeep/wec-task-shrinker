const { Router } = require("express");
const queries = require("../prisma/queries");
const controllers = require("../controllers/homeControllers");
const homeRouter = Router();
homeRouter.get("/", async (req, res) => {
  const user = req.user;
  if (user) {
    const links = await queries.readLinks(user.id);
    res.render("home", {
      links,
      user,
      errorsS: null,
      errorS: null,
      errorG: null,
      errorsG: null,
    });
  } else {
    res.render("home", {
      links: null,
      user,
      errorsS: null,
      errorS: null,
      errorG: null,
      errorsG: null,
    });
  }
});
homeRouter.get("/:shortURL/shortURL", controllers.getShortURL);
homeRouter.get("/:id/delete", controllers.deleteLink);
homeRouter.post("/submitLinks", controllers.postSubmitLinks);
homeRouter.post("/generateLinks", controllers.postGenerateLinks);
module.exports = { homeRouter };
