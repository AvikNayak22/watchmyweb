const express = require("express");
const {
  signupUser,
  loginUser,
  generateNewAccessToken,
} = require("../controllers/user.controller");

const router = express.Router();

router.post("/user/signup", signupUser);
router.post("/user/login", loginUser);
router.post("/user/new-token", generateNewAccessToken);

module.exports = router;
