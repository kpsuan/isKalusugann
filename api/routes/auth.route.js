import express from 'express';
import { signin, signup, google, signout, attendance, forgotPassword } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/attendance', attendance);
router.post('/google', google);
router.get('/signout', signout);
router.post('/forgot-password', forgotPassword);

export default router;
