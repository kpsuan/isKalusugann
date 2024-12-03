import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createEvent, getevents, getUpcomingEvents } from '../controllers/events.controller.js';

const router = express.Router();

// Route to create an event
router.post('/createEvent', verifyToken, createEvent);
router.get('/getevents',  getevents);
router.get('/upcoming', verifyToken, getUpcomingEvents);


export default router;