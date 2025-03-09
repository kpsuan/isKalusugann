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
  viewUsersScheduledToday,
  getUsersByCourse, 
  getUsersByCollege,
  getusersub,
  getUsersByCourseInPerson,
  getUsersByCollegeInPerson,
  getreschedUsers,
  rescheduleUser,
  updateUserWithReschedule,
  getUsersWithCompleteDocs,
  getUsersNoDocs,
  getUsersIncDocs,
  getUsersOverallPresent,
  getUsersPresentYesterday,
  getUsersOverallAbsent,
  getStats,
  updateUserRescheduleDate,
  updateNotifications,
  markNotificationAsRead,
  releaseUser,
  clearNotifications,
  sendAdminNotification,
  sendAdminNotification2,
  handleEmergency,
  getAdmin,
  getUsersApprovedByDoctor,
  getUsersApprovedByDentist,
  getUsersForOverallApproval,
  getMonthlyStats,
  getAll,
  deleteGraduatingUsers


} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/', test);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.delete('/delete-graduating', verifyToken, deleteGraduatingUsers);

router.post('/updateReschedule/:id', verifyToken,  updateUserRescheduleDate);
router.get('/:userId/notifications', verifyToken, updateNotifications);
router.put('/:userId/notifications/:notificationId', markNotificationAsRead);
router.put('/notifications/clear/:id', clearNotifications);

router.get('/getusers', verifyToken, getUsers);
router.get('/getall', verifyToken, getAll);

router.get('/getadmins', verifyToken, getAdmin);

router.get('/getstats', getStats);
router.get('/getmonthlystats', getMonthlyStats);
router.get('/getinperson', verifyToken, getInperson);
router.get('/reschedUsers', verifyToken, getreschedUsers);
router.get('/no-docs', verifyToken, getUsersNoDocs);
router.get('/complete-docs', verifyToken, getUsersWithCompleteDocs);
router.get('/inc-docs', verifyToken, getUsersIncDocs);
router.get('/overallpresent', verifyToken, getUsersOverallPresent);
router.get('/overallabsent', verifyToken, getUsersOverallAbsent);
router.get('/yesterdaypresent', verifyToken, getUsersPresentYesterday);

router.get('/approved-doctor', verifyToken, getUsersApprovedByDoctor);
router.get('/approved-dentist', verifyToken, getUsersApprovedByDentist);
router.get('/overall-approval', verifyToken, getUsersForOverallApproval);


router.put('/updateStatus/:id', verifyToken, updateStatus);
router.post('/assignschedule', verifyToken, assignSchedule);
router.get('/scheduled-for-date/:date', verifyToken, viewUsersScheduled);
router.get('/sched-for-today', verifyToken, viewUsersScheduledToday);
router.get('/:id', verifyToken, getUserById);
router.delete('/deleteschedule', verifyToken, deleteSchedule);
router.delete("/releaseSlot/:userId", verifyToken, releaseUser);


router.get('/getUsersByCourse/:courseName', verifyToken, getUsersByCourse);
router.get('/getUsersByCourseInPerson/:courseName', verifyToken, getUsersByCourseInPerson);
router.get('/getUsersByCollege/:collegeName', verifyToken, getUsersByCollege);
router.get('/getUsersByCollegeInPerson/:collegeName', verifyToken, getUsersByCollegeInPerson);
router.post('/reschedule/:userId', verifyToken, rescheduleUser);
router.get('/getsubmmitedUsers', verifyToken, getusersub);
router.post('/updateUserReschedule/:userId', verifyToken, updateUserWithReschedule);

router.put('/sendAdminNotification', verifyToken, sendAdminNotification);
router.put('/sendAdminNotification2', verifyToken, sendAdminNotification2);
router.post('/emergency-reschedule', verifyToken, handleEmergency);








export default router;
