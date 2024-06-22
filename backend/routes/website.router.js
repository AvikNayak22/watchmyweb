const express = require("express");
const { ensureAuthenticated } = require("../middlewares/auth.middleware");
const { addNewWebsite } = require("../controllers/website.controller");

const router = express.Router();

router.post("/website", ensureAuthenticated, addNewWebsite);

module.exports = router;
