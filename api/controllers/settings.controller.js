import Settings from "../models/settings.model.js";

import { errorHandler } from "../utils/error.js"

export const saveDates = async (req, res, next) => {
   try {
    const { startDate, endDate } = req.body;

    // Save to database (Assuming a Settings model exists)
    await Settings.updateOne(
      { key: "annualPE" }, // Key to identify the setting
      { startDate, endDate },
      { upsert: true } // Insert if not exists
    );

    res.status(200).json({ message: "Dates saved successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save dates" });
  }
}

export const getDates = async (req, res, next) => {
  try {
    const settings = await Settings.findOne({ key: "annualPE" }); // Find by key
    if (settings) {
      res.status(200).json({ startDate: settings.startDate, endDate: settings.endDate });
    } else {
      res.status(404).json({ message: "No dates found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve dates" });
  }
};

