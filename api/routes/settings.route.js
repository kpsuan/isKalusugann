import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { saveDates, getDates, clearDates } from '../controllers/settings.controller.js';
const router = express.Router();

router.post('/saveDates', verifyToken, saveDates)
router.get('/getDates', verifyToken, getDates)
router.delete('/clearDates', verifyToken, clearDates)

export default router;