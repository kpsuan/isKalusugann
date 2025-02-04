import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { addToQueue, completeStep, getQueueStudents, getQueueSummary, makeStudentPriority, moveToNextStep } from '../controllers/queue.controller.js';
const router = express.Router();

router.post('/add-to-queue', verifyToken, addToQueue)
router.get('/get-students', verifyToken, getQueueStudents)
router.get('/get-queue-summary', verifyToken, getQueueSummary)


router.post('/complete-step', verifyToken, completeStep)
router.post('/move-to-next-step', verifyToken, moveToNextStep)
router.post('/make-student-priority', verifyToken, makeStudentPriority)

export default router;
