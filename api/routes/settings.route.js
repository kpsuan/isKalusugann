import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { saveDates, getDates, clearDates, savePreEnlistmentDates, getPreEnlistmentDates, clearPreEnlistmentDates, getUnavailableDates, updateUnavailableDates } from '../controllers/settings.controller.js';
const router = express.Router();

router.post('/saveDates', verifyToken, saveDates)
router.get('/getDates', verifyToken, getDates)
router.delete('/clearDates', verifyToken, clearDates)

router.post('/savePreEnlistDates', verifyToken, savePreEnlistmentDates)
router.get('/getPreEnlistmentDates', verifyToken, getPreEnlistmentDates)
router.delete('/clearPreEnlistmentDates', verifyToken, clearPreEnlistmentDates)

router.get('/get-unavailable-dates', verifyToken, getUnavailableDates)
router.post('/update-unavailable-dates', verifyToken, updateUnavailableDates)

export default router;