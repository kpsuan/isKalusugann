import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createLaboratoryService, getLaboratoryServices } from '../controllers/lab.controller.js';

const router = express.Router();

router.post('/createlab', verifyToken, createLaboratoryService);
router.get('/getlabservices',  getLaboratoryServices);

export default router;