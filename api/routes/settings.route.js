import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { saveDates, getDates } from '../controllers/settings.controller.js';
const router = express.Router();

router.post('/saveDates', verifyToken, saveDates)
router.get('/getDates', verifyToken, getDates)

export default router;