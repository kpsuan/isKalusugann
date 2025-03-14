import express from 'express';
import { getActivityLogs, log, logActivity } from '../controllers/activityLog.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get("/get-activity", verifyToken, getActivityLogs); // Only admins can view logs
router.post("/log", log); // Only admins can view logs


export default router;
