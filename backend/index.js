const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const nodemailer = require("nodemailer");
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

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const isSiteActive = async (url) => {
  if (!url) return false;

  const res = await axios.get(url).catch((err) => void err);

  if (!res || res.status !== 200) {
    return false;
  }

  return true;
};

cron.schedule("0 */1 * * *", async () => {
  console.log("Cron ran");
  const allWebsites = await websiteModel
    .find({})
    .populate({ path: "userId", select: ["name", "email"] });

  if (!allWebsites.length) return;

  for (let i = 0; i < allWebsites.length; i++) {
    const website = allWebsites[i];
    const url = website.url;

    const isActive = await isSiteActive(url);

    await websiteModel.updateOne({ _id: website._id }, { isActive });

    console.log("Checking website", website.url);
    console.log(
      "Current status:",
      isActive,
      "Previous status:",
      website.isActive
    );

    if (!isActive && website.isActive) {
      //send email to the user
      const info = await transport.sendMail({
        from: process.env.EMAIL,
        to: website.userId.email,
        subject: `Your website is down.`,
        text: `Your website with url ${url} went down on ${new Date().toLocaleDateString(
          "en-in"
        )}. Please check whats wrong.`,
      });

      console.log("Message sent: %s", info.messageId);
    }
  }
});

app.listen(5000, async () => {
  console.log("Backend is up at port 5000");
});
