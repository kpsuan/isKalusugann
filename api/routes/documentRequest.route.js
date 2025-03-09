import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';

import { createRequest,  createRequestDoc,  getRequestDetails, getRequestHistory, getRequestHistory2, getRequestHistoryDoctor, updateRequestStatus, updateRequestStatusDoc } from '../controllers/documentRequest.controller.js';


const router = express.Router();

router.post('/create', verifyToken,  createRequest)
router.post('/create2', verifyToken,  createRequestDoc)
router.get('/history/:userId',  getRequestHistory)
router.get("/getRequestHistory2", getRequestHistory2);
router.get("/getRequestHistory", getRequestHistory);
router.get("/getRequestHistoryDoctor", getRequestHistoryDoctor);
router.put("/updateStatus",  updateRequestStatus);
router.put("/updateStatus2",  updateRequestStatusDoc);

router.get("/:trackingNumber", getRequestDetails)




export default router;