import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';

import fs from 'fs';
import path from 'path';

import moment from 'moment';


export const test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};

// update user

export const updateUser = async (req, res, next) => {
  // Check if the user has the right to update the account
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return next(errorHandler(401, 'You can update only your account!'));
  }

  try {
    // Hash password if updated
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const today = new Date();
    const todayString = today.toDateString();
    const cutoffHour = 17; // 5 PM cutoff
    const nowUTC = new Date();
    const nowLocalUTCPlus8 = new Date(nowUTC.getTime() + (8 * 60 * 60 * 1000)); // 8 hours in milliseconds


    let userScheduleString;
    if (Array.isArray(req.body.schedule) && req.body.schedule.length > 0) {
      const userSchedule = new Date(req.body.schedule[0]);
      userScheduleString = userSchedule.toDateString();
    }
    // Initialize the update data object
    const updateData = {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        degreeLevel: req.body.degreeLevel,
        yearLevel: req.body.yearLevel,
        college: req.body.college,
        degreeProgram: req.body.degreeProgram,
        profilePicture: req.body.profilePicture,
        annualPE: req.body.annualPE,
        peForm: req.body.peForm,
        labResults: req.body.labResults,
        requestPE: req.body.requestPE,
        status: req.body.status,
        comment: req.body.comment,
        medcert: req.body.medcert,
        schedule: req.body.schedule,
        reschedule: req.body.reschedule,
        rescheduleStatus: req.body.rescheduleStatus,
        rescheduledDate: req.body.rescheduledDate,
        rescheduleRemarks: req.body.rescheduleRemarks,
        isRescheduled: req.body.isRescheduled,
        lastUpdated: nowLocalUTCPlus8,
      },
    };

    // Handle queueNumber and queueNumberDate
      // Use 0 if queueNumber is not provided in the request
    updateData.$set.queueNumber = req.body.queueNumber ? Number(req.body.queueNumber) : 0;


    if (req.body.queueNumberDate) {
      const parsedDate = new Date(req.body.queueNumberDate);
      if (!isNaN(parsedDate)) {
        updateData.$set.queueNumberDate = parsedDate;
      }
    }
    

    // Mark as 'ABSENT' if schedule date is today and current time is past cutoff hour
    const currentHour = today.getHours();
    if (userScheduleString === todayString && currentHour >= cutoffHour && !req.body.isPresent) {
      updateData.$set.isPresent = 'ABSENT';
    }

    // Find and update the user in the database
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

    // Remove password from the response
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const updateNotifications = async (req, res) => { 
  try {
    const { userId } = req.params; // Access userId correctly
    const user = await User.findById(userId).select('-queueNumber -queueNumberDate');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const notifications = [];
    const lastUpdated = user.lastUpdated; // Get the last updated timestamp

    // Add notifications based on user status
    if (user.status === 'approved') {
      notifications.push({
        message: 'Your documents have been verified. See attached medcert below.',
        type: 'success',
        link: '/status',
        timestamp: lastUpdated, // Use the last updated timestamp
      });
    } else if (user.status === 'denied') {
      notifications.push({
        message: 'Your documents were denied. Please submit again.',
        type: 'error',
        link: '/status',
        timestamp: lastUpdated,
      });
    }

    if (user.annualPE === 'Online') {
      notifications.push({
        message: 'You may now start submitting the forms needed for Annual PE.',
        type: 'info',
        link: '/status',
        timestamp: lastUpdated,
      });
    } else if (user.annualPE === 'InPerson' && user.schedule.length > 0) {
      notifications.push({
        message: 'You can now view your schedule in the Schedule Tab below.',
        type: 'info',
        link: '/status',
        timestamp: lastUpdated,
      });
    }

    if (user.rescheduleStatus === 'approved') {
      notifications.push({
        message: 'You may view and select your preferred rescheduled date.',
        type: 'success',
        link: '/status',
        timestamp: lastUpdated,
      });
    } else if (user.rescheduleStatus === 'denied') {
      notifications.push({
        message: `Your reschedule request was denied because: "${user.rescheduleRemarks}".`,
        type: 'error',
        link: '/status#denied',
        timestamp: lastUpdated,
      });
    }

    if (user.isPresent === 'ARRIVED') {
      notifications.push({
        message: 'Annual PE done.',
        type: 'success',
        timestamp: lastUpdated,
      });
    } else if (user.isPresent === 'ABSENT') {
      notifications.push({
        message: 'You missed your Annual PE schedule.',
        type: 'warning',
        timestamp: lastUpdated,
      });
    }

    // Admin notifications for reschedule status and document submission (for all users)
    // Check if the logged-in user is an admin
    if (user.isAdmin) {  // Check if the user is an admin
      const allUsers = await User.find();  // Fetch all users

      // Iterate over all users to check if their reschedule status is "YES" or they have submitted documents
      for (let currentUser of allUsers) {
        // Admin notification for reschedule status
        if (currentUser.reschedule === 'YES') {
          notifications.push({
            message: `A user has requested to rescheduled their schedule. User: ${currentUser.firstName} ${currentUser.lastName}`,
            type: 'info',
            link: `/resched-status/${currentUser._id}`,  // Link to the user's reschedule status page
            timestamp: lastUpdated,
          });
        }

        // Admin notification for document submission
        if (
          (currentUser.peForm && currentUser.peForm !== "") ||
          (currentUser.labResults && currentUser.labResults !== "") ||
          (currentUser.requestPE && currentUser.requestPE !== "")
        ) {
          notifications.push({
            message: `A user has submitted documents for approval. User: ${currentUser.firstName} ${currentUser.lastName}`,
            type: 'info',
            link: `/user-status/${currentUser._id}`,  // Link to the user's status page
            timestamp: lastUpdated,
          });
        }
      }
    }

    // Sort notifications by timestamp (newest first)
    notifications.sort((a, b) => b.timestamp - a.timestamp);

    // Update user notifications
    user.notifications = notifications;
    await user.save();

    res.status(200).json({ message: 'Notifications updated', notifications });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const markNotificationAsRead = async (req, res) => {
  const { userId, notificationId } = req.params;

  try {
    // Validate notificationId
    if (!notificationId) {
      return res.status(400).json({ message: 'Notification ID is required' });
    }

    const user = await User.findById(userId).select('-queueNumber -queueNumberDate');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate user notifications array
    if (!user.notifications || user.notifications.length === 0) {
      return res.status(404).json({ message: 'No notifications found for user' });
    }

    // Find notification
    const notification = user.notifications.id(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Mark as read
    notification.isRead = true;
    await user.save();

    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Error marking notification as read:', error.message);
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
};




export const updateUserRescheduleDate = async (req, res, next) => {
  // Check if the user has the right to update the account
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return next(errorHandler(401, 'You can update only your account!'));
  }

  try {
    // Hash password if updated
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const today = new Date();
    const todayString = today.toDateString();
    const cutoffHour = 17; // 5 PM cutoff
    const nowUTC = new Date();
    const nowLocalUTCPlus8 = new Date(nowUTC.getTime() + (8 * 60 * 60 * 1000));

    let userScheduleString;
    if (Array.isArray(req.body.schedule) && req.body.schedule.length > 0) {
      const userSchedule = new Date(req.body.schedule[0]);
      userScheduleString = userSchedule.toDateString();
    }

    // Initialize the update data object
    const updateData = {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        degreeLevel: req.body.degreeLevel,
        yearLevel: req.body.yearLevel,
        college: req.body.college,
        degreeProgram: req.body.degreeProgram,
        profilePicture: req.body.profilePicture,
        annualPE: req.body.annualPE,
        peForm: req.body.peForm,
        labResults: req.body.labResults,
        requestPE: req.body.requestPE,
        status: req.body.status,
        comment: req.body.comment,
        medcert: req.body.medcert,
        schedule: req.body.schedule,
        reschedule: "",
        rescheduleStatus: "",
        rescheduledDate: [],
        rescheduleRemarks: "",
        isRescheduled: true,
        lastUpdated: nowLocalUTCPlus8,
      },
    };

    // Handle reschedule limit and schedule update
    if (req.body.schedule) {
      // Get the user object before updating to check reschedule limit
      const user = await User.findById(req.params.id);

      if (user.rescheduleLimit < 3) {
        // Ensure the schedule is a valid Date object
        const formattedSchedule = new Date(req.body.schedule);
        updateData.$set.schedule = formattedSchedule;

        // Increment rescheduleLimit if schedule is updated
        updateData.$set.rescheduleLimit = (user.rescheduleLimit || 0) + 1;
      } else {
        return res.status(400).json({ message: 'Reschedule limit reached.' });
      }
    }

    // Handle queueNumber and queueNumberDate
    updateData.$set.queueNumber = req.body.queueNumber ? Number(req.body.queueNumber) : 0;
    if (req.body.queueNumberDate) {
      const parsedDate = new Date(req.body.queueNumberDate);
      if (!isNaN(parsedDate)) {
        updateData.$set.queueNumberDate = parsedDate;
      }
    }

    // Mark as 'ABSENT' if schedule date is today and current time is past cutoff hour
    const currentHour = today.getHours();
    if (userScheduleString === todayString && currentHour >= cutoffHour && !req.body.isPresent) {
      updateData.$set.isPresent = 'ABSENT';
    }

    // Find and update the user in the database
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

    // Remove password from the response
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};



export const updateUserRescheduleDate2 = async (req, res) => {
  try {
    const { id } = req.params;
    const { schedule, reschedule, rescheduledDate, rescheduleStatus, rescheduleRemarks } = req.body;

    // Fetch the user, excluding specific fields
    const user = await User.findById(userId).select('-queueNumber -queueNumberDate');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update schedule and increment rescheduleLimit if a new schedule is provided
    

    // Update other fields
    user.reschedule = reschedule;
    user.rescheduledDate = rescheduledDate || user.rescheduledDate; // Keep existing dates if not provided
    user.rescheduleStatus = rescheduleStatus;
    user.rescheduleRemarks = rescheduleRemarks;

    // Save the updated user to the database
    await user.save();

    // Refetch the user to ensure the updated data is reflected
    const updatedUser = await User.findById(user._id).select('-queueNumber -queueNumberDate');

    // Send a success response with the updated user data
    res.status(200).json({ 
      success: true, 
      message: 'User updated successfully.', 
      user: {
        id: updatedUser._id,
        schedule: updatedUser.schedule,
        rescheduleLimit: updatedUser.rescheduleLimit,
        reschedule: updatedUser.reschedule,
        rescheduledDate: updatedUser.rescheduledDate,
        rescheduleStatus: updatedUser.rescheduleStatus,
        rescheduleRemarks: updatedUser.rescheduleRemarks,
      }
    });

  } catch (error) {
    // Handle any unexpected errors
    res.status(500).json({ success: false, message: error.message });
  }
};



// delete user

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can delete only your account!'));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('User has been deleted...');
  } catch (error) {
    next(error);
  }

}

export const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalEmployees = await User.countDocuments({ isAdmin: true });
    const totalStudents = await User.countDocuments({ $or: [{ isAdmin: false }, { isAdmin: { $exists: false } }] });
    const totalReschedules = await User.countDocuments({ reschedule: "YES" });
    const totalScheduled = await User.countDocuments({ annualPE: "InPerson" });
    const totalOnline = await User.countDocuments({ annualPE: "Online" });


    // Return statistics as a JSON response
    res.status(200).json({
      totalUsers,
      totalEmployees,
      totalStudents,
      totalReschedules,
      totalScheduled,
      totalOnline
    });

    console.log(totalUsers, totalEmployees, totalStudents, totalReschedules, totalScheduled, totalOnline);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'Only admins can see all users!'));
  }
  
  try {
    // Base query
    let query = { annualPE: 'Online' };

    // Apply filtering by degree program if provided
    if (req.query.degreeProgram) {
      query.degreeProgram = req.query.degreeProgram;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    // Apply filtering by document status if provided
    if (req.query.documentStatus) {
      if (req.query.documentStatus === 'complete') {
          // Users with all required documents submitted
          query.$and = [
              { peForm: { $exists: true, $ne: "" } }, // Field exists and is not equal to empty string
              { labResults: { $exists: true, $ne: "" } }, // Field exists and is not equal to empty string
              { requestPE: { $exists: true, $ne: "" } } // Field exists and is not equal to empty string
          ];
      } else if (req.query.documentStatus === 'incomplete') {
        // Users with at least one document submitted but not all
        query.$and = [
            {
                $or: [
                    { peForm: { $exists: true, $ne: "" } }, // At least one field is not empty
                    { labResults: { $exists: true, $ne: "" } },
                    { requestPE: { $exists: true, $ne: "" } }
                ]
            },
            {
                $or: [
                    { peForm: "" }, // At least one field is still empty
                    { labResults: "" },
                    { requestPE: "" }
                ]
            }
        ];
      } else if (req.query.documentStatus === 'no_submission') {
          // Users with no submissions at all (fields either do not exist or are empty)
          query.$or = [
              { peForm: { $exists: false } }, // Field does not exist
              { labResults: { $exists: false } }, // Field does not exist
              { requestPE: { $exists: false } }, // Field does not exist
              { peForm: "" }, // Field is empty
              { labResults: "" }, // Field is empty
              { requestPE: "" } // Field is empty
          ];
      }
    } else {
      // Direct checks if documentStatus is not provided
      const { peForm, labResults, requestPE } = req.query;
    
      if (peForm === 'check') {
          query.peForm = { $ne: "" }; // Check if peForm is not empty
      }
    
      if (labResults === 'check') {
          query.labResults = { $ne: "" }; // Check if labResults is not empty
      }
    
      if (requestPE === 'check') {
          query.requestPE = { $ne: "" }; // Check if requestPE is not empty
      }
    }
    
    // Add the console.log here to inspect the query before executing it
    console.log('Query:', JSON.stringify(query));
    
    // Now, execute your database query here
    // Example:
    // const users = await User.find(query);
    
    
  

    // Pagination and sorting parameters
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    // Fetch users with pagination, sorting, and filtering
    const users = await User.find(query)
      .sort({
        schedule: sortDirection,
        yearLevel: sortDirection,
        college: 1,
        degreeProgram: 1,
        lastName: 1
      })
      .skip(startIndex)
      .limit(limit);

    // Remove sensitive data (password)
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    // Count documents for various metrics
    const totalUsers = await User.countDocuments(query); // Count with filters
    const totalInPersonUsers = totalUsers; // Since totalUsers already reflects the filtered count
    
    const totalComplete = await User.countDocuments({
      ...query,
      $and: [
        { peForm: { $exists: true, $ne: "" } },
        { labResults: { $exists: true, $ne: "" } },
        { requestPE: { $exists: true, $ne: "" } }
      ]
    });

    const totalIncomplete = await User.countDocuments({
      ...query,
      $and: [
        {
          $or: [
            { peForm: { $exists: true, $ne: "" } },
            { labResults: { $exists: true, $ne: "" } },
            { requestPE: { $exists: true, $ne: "" } }
          ]
        },
        {
          $or: [
            { peForm: "" },
            { labResults: "" },
            { requestPE: "" }
          ]
        }
      ]
    });

    const totalNoSubmissions = await User.countDocuments({
      ...query,
      $or: [
        { peForm: { $exists: false } },
        { labResults: { $exists: false } },
        { requestPE: { $exists: false } },
        { peForm: "" },
        { labResults: "" },
        { requestPE: "" }
      ]
    });

    const totalApproved = await User.countDocuments({ status: 'approved', ...query });
    const totalDenied = await User.countDocuments({ status: 'denied', ...query });
    const totalPending = await User.countDocuments({ status: 'NO ACTION', ...query });

    // Count documents by college
    const totalCAS = await User.countDocuments({ college: 'CAS', ...query });
    const totalCFOS = await User.countDocuments({ college: 'CFOS', ...query });
    const totalSOTECH = await User.countDocuments({ college: 'SOTECH', ...query });

    // Count documents by status and college
    const totalCASValidated = await User.countDocuments({ college: 'CAS', status: 'approved', ...query });
    const totalCASChecked = await User.countDocuments({ college: 'CAS', status: 'NO ACTION', ...query });

    const totalCFOSValidated = await User.countDocuments({ college: 'CFOS', status: 'approved', ...query });
    const totalCFOSChecked = await User.countDocuments({ college: 'CFOS', status: 'NO ACTION', ...query });

    const totalSOTECHValidated = await User.countDocuments({ college: 'SOTECH', status: 'approved', ...query });
    const totalSOTECHChecked = await User.countDocuments({ college: 'SOTECH', status: 'NO ACTION', ...query });

    // Degree program counts
    const degreeCourses = [
      "COMMUNITY DEVELOPMENT",
      "History",
      "COMMUNICATION AND MEDIA STUDIES",
      "LITERATURE",
      "POLITICAL SCIENCE",
      "PSYCHOLOGY",
      "SOCIOLOGY",
      "APPLIED MATHEMATICS",
      "BIOLOGY",
      "CHEMISTRY",
      "COMPUTER SCIENCE",
      "ECONOMICS",
      "PUBLIC HEALTH",
      "STATISTICS",
      "FISHERIES",
      "CHEMICAL ENGINEERING",
      "FOOD TECHNOLOGY"
    ];

    const degreeCourseCounts = {};
    for (const course of degreeCourses) {
      const total = await User.countDocuments({ degreeProgram: course, ...query });
      const validated = await User.countDocuments({ degreeProgram: course, status: 'approved', ...query });
      const checked = await User.countDocuments({ degreeProgram: course, status: 'NO ACTION', ...query });
      degreeCourseCounts[course] = {
        total,
        validated,
        checked
      };
    }

    // Users created in the last month
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
      ...query
    });

    const totalEmployees = await User.countDocuments({ isAdmin: true });
    const totalStudents = await User.countDocuments({ $or: [{ isAdmin: false }, { isAdmin: { $exists: false } }] });
    const totalReschedules = await User.countDocuments({ reschedule: "YES" });

    // Send response
    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      totalEmployees,
      totalStudents,
      totalReschedules,
      totalApproved,
      totalDenied,
      totalPending,
      totalInPersonUsers,
      totalCAS,
      totalCFOS,
      totalSOTECH,
      totalComplete,
      totalIncomplete,
      totalNoSubmissions,
      totalCASValidated,
      totalCASChecked,
      totalCFOSValidated,
      totalCFOSChecked,
      totalSOTECHValidated,
      totalSOTECHChecked,
      degreeCourseCounts,
      lastMonthUsers
    });
  } catch (error) {
    next(error);
  }
};



export const getUsersWithCompleteDocs = async (req, res, next) => {

  
  try {
    // Base query
    const query = {
      annualPE: 'Online',
      peForm: { $exists: true, $ne: "" },
      labResults: { $exists: true, $ne: "" },
      requestPE: { $exists: true, $ne: "" },
    };

    if (req.query.degreeProgram) {
      query.degreeProgram = req.query.degreeProgram;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }


    // Pagination and sorting parameters
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    // Fetch users with pagination, sorting, and filtering
    const users = await User.find(query)
      .sort({
        yearLevel: sortDirection,
        college: 1,
        degreeProgram: 1,
        lastName: 1
      })
      .skip(startIndex)
      .limit(limit);

    // Remove sensitive data (password)
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    // Count documents for various metrics
    const totalUsers = await User.countDocuments(query); // Count with filters
    
    const totalApproved = await User.countDocuments({ status: 'approved', ...query });
    const totalDenied = await User.countDocuments({ status: 'denied', ...query });
    const totalPending = await User.countDocuments({ status: 'NO ACTION', ...query });

   
   
    // Send response
    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      totalApproved,
      totalDenied,
      totalPending,
      
      
    });
  } catch (error) {
    next(error);
  }
};

export const getUsersNoDocs = async (req, res, next) => {

  
  try {
    // Base query
    const query = {
      annualPE: 'Online',
      peForm: { $exists: false } , // Field does not exist
      labResults: { $exists: false } , // Field does not exist
      requestPE: { $exists: false } , // Field does not exist
      peForm: "" , // Field is empty
      labResults: "" , // Field is empty
      requestPE: ""  // Field is empty
    };

    if (req.query.degreeProgram) {
      query.degreeProgram = req.query.degreeProgram;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }


    // Pagination and sorting parameters
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    // Fetch users with pagination, sorting, and filtering
    const users = await User.find(query)
      .sort({
        yearLevel: sortDirection,
        college: 1,
        degreeProgram: 1,
        lastName: 1
      })
      .skip(startIndex)
      .limit(limit);

    // Remove sensitive data (password)
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    // Count documents for various metrics
    const totalUsers = await User.countDocuments(query); // Count with filters
    
    const totalApproved = await User.countDocuments({ status: 'approved', ...query });
    const totalDenied = await User.countDocuments({ status: 'denied', ...query });
    const totalPending = await User.countDocuments({ status: 'NO ACTION', ...query });

   
   
    // Send response
    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      totalApproved,
      totalDenied,
      totalPending,
      
      
    });
  } catch (error) {
    next(error);
  }
};

export const getUsersIncDocs = async (req, res, next) => {
  try {
    // Base query
    const query = {
      annualPE: 'Online',
      $and: [ // Corrected from '=' to ':'
        {
          $or: [
            { peForm: { $exists: true, $ne: "" } }, // At least one field is not empty
            { labResults: { $exists: true, $ne: "" } },
            { requestPE: { $exists: true, $ne: "" } }
          ]
        },
        {
          $or: [
            { peForm: "" }, // At least one field is still empty
            { labResults: "" },
            { requestPE: "" }
          ]
        }
      ]
    };

    // Additional filters based on query parameters
    if (req.query.degreeProgram) {
      query.degreeProgram = req.query.degreeProgram;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    // Pagination and sorting parameters
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    // Fetch users with pagination, sorting, and filtering
    const users = await User.find(query)
      .sort({
        yearLevel: sortDirection,
        college: 1,
        degreeProgram: 1,
        lastName: 1
      })
      .skip(startIndex)
      .limit(limit);

    // Remove sensitive data (password)
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    // Count documents for various metrics
    const totalUsers = await User.countDocuments(query); // Count with filters
    
    const totalApproved = await User.countDocuments({ status: 'approved', ...query });
    const totalDenied = await User.countDocuments({ status: 'denied', ...query });
    const totalPending = await User.countDocuments({ status: 'NO ACTION', ...query });

    // Send response
    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      totalApproved,
      totalDenied,
      totalPending,
    });
  } catch (error) {
    next(error);
  }
};










export const getusersub = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'Only admins can see all users!'));
  }
  
  try {
    let query = {};

    // Add filters for degree program and status
    if (req.query.degreeProgram) {
      query.degreeProgram = req.query.degreeProgram;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    const users = await User.find({
      ...query,
      $or: [
        { peForm: { $exists: true } },
        { labResults: { $exists: true } },
        { medcert: { $exists: true } }
      ]
    });

    // Respond with the filtered users
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};





export const getUsersByCourse = async (req, res, next) => {
  try {
    const courseName = req.params.courseName;
    const statusFilter = req.query.status; // Extract status filter from query parameters

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    let query = { degreeProgram: courseName, annualPE: 'Online' };
    if (statusFilter) {
      query.status = statusFilter; // Add status filter to the query
    }

    const users = await User.find(query)
      .sort({ _id: sortDirection }) 
      .skip(startIndex)
      .limit(limit);

    const totalUsers = await User.countDocuments(query); // Count total users matching the query

    res.status(200).json({ users, totalUsers });
  } catch (error) {
    next(error);
  }
};

export const getUsersByCourseInPerson = async (req, res, next) => {
  try {
    const courseName = req.params.courseName;
    const statusFilter = req.query.status; // Extract status filter from query parameters

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    let query = { degreeProgram: courseName, annualPE: 'InPerson' };
    if (statusFilter) {
      query.status = statusFilter; // Add status filter to the query
    }

    const users = await User.find(query)
      .sort({ _id: sortDirection }) 
      .skip(startIndex)
      .limit(limit);

    const totalUsers = await User.countDocuments(query); // Count total users matching the query

    res.status(200).json({ users, totalUsers });
  } catch (error) {
    next(error);
  }
};

export const getUsersByCollege = async (req, res, next) => {
  try {
    const collegeName = req.params.collegeName;
    const statusFilter = req.query.status; 
    const courseFilter = req.query.course; 

    // Base query
    let query = { college: collegeName, annualPE: 'Online' };

    // Apply filtering by degree program if provided
    if (statusFilter) {
      query.status = statusFilter;
    }

    if (courseFilter) {
      query.degreeProgram = courseFilter;
    }

    // Pagination and sorting parameters
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    // Fetch users with pagination, sorting, and filtering
    const users = await User.find(query)
      .sort({
        yearLevel: sortDirection,
        college: 1,
        degreeProgram: 1,
        lastName: 1
      })
      .skip(startIndex)
      .limit(limit);

    // Remove sensitive data (password)
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    // Count documents for various metrics
    const totalUsers = await User.countDocuments(query);
    const totalInPersonUsers = await User.countDocuments({ ...query, annualPE: 'InPerson' });

    // Send response
    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      totalInPersonUsers
    });
  } catch (error) {
    next(error);
  }
};
export const getUsersByCollegeInPerson = async (req, res, next) => {
  try {
    const collegeName = req.params.collegeName;
    const statusFilter = req.query.status;
    const courseFilter = req.query.course;
    const search = req.query.search; // Added for search functionality

    // Base query
    let query = { college: collegeName, annualPE: 'InPerson' };

    // Apply filtering by status and course if provided
    if (statusFilter) {
      query.status = statusFilter;
    }

    if (courseFilter) {
      query.degreeProgram = courseFilter;
    }

    if (search) {
      // Case-insensitive search by name
      query.$text = { $search: search };
    }

    // Pagination and sorting parameters
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    // Fetch users with pagination, sorting, and filtering
    const users = await User.find(query)
      .sort({
        yearLevel: sortDirection,
        college: 1,
        degreeProgram: 1,
        lastName: 1
      })
      .skip(startIndex)
      .limit(limit);

    // Remove sensitive data (password)
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    // Count documents for various metrics
    const totalUsers = await User.countDocuments(query);

    // Send response
    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers
    });
  } catch (error) {
    next(error);
  }
};

export const getUsersOverallPresent = async (req, res, next) => {
  try {
    const statusFilter = req.query.status;
    const courseFilter = req.query.course;
    const search = req.query.search; // For text search by name
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    // Base query to filter by in-person arrival
    let query = { isPresent: 'ARRIVED', annualPE: 'InPerson' };

    // Apply filters based on request query
    if (statusFilter) {
      query.status = statusFilter;
    }
    if (courseFilter) {
      query.degreeProgram = courseFilter;
    }
    if (search) {
      query.$text = { $search: search }; // Ensure text index is set up in MongoDB
    }

    // Query the database with sorting and pagination
    const users = await User.find(query)
      .sort({
        yearLevel: sortDirection,
        college: 1,
        degreeProgram: 1,
        lastName: 1,
      })
      .skip(startIndex)
      .limit(limit);

    // Map out passwords from the response
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    // Count the total number of documents that match the query
    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Failed to fetch users. Please try again later." });
    next(error);
  }
};

export const getUsersOverallAbsent = async (req, res, next) => {
  try {
    const statusFilter = req.query.status;
    const courseFilter = req.query.course;
    const search = req.query.search; // For text search by name
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    // Base query to filter by in-person arrival
    let query = { isPresent: 'ABSENT', annualPE: 'InPerson' };

    // Apply filters based on request query
    if (statusFilter) {
      query.status = statusFilter;
    }
    if (courseFilter) {
      query.degreeProgram = courseFilter;
    }
    if (search) {
      query.$text = { $search: search }; // Ensure text index is set up in MongoDB
    }

    // Query the database with sorting and pagination
    const users = await User.find(query)
      .sort({
        yearLevel: sortDirection,
        college: 1,
        degreeProgram: 1,
        lastName: 1,
      })
      .skip(startIndex)
      .limit(limit);

    // Map out passwords from the response
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    // Count the total number of documents that match the query
    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Failed to fetch users. Please try again later." });
    next(error);
  }
};

export const getUsersPresentYesterday = async (req, res, next) => {
  try {
    const statusFilter = req.query.status;
    const courseFilter = req.query.course;
    const search = req.query.search; // For text search by name
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    // Get yesterday's date in the correct format for comparison
    const yesterdayStart = moment().subtract(1, 'days').startOf('day').toDate();
    const yesterdayEnd = moment().subtract(1, 'days').endOf('day').toDate();

    // Base query to filter by in-person arrival and yesterday's schedule
    let query = {
      $or: [
        { isPresent: 'ARRIVED' },       // Present
        { isPresent: 'ABSENT' }         // Absent
      ],
      annualPE: 'InPerson',             // Specific to the InPerson annual PE
      schedule: { $gte: yesterdayStart, $lt: yesterdayEnd }, // Within the time range
    };
    

    // Apply filters based on request query
    if (statusFilter) {
      query.status = statusFilter;
    }
    if (courseFilter) {
      query.degreeProgram = courseFilter;
    }
    if (search) {
      query.$text = { $search: search }; // Ensure text index is set up in MongoDB
    }

    // Query the database with sorting and pagination
    const users = await User.find(query)
      .sort({
        yearLevel: sortDirection,
        college: 1,
        degreeProgram: 1,
        lastName: 1,
      })
      .skip(startIndex)
      .limit(limit);

    // Map out passwords from the response
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    // Count the total number of documents that match the query
    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Failed to fetch users. Please try again later." });
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.id) {
    return next(errorHandler(403, 'You are not allowed to update this users status!'));
  }
  try {
    const updateStatus = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: req.body.status,
          comment: req.body.comment,
        },
      },
      { new: true }
    );
    res.status(200).json(updateStatus);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    const { password, ...userData } = user._doc;
    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

export const getInperson = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'Only admins can see all users!'));
  }
  
  try {
    // Base query
    let query = { annualPE: 'InPerson' };

    // Apply filtering by degree program if provided
    if (req.query.degreeProgram) {
      query.degreeProgram = req.query.degreeProgram;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    // Pagination and sorting parameters
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = req.query.limit === 'all' ? 0 : parseInt(req.query.limit) || 9; // Set limit to 0 if 'all' is requested
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    // Fetch users with pagination, sorting, and filtering
    const users = await User.find(query)
      .sort({
        yearLevel: sortDirection,
        college: 1,
        degreeProgram: 1,
        lastName: 1
      })
      .skip(startIndex)
      .limit(limit); // No limit if limit is set to 0

    // Remove sensitive data (password)
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    // Count documents for various metrics
    const totalUsers = await User.countDocuments(query); // Count with filters
    const totalInPersonUsers = totalUsers; // Since totalUsers already reflects the filtered count

    const totalApproved = await User.countDocuments({ status: 'approved', ...query });
    const totalDenied = await User.countDocuments({ status: 'denied', ...query });
    const totalPending = await User.countDocuments({ status: 'NO ACTION', ...query });

    // Count documents by college
    const totalCAS = await User.countDocuments({ college: 'CAS', ...query });
    const totalCFOS = await User.countDocuments({ college: 'CFOS', ...query });
    const totalSOTECH = await User.countDocuments({ college: 'SOTECH', ...query });

    // Count documents by status and college
    const totalCASValidated = await User.countDocuments({ college: 'CAS', status: 'approved', ...query });
    const totalCASChecked = await User.countDocuments({ college: 'CAS', status: 'NO ACTION', ...query });

    const totalCFOSValidated = await User.countDocuments({ college: 'CFOS', status: 'approved', ...query });
    const totalCFOSChecked = await User.countDocuments({ college: 'CFOS', status: 'NO ACTION', ...query });

    const totalSOTECHValidated = await User.countDocuments({ college: 'SOTECH', status: 'approved', ...query });
    const totalSOTECHChecked = await User.countDocuments({ college: 'SOTECH', status: 'NO ACTION', ...query });

    // Degree program counts
    const degreeCourses = [
      "COMMUNITY DEVELOPMENT",
      "History",
      "COMMUNICATION AND MEDIA STUDIES",
      "LITERATURE",
      "POLITICAL SCIENCE",
      "PSYCHOLOGY",
      "SOCIOLOGY",
      "APPLIED MATHEMATICS",
      "BIOLOGY",
      "CHEMISTRY",
      "COMPUTER SCIENCE",
      "ECONOMICS",
      "PUBLIC HEALTH",
      "STATISTICS",
      "FISHERIES",
      "CHEMICAL ENGINEERING",
      "FOOD TECHNOLOGY"
    ];

    const degreeCourseCounts = {};
    for (const course of degreeCourses) {
      const total = await User.countDocuments({ degreeProgram: course, ...query });
      const validated = await User.countDocuments({ degreeProgram: course, status: 'approved', ...query });
      const checked = await User.countDocuments({ degreeProgram: course, status: 'NO ACTION', ...query });
      degreeCourseCounts[course] = {
        total,
        validated,
        checked
      };
    }

    // Users created in the last month
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
      ...query
    });

    // Send response
    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      totalInPersonUsers,
      totalCAS,
      totalApproved,
      totalDenied,
      totalPending,
      totalCFOS,
      totalSOTECH,
      totalCASValidated,
      totalCASChecked,
      totalCFOSValidated,
      totalCFOSChecked,
      totalSOTECHValidated,
      totalSOTECHChecked,
      degreeCourseCounts,
      lastMonthUsers
    });
  } catch (error) {
    next(error);
  }
};


export const getreschedUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'Only admins can see all users!'));
  }
  
  try {
    // Base query
    let query = { annualPE: 'InPerson', reschedule: 'YES' };

    // Apply filtering by degree program if provided
    if (req.query.degreeProgram) {
      query.degreeProgram = req.query.degreeProgram;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    // Pagination and sorting parameters
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    // Fetch users with pagination, sorting, and filtering
    const users = await User.find(query)
      .sort({
        schedule: sortDirection, // Ensure sorting by schedule if needed
        yearLevel: sortDirection,
        college: 1,
        degreeProgram: 1,
        lastName: 1
      })
      .skip(startIndex)
      .limit(limit);

    // Remove sensitive data (password)
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    // Count documents for various metrics
    const totalUsers = await User.countDocuments(query); // Count with filters
    const totalInPersonUsers = totalUsers; // Since totalUsers already reflects the filtered count

    // Count documents by college
    const totalCAS = await User.countDocuments({ college: 'CAS', ...query });
    const totalCFOS = await User.countDocuments({ college: 'CFOS', ...query });
    const totalSOTECH = await User.countDocuments({ college: 'SOTECH', ...query });

    // Count documents by status and college
    const totalCASValidated = await User.countDocuments({ college: 'CAS', status: 'approved', ...query });
    const totalCASChecked = await User.countDocuments({ college: 'CAS', status: 'NO ACTION', ...query });

    const totalCFOSValidated = await User.countDocuments({ college: 'CFOS', status: 'approved', ...query });
    const totalCFOSChecked = await User.countDocuments({ college: 'CFOS', status: 'NO ACTION', ...query });

    const totalSOTECHValidated = await User.countDocuments({ college: 'SOTECH', status: 'approved', ...query });
    const totalSOTECHChecked = await User.countDocuments({ college: 'SOTECH', status: 'NO ACTION', ...query });

    // Degree program counts
    const degreeCourses = [
      "COMMUNITY DEVELOPMENT",
      "History",
      "COMMUNICATION AND MEDIA STUDIES",
      "LITERATURE",
      "POLITICAL SCIENCE",
      "PSYCHOLOGY",
      "SOCIOLOGY",
      "APPLIED MATHEMATICS",
      "BIOLOGY",
      "CHEMISTRY",
      "COMPUTER SCIENCE",
      "ECONOMICS",
      "PUBLIC HEALTH",
      "STATISTICS",
      "FISHERIES",
      "CHEMICAL ENGINEERING",
      "FOOD TECHNOLOGY"
    ];

    const degreeCourseCounts = {};
    for (const course of degreeCourses) {
      const total = await User.countDocuments({ degreeProgram: course, ...query });
      const validated = await User.countDocuments({ degreeProgram: course, status: 'approved', ...query });
      const checked = await User.countDocuments({ degreeProgram: course, status: 'NO ACTION', ...query });
      degreeCourseCounts[course] = {
        total,
        validated,
        checked
      };
    }

    // Users created in the last month
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
      ...query
    });

    // Send response
    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      totalInPersonUsers,
      totalCAS,
      totalCFOS,
      totalSOTECH,
      totalCASValidated,
      totalCASChecked,
      totalCFOSValidated,
      totalCFOSChecked,
      totalSOTECHValidated,
      totalSOTECHChecked,
      degreeCourseCounts,
      lastMonthUsers
    });
  } catch (error) {
    next(error);
  }
};


export const assignSchedule = async (req, res, next) => {
  try {
    // Check if the user is an admin and has permission to assign dates
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'Only admins are allowed to generate schedules.'));
    }

    const { startDate, endDate } = req.body;

    // Calculate the number of days between startDate and endDate
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const days = Math.round(Math.abs((new Date(startDate) - new Date(endDate)) / oneDay));

    let currentDate = new Date(startDate);
    const assignedDates = [];

    // Loop through each day in the time span
    for (let i = 0; i <= days; i++) {
      // Skip weekends (Saturday and Sunday)
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        assignedDates.push(currentDate.toISOString()); // Add the current date to the array of assigned dates
      }
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    // Fetch all users sorted according to specified criteria
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    const allUsers = await User.find({ annualPE: 'InPerson' })
      .sort({
        yearLevel: sortDirection,
        college: 1, // Ascending alphabetical order
        degreeProgram: 1, // Ascending alphabetical order
        lastName: 1 // Ascending alphabetical order
      })
      .select('_id');

    // Assign dates to users, 20 users per day
    let counter = 0;
    let assignedDatesIndex = 0; // Keep track of the index in assignedDates array
    for (const user of allUsers) {
      const assignedDate = assignedDates[assignedDatesIndex]; // Get the current date
      await User.findByIdAndUpdate(user._id, { schedule: new Date(assignedDate) });
      counter++;

      // Move to the next day if 20 users have been assigned for the current day
      if (counter % 20 === 0 && assignedDatesIndex < assignedDates.length - 1) {
        assignedDatesIndex++; // Move to the next day
      }

      // Reset the index to 0 when the last date in the array is reached
      if (assignedDatesIndex === assignedDates.length - 1) {
        assignedDatesIndex = 0;
      }
    }


    res.status(200).json({ message: 'Assigned dates to all users successfully' });
  } catch (error) {
    next(error);
  }
};

export const rescheduleUser = async (req, res, next) => {
  try {
    // Check if the user is an admin and has permission to reschedule
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'Only admins are allowed to reschedule.'));
    }

    const { userId } = req.params;
    const { startDate, endDate } = req.body;
    console.log("Received start Date:", startDate);
    console.log("Received end Date:", endDate);

    // Fetch the user's current schedule, excluding queueNumber field
    const user = await User.findById(userId).select('-queueNumber -queueNumberDate'); // Exclude both queueNumber and queueNumberDate

    if (!user) {
      return next(errorHandler(404, 'User not found.'));
    }

    // Calculate available dates
    let currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to midnight

    const rescheduledDates = [];
    const remainingSlotsArray = [];

    // Find the 3 earliest available dates within the range
    while (rescheduledDates.length < 3 && currentDate <= endDateObj) {
      // Skip past dates
      if (currentDate < today) {
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        continue; // Skip to the next iteration
      }

      // Skip weekends (Saturday and Sunday)
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        // Skip the current user's already scheduled date
        if (user.schedule && currentDate.toString() === new Date(user.schedule).toString()) {
          currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
          continue; // Skip to the next iteration
        }

        // Count the number of users scheduled on this date
        const userCount = await User.countDocuments({ schedule: currentDate });

        // Log the number of users scheduled on this date
        console.log(`Date: ${currentDate.toDateString()}, Users Scheduled: ${userCount}`);

        // Calculate remaining slots
        const remainingSlots = 20 - userCount;

        if (remainingSlots > 0) {
          // Add the date (without remaining slots) to the available dates
          rescheduledDates.push(currentDate.toString());

          // Store remaining slots separately
          remainingSlotsArray.push({ date: currentDate.toString(), remainingSlots });
        }
      }

      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    if (rescheduledDates.length === 0) {
      return res.status(400).json({ message: 'No available dates within the given range.' });
    }

    // Save the available dates and update the user (queueNumber is not touched)
    user.queueNumber = undefined; // Prevent queueNumber modification
    await user.save(); // Save the user document with changes

    // Send both the rescheduledDates and remainingSlotsArray separately
    res.status(200).json({ 
      message: 'Rescheduled dates generated successfully', 
      rescheduledDates,
      remainingSlots: remainingSlotsArray
    });
  } catch (error) {
    next(error);
  }
};





export const updateUserWithReschedule = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { rescheduleStatus, rescheduleRemarks, rescheduledDate } = req.body;

    // Fetch the user by ID, excluding queueNumber and queueNumberDate fields
    const user = await User.findById(userId).select('-queueNumber -queueNumberDate');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update user reschedule details if provided
    if (rescheduleStatus) user.rescheduleStatus = rescheduleStatus;
    if (rescheduleRemarks) user.rescheduleRemarks = rescheduleRemarks;
    if (rescheduledDate) user.rescheduledDate = rescheduledDate;

   
    // Save the updated user data
    await user.save();
    res.status(200).json({ message: 'User updated successfully' });

  } catch (error) {
    next(error);
  }
};








export const deleteSchedule = async (req, res, next) => {
  try {
    // Delete all schedules and statuses by setting the `schedule` and `status` fields to null for all users
    await User.updateMany({}, { $set: { 
      schedule: "", 
      status: "NO ACTION", 
      reschedule: "", 
      comment: "",  
      rescheduleStatus: "",
      rescheduleRemarks: "",
      rescheduledDate: [], 
      rescheduleLimit: 0,
      isRescheduled: false,
      isPresent: "PENDING",
      lastLoggedIn: null, // Set lastLoggedIn to null
      queueNumberDate: null,
      queueNumber: null,
      notifications: []

    } });

    res.status(200).json({ message: 'Schedules and statuses cleared successfully' });
  } catch (error) {
    console.error('Error clearing schedules and statuses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const viewUsersScheduled = async (req, res, next) => {
  try {
    // Parse the requested date to a JavaScript Date object
    const requestedDate = new Date(req.params.date);
    
    // Calculate the start and end of the requested date
    const startOfDay = new Date(requestedDate);
    startOfDay.setHours(0, 0, 0, 0); // Set time to start of the day
    const endOfDay = new Date(requestedDate);
    endOfDay.setHours(23, 59, 59, 999); // Set time to end of the day

    const usersScheduledForDate = await User.find({
      schedule: {
        $gte: startOfDay, // Greater than or equal to start of the day
        $lte: endOfDay    // Less than or equal to end of the day
      }
    });

    res.status(200).json(usersScheduledForDate);
  } catch (error) {
    console.error('Error fetching users scheduled for the date:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};












const getAvailableRescheduleDates = async (req, res, next) => {
  
};



export const scheduledToday = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours to 00:00:00

    const usersScheduledForToday = await User.find({
      schedule: {
        $gte: today, // Greater than or equal to today's date
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Less than tomorrow's date
      }
    });


    res.status(200).json(usersScheduledForToday);
  } catch (error) {
    console.error('Error fetching users scheduled for today:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const viewUsersScheduledToday = async (req, res, next) => {
  try {
    // Get the current date
    const today = new Date();
    
    // Calculate the start and end of today's date
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0); // Start of the day
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999); // End of the day

    console.log('Start of the day:', startOfDay);
    console.log('End of the day:', endOfDay);

    // Fetch users with a non-empty schedule and sort them alphabetically by firstName (or lastName)
    const users = await User.find({ schedule: { $ne: [] } }).sort({ lastName: 1 }); // Sort alphabetically by 'firstName'
    
    // Filter users scheduled for today
    const usersScheduledForToday = users.filter(user => 
      user.schedule.some(scheduleDateStr => {
        const scheduleDate = new Date(scheduleDateStr); // Convert string to Date
        return scheduleDate >= startOfDay && scheduleDate <= endOfDay;
      })
    );

    res.status(200).json(usersScheduledForToday);
  } catch (error) {
    console.error('Error fetching users scheduled for today:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




