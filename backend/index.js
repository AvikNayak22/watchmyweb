const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/connectDB");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user.router");

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use(userRoutes);

app.listen(5000, async () => {
  console.log("Backend is up at port 5000");
});
