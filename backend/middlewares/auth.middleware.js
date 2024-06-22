const userModel = require("../models/user.model");

const ensureAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(400).json({
      status: false,
      message: "token not found",
    });

    return;
  }

  const user = await userModel.findOne({
    "tokens.accessToken.token": token,
  });

  if (!user) {
    res.status(422).json({
      status: false,
      message: "Invalid Token",
    });

    return;
  }

  req.user = user;
  next();
};

module.exports = { ensureAuthenticated };
