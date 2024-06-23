const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const cron = require("node-cron");

const connectDB = require("./config/connectDB");
const userRoutes = require("./routes/user.router");
const websiteRoutes = require("./routes/website.router");
const websiteModel = require("./models/website.model");

const dotenv = require("dotenv");
dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use(userRoutes);
app.use(websiteRoutes);

const isSiteActive = async (url) => {
  if (!url) return false;

  const res = await axios.get(url).catch((err) => void err);

  if (!res || res.status !== 200) {
    return false;
  }

  return true;
};

cron.schedule("0 */1 * * *", async () => {
  const allWebsites = await websiteModel
    .find({})
    .populate({ path: "userId", select: ["name", "email"] });
  if (!allWebsites.length) return;

  for (let i = 0; i < allWebsites.length; i++) {
    const website = allWebsites[i];
    const url = website.url;

    const isActive = await isSiteActive(url);

    websiteModel.updateOne(
      { _id: website._id },
      {
        isActive,
      }
    );
    if (!isActive) {
    }
  }
});

app.listen(5000, async () => {
  console.log("Backend is up at port 5000");
});
