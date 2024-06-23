const express = require("express");
const { ensureAuthenticated } = require("../middlewares/auth.middleware");
const {
  addNewWebsite,
  deleteWebsite,
  getAllWebsites,
} = require("../controllers/website.controller");

const router = express.Router();

router.get("/website", ensureAuthenticated, getAllWebsites);
router.post("/website", ensureAuthenticated, addNewWebsite);
router.delete("/website/:webId", ensureAuthenticated, deleteWebsite);

module.exports = router;
