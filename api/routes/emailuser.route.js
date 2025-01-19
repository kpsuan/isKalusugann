import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { emailUser } from '../controllers/emailuser.controller.js';



const router = express.Router();

router.post('/emailUser', emailUser);

export default router;
