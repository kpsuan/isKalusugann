import Settings from "../models/settings.model.js";

import { errorHandler } from "../utils/error.js"
import { logActivity } from "./activityLog.controller.js";

export const saveDates = async (req, res, next) => {
   try {
    const {userId, startDate, endDate } = req.body;

    const settings = await Settings.findOneAndUpdate(
      { key: "annualPE" }, 
      { startDate, endDate, updatedBy: userId }, // Save userId
      { upsert: true, new: true }
    );

    // Log activity
    await logActivity(userId, "Updated annual PE dates", settings);

    res.status(200).json({ message: "Dates saved successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save dates" });
  }
}

export const savePreEnlistmentDates = async (req, res, next) => {
  try {
   const { userId, preEnlistStart, preEnlistEnd } = req.body;

   console.log("Received in backend:", { userId, preEnlistStart, preEnlistEnd });

    const settings = await Settings.findOneAndUpdate(
      { key: "annualPE" },
      { preEnlistStart, preEnlistEnd, updatedBy: userId },
      { upsert: true, new: true }
    );

    // Log activity
    await logActivity(userId, "Updated pre-enlistment dates", settings);

   res.status(200).json({ message: "Pre-enlistment dates saved successfully!" });
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

export const getPreEnlistmentDates = async (req, res, next) => {
  try {
    const settings = await Settings.findOne({ key: "annualPE" }); // Find by key
    if (settings) {
      res.status(200).json({ preEnlistStart: settings.preEnlistStart, preEnlistEnd: settings.preEnlistEnd });
    } else {
      res.status(404).json({ message: "No dates found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve dates" });
  }
};


export const clearDates = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const settings = await Settings.updateOne(
      { key: "annualPE" },
      { $set: { startDate: "", endDate: "", unavailableDates: "", clearedBy: userId, clearedAt: new Date() 
      } } // Retain fields with null values
    );

    // Log activity
    await logActivity(userId, "Cleared dates for schedule", settings);

    res.status(200).json({ message: "Dates cleared successfully!" });
  } catch (error) {
    console.error("Error clearing dates:", error);
    res.status(500).json({ error: "Failed to clear dates" });
  }
};

export const clearPreEnlistmentDates = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const settings = await Settings.updateOne(
      { key: "annualPE" },
      { $set: { preEnlistStart: "", preEnlistEnd: "", clearedBy: userId, clearedAt: new Date() 
      }} 
    );

    // Log activity
    await logActivity(userId, "Updated pre-enlistment dates", settings);

    res.status(200).json({ message: "Dates cleared successfully!" });
  } catch (error) {
    console.error("Error clearing dates:", error);
    res.status(500).json({ error: "Failed to clear dates" });
  }
};

const philippineHolidays2025 = [
  '2025-01-01', // New Year's Day
  '2025-01-29', // Chinese New Year
  '2025-02-11', // Evelio Javier
  '2025-02-25', // People Power
  '2025-03-18', // Liberation of Panay
  '2025-03-31', // Eidul Fitr
  '2025-04-09', // Araw ng Kagitingan
  '2025-04-17', // Maundy Thursday
  '2025-04-18', // Good Friday
  '2025-04-19', // Black Saturday
  '2025-05-01', // Labor Day
  '2025-06-06', // Eid'l Adha
  '2025-06-12', // Independence Day
  '2025-08-25', // National Heroes Day
  '2025-11-30', // Bonifacio Day
  '2025-12-25', // Christmas Day
  '2025-12-30', // Rizal Day
];

// Export holidays so they can be imported in other controllers
export { philippineHolidays2025 };

// For storing and retrieving unavailable dates
export const getUnavailableDates = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    
    // Return both standard holidays and custom unavailable dates
    const customUnavailableDates = settings.unavailableDates || [];
    
    res.status(200).json({
      standardHolidays: philippineHolidays2025,
      customUnavailableDates
    });
  } catch (error) {
    next(error);
  }
};

// For adding custom unavailable dates
export const updateUnavailableDates = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'Only admins are allowed to update unavailable dates.'));
    }
    const { datesToAdd = [], datesToRemove = [] } = req.body;
    const userId = req.user.id;
    
    // Get current settings
    const settings = await Settings.getSettings();
    
    // If unavailableDates doesn't exist yet, initialize it
    if (!settings.unavailableDates) {
      settings.unavailableDates = [];
    }
    
    // Create a set of current unavailable dates
    const currentUnavailableDates = new Set(settings.unavailableDates);
    
    // Add new dates
    datesToAdd.forEach(date => currentUnavailableDates.add(date));
    
    // Remove dates (except standard holidays)
    datesToRemove.forEach(date => {
      if (!philippineHolidays2025.includes(date)) {
        currentUnavailableDates.delete(date);
      }
    });
    
    // Update the settings
    settings.unavailableDates = Array.from(currentUnavailableDates);
    settings.updatedBy = userId; // Save userId

    await settings.save();

    await logActivity(userId, "Updated unavailable dates", settings);

    
    res.status(200).json({
      message: 'Unavailable dates updated successfully',
      unavailableDates: Array.from(currentUnavailableDates)
    });
  } catch (error) {
    next(error);
  }
};

