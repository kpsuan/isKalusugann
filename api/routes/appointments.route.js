import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, fetchAvailableTimeSlots, fetchMonthlyAvailability } from '../controllers/appointments.controller.js';

const router = express.Router();

// Route to create a new appointment
router.post('/create', verifyToken, create);

// Route to fetch available time slots for a specific date
router.get('/available-slots/:date', fetchAvailableTimeSlots);

// Route to fetch monthly availability status for a specific year and month
router.get('/monthly-availability/:year/:month', fetchMonthlyAvailability);

export default router;
