import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createRequest, getRequestHistory, getRequestHistory2 } from '../controllers/documentRequest.controller.js';


const router = express.Router();

router.post('/create', verifyToken,  createRequest)
router.get('/history/:userId',  getRequestHistory)
router.get("/getRequestHistory2", getRequestHistory2);




export default router;