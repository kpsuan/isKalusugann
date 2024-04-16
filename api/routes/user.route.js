import express from 'express';
import {
  test,
  updateUser,
  deleteUser,
  getUsers,
  updateStatus,
  getInperson,
  getUserById,

} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/', test);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/getusers', verifyToken, getUsers);
router.get('/getinperson', verifyToken, getInperson);

router.put('/updateStatus/:id', verifyToken, updateStatus);
router.get('/:id', verifyToken, getUserById);


export default router;
