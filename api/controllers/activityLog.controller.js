import { errorHandler } from "../utils/error.js"
import ActivityLog from "../models/activityLog.model.js"

export const logActivity = async (userId, action, details) => {
    try {
      await ActivityLog.create({
        userId,
        action,
        details
      });
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  };

export const getActivityLogs = async (req, res, next) => {
    try {
      const logs = await ActivityLog.find().populate("userId", "username email");
      res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  };

  export const log = async (req, res) => {
    try {
      const { userId, action, details } = req.body;
  
      if (!userId || !action) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      const newLog = new ActivityLog({
        userId,
        action,
        details,
        timestamp: new Date(),
      });
  
      await newLog.save();
      res.status(201).json({ message: "Activity logged successfully" });
    } catch (error) {
      console.error("Error logging activity:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  