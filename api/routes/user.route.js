import express from 'express';
import {
  test,
  updateUser,
  deleteUser,
  getUsers,
  updateStatus,
  getInperson,
  getUserById,
  assignSchedule,
  deleteSchedule,
  viewUsersScheduled,
  scheduledToday,
  getUsersByCourse, 
  getUsersByCollege,
  getusersub,
  getUsersByCourseInPerson,
  getUsersByCollegeInPerson,
  getreschedUsers,
  rescheduleUser,


} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/', test);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/getusers', verifyToken, getUsers);
router.get('/getinperson', verifyToken, getInperson);
router.get('/reschedUsers', verifyToken, getreschedUsers);

router.put('/updateStatus/:id', verifyToken, updateStatus);
router.post('/assignschedule', verifyToken, assignSchedule);
router.get('/:id', verifyToken, getUserById);
router.delete('/deleteschedule', verifyToken, deleteSchedule);
router.get('/scheduled-for-date/:date', verifyToken, viewUsersScheduled);
router.get('/scheduled-for-today', verifyToken, scheduledToday);
router.get('/getUsersByCourse/:courseName', verifyToken, getUsersByCourse);
router.get('/getUsersByCourseInPerson/:courseName', verifyToken, getUsersByCourseInPerson);
router.get('/getUsersByCollege/:collegeName', verifyToken, getUsersByCollege);
router.get('/getUsersByCollegeInPerson/:collegeName', verifyToken, getUsersByCollegeInPerson);
router.post('/reschedule/:userId', verifyToken, rescheduleUser);
router.get('/getsubmmitedUsers', verifyToken, getusersub);






export default router;
