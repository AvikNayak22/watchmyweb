const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const userModel = require("../models/user.model");

const secretKey = process.env.SECRET_KEY;

const generateToken = (data, exp) => {
  if (!exp) exp = Date.now() / 1000 + 24 * 60 * 60;

  const token = jwt.sign(
    {
      exp,
      data,
    },
    secretKey
  );

  return token;
};

const verifyJWTToken = (token) => {
  let data;
  try {
    data = jwt.verify(token, secretKey);
  } catch (error) {
    throw new Error(error);
  }

  return data;
};

const validateEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

const generateNewAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({
        status: false,
        message: "Refresh token required.",
      });
      return;
    }

    if (!verifyJWTToken(refreshToken)) {
      res.status(400).json({
        status: false,
        message: "Refresh token is not valid.",
      });
      return;
    }

    const user = await userModel.findOne({
      "tokens.refreshToken.token": refreshToken,
    });
    if (!user) {
      res.status(422).json({
        status: false,
        message: "User not found",
      });
      return;
    }

    const aTokenExp = Date.now() / 1000 + 24 * 60 * 60;
    const aToken = generateToken(
      {
        email: user.email,
        name: user.name,
      },
      aTokenExp
    );

    user.tokens.accessToken = {
      token: aToken,
      expireAt: new Date(aTokenExp * 1000),
    };

    await user.save();

    res.status(201).json({
      status: true,
      message: "Access Token created.",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error creating access token.",
      error: error.message,
    });
  }
};

const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        status: false,
        message: "All fields are required.",
      });
      return;
    }

    if (!validateEmail(email)) {
      res.status(400).json({
        status: false,
        message: "Email is not valid.",
      });
      return;
    }

    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const aTokenExp = Date.now() / 1000 + 24 * 60 * 60;
    const aToken = generateToken(
      {
        email,
        name,
      },
      aTokenExp
    );

    const rTokenExp = Date.now() / 1000 + 20 * 24 * 60 * 60;
    const rToken = generateToken(
      {
        email,
        name,
      },
      rTokenExp
    );

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      tokens: {
        accessToken: {
          token: aToken,
          expireAt: new Date(aTokenExp * 1000),
        },
        refreshToken: {
          token: rToken,
          expireAt: new Date(rTokenExp * 1000),
        },
      },
    });
    await newUser.save();

    res.status(201).json({
      status: true,
      message: "User successfully created!",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error creating User!",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        status: false,
        message: "All fields are required.",
      });
      return;
    }

    if (!validateEmail(email)) {
      res.status(400).json({
        status: false,
        message: "Email is not valid.",
      });
      return;
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      res.status(422).json({
        status: false,
        message: "User does not exist.",
      });
      return;
    }

    const dbPassword = user.password;
    const matched = await bcrypt.compare(password, dbPassword);

    if (!matched) {
      res.status(422).json({
        status: false,
        message: "Password does not match.",
      });
      return;
    }

    res.status(200).json({
      status: true,
      message: "User successfully logged in!",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error logging in!",
      error: error.message,
    });
  }
};

module.exports = { signupUser, loginUser, generateNewAccessToken };
