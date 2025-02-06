import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { getEmergencyDates } from '../controllers/emergency.controller.js';
const router = express.Router();

router.get('/get-emergency-dates', verifyToken, getEmergencyDates)

export default router;