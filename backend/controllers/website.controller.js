const axios = require("axios");
const websiteModel = require("../models/website.model");

const validateUrl = (url) => {
  const pattern = /^(ftp|http|https):\/\/[^ "]+$/;
  return pattern.test(url);
};

const addNewWebsite = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      res.status(400).json({ status: false, message: "Url is required" });
      return;
    }

    const validUrl = validateUrl(url);
    if (!validUrl) {
      res.status(422).json({ status: false, message: "Url is not valid" });
      return;
    }

    const user = req.user;

    const response = await axios.get(url).catch((err) => void err);
    if (!response || response.status !== 200) {
      res.status(422).json({
        status: false,
        message: `Website with url ${url} is not active.`,
      });

      return;
    }

    const newWebsite = new websiteModel({
      url,
      userId: user._id,
      isActive: true,
    });

    await newWebsite.save();

    res.status(201).json({
      status: true,
      message: "Website added successfully!",
      data: newWebsite,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error adding website!",
      error: error.message,
    });
  }
};

const deleteWebsite = async (req, res) => {
  try {
    const id = req.params.webId;

    if (!id) {
      res.status(400).json({ status: false, message: "Id is required" });
      return;
    }

    const website = await websiteModel.findById(id);
    if (!website) {
      res.status(404).json({ status: false, message: "Website not found" });
      return;
    }

    await websiteModel.deleteOne({ _id: id });

    res.status(200).json({
      status: true,
      message: "Website deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error deleting website!",
      error: error.message,
    });
  }
};

const getAllWebsites = async (req, res) => {
  try {
    const results = await websiteModel
      .find({ userId: req.user._id })
      .populate({ path: "userId", select: ["name", "email"] });

    res.status(200).json({
      status: true,
      message: "All website details fetched successfully!",
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching website details!",
      error: error.message,
    });
  }
};

module.exports = { addNewWebsite, deleteWebsite, getAllWebsites };
