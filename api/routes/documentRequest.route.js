import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';

import { createRequest, getRequestDetails, getRequestHistory, getRequestHistory2, updateRequestStatus } from '../controllers/documentRequest.controller.js';


const router = express.Router();

router.post('/create', verifyToken,  createRequest)
router.get('/history/:userId',  getRequestHistory)
router.get("/getRequestHistory2", getRequestHistory2);
router.get("/getRequestHistory", getRequestHistory);
router.put("/updateStatus",  updateRequestStatus);
router.get("/:trackingNumber", getRequestDetails)





export default router;