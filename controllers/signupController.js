const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const queries = require("../prisma/queries");
const emptyErr = "Can not be empty.";

const passwordErr =
  "is weak. Should atleast be 8 characters long and must have 1 number, 1 symbol, 1 Uppercase letter and 1 Lowercase letter";
const confirmPassowrdErr = "does not match password.";
const validateUser = [
  body("userName").trim().not().isEmpty().withMessage(`Username ${emptyErr}`),
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    })
    .withMessage(`Password ${passwordErr}`),
  body("cpassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage(`Confirm Password ${confirmPassowrdErr}`),
];
const postUser = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signup", { errors: errors.array() });
    }
    const { userName, password } = req.body;
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      await queries.createUser(userName, hashedPassword);
    });
    res.redirect("/");
  },
];

module.exports = { postUser };
