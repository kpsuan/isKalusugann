import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, updatepost } from '../controllers/post.controller.js';
import { getposts, deletepost } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getposts', getposts)
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost);
router.put('/updatepost/:postId/:userId', verifyToken, updatepost);

export default router;
