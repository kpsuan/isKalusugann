import User from '../models/user.model.js';
import mongoose from "mongoose";
import Emergency from '../models/emergencyDate.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import DateSlot from '../models/dateSlot.js';

import fs from 'fs';
import path from 'path';

import moment from 'moment';
import DocumentRequest from '../models/documentRequest.model.js';
import Settings from '../models/settings.model.js';


export const test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return next(errorHandler(401, 'You can update only your account!'));
  }

  try {
    const today = new Date();
    const todayString = today.toDateString();
    const cutoffHour = 17; // 5 PM cutoff
    const nowUTC = new Date();
    const nowLocalUTCPlus8 = new Date(nowUTC.getTime() + 8 * 60 * 60 * 1000); // Adjust for UTC+8

    let userScheduleString;
    if (Array.isArray(req.body.schedule) && req.body.schedule.length > 0) {
      const userSchedule = new Date(req.body.schedule[0]);
      userScheduleString = userSchedule.toDateString();
    }

    // Create notifications array
    const notifications = [];

    // Reschedule status notification
    if (req.body.rescheduleStatus) {
      notifications.push({
        message: req.body.rescheduleStatus === 'denied' 
          ? 'Your reschedule was denied.' 
          : (req.body.rescheduleStatus === 'approved' 
            ? `Your reschedule request was approved. You may view your available dates for rescheduling.` 
            : 'Your reschedule request is pending.'),
        type: req.body.rescheduleStatus === 'denied' ? 'warning' 
             : req.body.rescheduleStatus === 'approved' ? 'success' 
             : 'info',
        isRead: false,
        timestamp: new Date(),
        link: '/status',
      });
    }

    // Status-based notifications
    if (req.body.status === 'approved') {
      notifications.push({
        message: 'Your documents have been verified. See attached medcert below.',
        type: 'success',
        link: '/status',
        timestamp: new Date()
      });
    } else if (req.body.status === 'denied') {
      notifications.push({
        message: 'Your documents were denied. Please submit again.',
        type: 'error',
        link: '/status',
        timestamp: new Date()
      });
    }

    // Annual PE notifications
    if (req.body.annualPE === 'Online') {
      notifications.push({
        message: 'You may now start submitting the forms needed for Annual PE.',
        type: 'info',
        link: '/status',
        timestamp: new Date()
      });
    } else if (req.body.annualPE === 'InPerson' && req.body.schedule && req.body.schedule.length > 0) {
      notifications.push({
        message: 'You can now view your schedule in the Schedule Tab below.',
        type: 'info',
        link: '/status',
        timestamp: new Date()
      });
    }

    const updateData = {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password ? bcryptjs.hashSync(req.body.password, 10) : undefined,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        degreeLevel: req.body.degreeLevel,
        yearLevel: req.body.yearLevel,
        college: req.body.college,
        degreeProgram: req.body.degreeProgram,
        isGraduating: req.body.isGraduating,
        profilePicture: req.body.profilePicture,
        annualPE: req.body.annualPE,
        peForm: req.body.peForm,
        labResults: req.body.labResults,
        requestPE: req.body.requestPE,
        medcertUser: req.body.medcertUser,
        status: req.body.status,
        dentistStatus: req.body.dentistStatus,
        doctorStatus: req.body.doctorStatus,
        approvedByDentist: req.body.approvedByDentist,
        approvedByDoctor: req.body.approvedByDoctor,
        approvedByDentistLicense: req.body.approvedByDentistLicense,
        approvedByDoctorLicense: req.body.approvedByDoctorLicense,
        licenseNumber: req.body.licenseNumber,
        comment: req.body.comment,
        medcert: req.body.medcert,
        schedule: req.body.schedule,
        reschedule: req.body.reschedule,
        rescheduleStatus: req.body.rescheduleStatus,
        rescheduledDate: req.body.rescheduledDate,
        rescheduleRemarks: req.body.rescheduleRemarks,
        isRescheduled: req.body.isRescheduled,
        lastUpdated: new Date(),
        queueNumber: req.body.queueNumber ? Number(req.body.queueNumber) : 0,
        queueNumberDate: req.body.queueNumberDate ? new Date(req.body.queueNumberDate) : undefined,
        isPresent: userScheduleString === todayString && today.getHours() >= cutoffHour && !req.body.isPresent ? 'ABSENT' : undefined, 
      },
      ...(notifications.length > 0 && { $push: { notifications: { $each: notifications } } }),
    };

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });


    // Remove password from response
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};


export const sendAdminNotification = async (req, res) => {
  try {
    const { userId, firstName, lastName } = req.body;

    if (!userId || !firstName || !lastName) {
      return res.status(400).json({ message: 'Invalid data provided.' });
    }

    // Create a notification object adhering to the schema
    const notification = {
      message: `New annual PE submission: ${firstName} ${lastName}`,
      type: 'info',
      link: `/user-status/${userId}`, // Optional link to user status
      timestamp: new Date(),
      isRead: false, // Default value (can omit since the schema sets it)
    };

    // Update all admin users to include the new notification
    const updateResult = await User.updateMany(
      { isAdmin: true }, // Target all admin users
      { $push: { notifications: notification } } // Push the new notification
    );

    if (updateResult.modifiedCount > 0) {
      res.status(200).json({ message: 'Notification sent to admins successfully.' });
    } else {
      res.status(404).json({ message: 'No admin users found to notify.' });
    }
  } catch (error) {
    console.error('Error sending admin notification:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const sendAdminNotification2 = async (req, res) => {
  try {
    const { userId, firstName, lastName } = req.body;

    if (!userId || !firstName || !lastName) {
      return res.status(400).json({ message: 'Invalid data provided.' });
    }

    // Create a notification object adhering to the schema
    const notification = {
      message: `Annual PE Reschedule Request: ${firstName} ${lastName}`,
      type: 'info',
      link: `/resched-status/${userId}`, // Optional link to user status
      timestamp: new Date(),
      isRead: false, // Default value (can omit since the schema sets it)
    };

    // Update all admin users to include the new notification
    const updateResult = await User.updateMany(
      { isAdmin: true }, // Target all admin users
      { $push: { notifications: notification } } // Push the new notification
    );

    if (updateResult.modifiedCount > 0) {
      res.status(200).json({ message: 'Notification sent to admins successfully.' });
    } else {
      res.status(404).json({ message: 'No admin users found to notify.' });
    }
  } catch (error) {
    console.error('Error sending admin notification:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



export const updateNotifications = async (req, res) => {
  try {
    const { userId } = req.params; 

    const user = await User.findById(userId).select('-queueNumber -queueNumberDate').select('notifications'); // Fetch only notifications

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    
    // Sort notifications by timestamp (newest first)
    const sortedNotifications = user.notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.status(200).json({ notifications: sortedNotifications });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const clearNotifications = async (req, res) => {
  const { id } = req.params; 
  console.log("Clearing notifications for user:", id);

  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const result = await User.findByIdAndUpdate(
      id,
      { $unset: { notifications: "" } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      id,
      { $set: { notifications: [] } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("Notifications cleared successfully");
    res.status(200).json({ message: 'All notifications cleared successfully' });
  } catch (error) {
    console.error('Error clearing notifications:', error.message);
    res.status(500).json({ message: 'Server error. Failed to clear notifications.' });
  }
};



export const markNotificationAsRead = async (req, res) => {
  try {
    const { userId, notificationId } = req.params; // Access userId and notificationId from params

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the notification by ID
    const notification = user.notifications.id(notificationId); // Use Mongoose's `id()` method to find the notification

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Mark the notification as read
    notification.isRead = true;

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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
        dentistStatus: req.body.dentistStatus,
        doctorStatus: req.body.doctorStatus,
        comment: req.body.comment,
        medcert: req.body.medcert,
        schedule: req.body.schedule,
        reschedule: "",
        rescheduleStatus: "",
        rescheduledDate: [],
        rescheduleRemarks: "",
        isRescheduled: true,
        isPresent: req.body.isPresent,
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

        // Release the previously reserved slot (if applicable) before updating
        if (user.schedule) {
          await releaseSlot(user.id); // Call releaseSlot to release the previous slot
        }

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
  if (!req.user.isAdmin && req.user.id !== req.params.id) {
    return next(errorHandler(403, 'You are not allowed to delete this account!'));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('User has been deleted...');
  } catch (error) {
    next(error);
  }
}

export const deleteGraduatingUsers = async (req, res, next) => {
  try {
    const result = await User.deleteMany({ isGraduating: true });
    res.status(200).json({ message: "All graduating users have been deleted.", deletedCount: result.deletedCount });
  } catch (error) {
    next(error);
  }
};



export const getMonthlyStats = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const monthlyStats = [];

    // Fetch all users with schedules once
    const users = await User.find({
      schedule: { $exists: true, $ne: [] }
    });

    for (let month = 0; month < 12; month++) {
      const startOfMonth = new Date(currentYear, month, 1);
      const endOfMonth = new Date(currentYear, month + 1, 0);
      
      let validScheduleCount = 0;
      const processedDates = new Map(); // Track counts per day

      users.forEach(user => {
        user.schedule.forEach(scheduleStr => {
          const scheduleDate = new Date(scheduleStr);
          
          if (scheduleDate >= startOfMonth && scheduleDate <= endOfMonth) {
            const dateKey = scheduleDate.toISOString().split('T')[0];
            const dayOfWeek = scheduleDate.getDay();
            
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
              const currentCount = processedDates.get(dateKey) || 0;
              if (currentCount < 20) {
                processedDates.set(dateKey, currentCount + 1);
                validScheduleCount++;
              }
            }
          }
        });
      });

      monthlyStats.push({
        month: startOfMonth.toLocaleString('default', { month: 'short' }),
        scheduled: validScheduleCount
      });
    }

    res.status(200).json(monthlyStats);
  } catch (error) {
    console.error('Error fetching monthly statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getStats = async (req, res, next) => {
  try {

    let query = { annualPE: 'Online' };
    let query2 = { annualPE: 'InPerson' };

    const totalUsers = await User.countDocuments({});
    const totalEmployees = await User.countDocuments({ isAdmin: true });
    const totalStudents = await User.countDocuments({ $or: [{ isAdmin: false }, { isAdmin: { $exists: false } }] });
    const totalReschedules = await User.countDocuments({ reschedule: "YES" });
    const totalScheduled = await User.countDocuments({ annualPE: "InPerson" });
    const totalOnline = await User.countDocuments({ annualPE: "Online" });

    const totalApproved = await User.countDocuments({ status: 'approved'});
    const totalDenied = await User.countDocuments({ status: 'denied'});
    const totalPending = await User.countDocuments({ status: 'NO ACTION'});

    const totalApprovedDoctor = await User.countDocuments({ doctorStatus: 'approved', ...query });
    const totalApprovedDentist = await User.countDocuments({ dentistStatus: 'approved', ...query });
    const totalPendingApproval = await User.countDocuments({doctorStatus: 'approved', dentistStatus: 'approved', 
      status: { $ne: "approved" }, // Exclude users with 'approved' status
      ...query,});

    // Count documents by college
    const totalCAS = await User.countDocuments({ college: 'CAS', ...query });
    const totalCFOS = await User.countDocuments({ college: 'CFOS', ...query });
    const totalSOTECH = await User.countDocuments({ college: 'SOTECH', ...query });

    const totalCASScheduled = await User.countDocuments({ college: 'CAS', ...query2 });
    const totalCFOSScheduled = await User.countDocuments({ college: 'CFOS', ...query2 });
    const totalSOTECHScheduled = await User.countDocuments({ college: 'SOTECH', ...query2 });

    const totalApprovedDocs = await DocumentRequest.countDocuments({ status: 'approved'});
    const totalDeniedDocs = await DocumentRequest.countDocuments({ status: 'denied'});
    const totalPendingDocs = await DocumentRequest.countDocuments({ status: ''});

    const totalDocumentRequests = await DocumentRequest.countDocuments({});
    const completionRate = (totalApprovedDocs / totalDocumentRequests) * 100;

    // Return statistics as a JSON response
    res.status(200).json({
      totalUsers,
      totalEmployees,
      totalStudents,
      totalReschedules,
      totalScheduled,
      totalOnline,
      totalApproved,
      totalDenied,
      totalPending,
      totalPendingApproval,
      totalApprovedDentist,
      totalApprovedDoctor,
      totalCAS,
      totalCFOS,
      totalSOTECH,
      totalCASScheduled,
      totalCFOSScheduled,
      totalSOTECHScheduled,
      totalApprovedDocs,
      totalDeniedDocs,
      totalPendingDocs,
      completionRate,
      totalDocumentRequests,
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

    if (req.query.searchQuery) {
      const searchQuery = req.query.searchQuery.trim();
      query.$or = [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { middleName: { $regex: searchQuery, $options: 'i' } },
        { college: { $regex: searchQuery, $options: 'i' } },
        { degreeProgram: { $regex: searchQuery, $options: 'i' } },
        { yearLevel: { $regex: searchQuery, $options: 'i' } },
        { status: { $regex: searchQuery, $options: 'i' } }
      ];
    }

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
              { requestPE: { $exists: true, $ne: "" } }, // Field exists and is not equal to empty string
              { medcertUser: { $exists: true, $ne: "" } }
          ];
      } else if (req.query.documentStatus === 'incomplete') {
        // Users with at least one document submitted but not all
        query.$and = [
            {
                $or: [
                    { peForm: { $exists: true, $ne: "" } }, // At least one field is not empty
                    { labResults: { $exists: true, $ne: "" } },
                    { requestPE: { $exists: true, $ne: "" } },
                    { medcertUser: { $exists: true, $ne: "" } }
                ]
            },
            {
                $or: [
                    { peForm: "" }, // At least one field is still empty
                    { labResults: "" },
                    { requestPE: "" },
                    { medcertUser: "" }
                ]
            }
        ];
      } else if (req.query.documentStatus === 'no_submission') {
          // Users with no submissions at all (fields either do not exist or are empty)
          query.$or = [
              { peForm: { $exists: false } }, // Field does not exist
              { labResults: { $exists: false } }, // Field does not exist
              { requestPE: { $exists: false } }, // Field does not exist
              { medcertUser: { $exists: false } }, // Field does not exist

              { peForm: "" }, // Field is empty
              { labResults: "" }, // Field is empty
              { requestPE: "" }, // Field is empty
              { medcertUser: "" }
              
          ];
      }
    } else {
      // Direct checks if documentStatus is not provided
      const { peForm, labResults, requestPE, medcertUser} = req.query;
    
      if (peForm === 'check') {
          query.peForm = { $ne: "" }; // Check if peForm is not empty
      }
    
      if (labResults === 'check') {
          query.labResults = { $ne: "" }; // Check if labResults is not empty
      }
    
      if (requestPE === 'check') {
          query.requestPE = { $ne: "" }; // Check if requestPE is not empty
      }
      if (medcertUser === 'check') {
        query.medcertUser = { $ne: "" }; // Check if medcertUser is not empty
    }
    }
    
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

    const totalUsers = await User.countDocuments(query); // Count with filters
    const totalInPersonUsers = totalUsers; // Since totalUsers already reflects the filtered count
    
    const totalComplete = await User.countDocuments({
      ...query,
      $and: [
        { peForm: { $exists: true, $ne: "" } },
        { labResults: { $exists: true, $ne: "" } },
        { requestPE: { $exists: true, $ne: "" } },
        { medcertUser: { $exists: true, $ne: "" } }

      ]
    });

    const totalIncomplete = await User.countDocuments({
      ...query,
      $and: [
        {
          $or: [
            { peForm: { $exists: true, $ne: "" } },
            { labResults: { $exists: true, $ne: "" } },
            { requestPE: { $exists: true, $ne: "" } },
            { medcertUser: { $exists: true, $ne: "" } }
          ]
        },
        {
          $or: [
            { peForm: "" },
            { labResults: "" },
            { requestPE: "" },
            { medcertUser: "" },
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
        { medcertUser: { $exists: false } },

        { peForm: "" },
        { labResults: "" },
        { requestPE: "" },
        { medcertUser: "" }
      ]
    });

    const totalApproved = await User.countDocuments({ status: 'approved', ...query });
    const totalDenied = await User.countDocuments({ status: 'denied', ...query });
    const totalPending = await User.countDocuments({ status: 'NO ACTION', ...query });

    const totalApprovedDoctor = await User.countDocuments({ doctorStatus: 'approved', ...query });
    const totalApprovedDentist = await User.countDocuments({ dentistStatus: 'approved', ...query });
    const totalPendingApproval = await User.countDocuments({doctorStatus: 'approved', dentistStatus: 'approved', 
      status: { $ne: "approved" }, // Exclude users with 'approved' status
      ...query,});

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
      totalApprovedDoctor,
      totalApprovedDentist,
      totalPendingApproval,
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

export const getAdmin = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'Only admins can see all users!'));
  }
  
  try {
    // Base query
    let query = { isAdmin: 'true' };

    if (req.query.searchQuery) {
      const searchQuery = req.query.searchQuery.trim();
      query.$or = [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { middleName: { $regex: searchQuery, $options: 'i' } },
      ];
    }
    
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;

    // Fetch users with pagination, sorting, and filtering
    const users = await User.find(query)
      .sort({
        lastName: 1
      })
      .skip(startIndex)
      .limit(limit);

    // Remove sensitive data (password)
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments(query); // Count with filters
   

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
     
      lastMonthUsers
    });
  } catch (error) {
    next(error);
  }
};

export const getUsersApprovedByDoctor = async (req, res, next) => {

  
  try {
    // Base query
    const query = {
      annualPE: 'Online',
      doctorStatus: 'approved',
    };

    if (req.query.searchQuery) {
      const searchQuery = req.query.searchQuery.trim();
      query.$or = [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { middleName: { $regex: searchQuery, $options: 'i' } },
      ];
    }

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

export const getUsersApprovedByDentist = async (req, res, next) => {

  
  try {
    // Base query
    const query = {
      annualPE: 'Online',
      dentistStatus: 'approved',
    };

    if (req.query.searchQuery) {
      const searchQuery = req.query.searchQuery.trim();
      query.$or = [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { middleName: { $regex: searchQuery, $options: 'i' } },
      ];
    }

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

export const getUsersForOverallApproval = async (req, res, next) => {
  try {
    // Ensure both doctorStatus and dentistStatus are approved
    const query = {
      annualPE: "Online",
      doctorStatus: "approved",
      dentistStatus: "approved",
      status: { $ne: "approved" }, 
    };

    // Apply search filter if provided
    if (req.query.searchQuery) {
      const searchQuery = req.query.searchQuery.trim();
      query.$or = [
        { firstName: new RegExp(searchQuery, "i") },
        { lastName: new RegExp(searchQuery, "i") },
        { middleName: new RegExp(searchQuery, "i") },
      ];
    }

    // Apply additional filters (degreeProgram and status)
    if (req.query.degreeProgram) query.degreeProgram = req.query.degreeProgram;
    if (req.query.status) query.status = req.query.status;

    // Pagination & sorting parameters
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    // Fetch users based on filters, sorting, and pagination
    const users = await User.find(query)
      .sort({
        yearLevel: sortDirection,
        college: 1,
        degreeProgram: 1,
        lastName: 1,
      })
      .skip(startIndex)
      .limit(limit)
      .select("-password"); // Exclude password field

    // Count documents for total users and statuses
    const totalUsers = await User.countDocuments(query); // Count based on filters
    const totalApproved = await User.countDocuments({ status: "approved", ...query });
    const totalDenied = await User.countDocuments({ status: "denied", ...query });
    const totalPending = await User.countDocuments({ status: "NO ACTION", ...query });

    // Send response
    res.status(200).json({
      users,
      totalUsers,
      totalApproved,
      totalDenied,
      totalPending,
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
      medcertUser: { $exists: true, $ne: "" },

    };

    if (req.query.searchQuery) {
      const searchQuery = req.query.searchQuery.trim();
      query.$or = [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { middleName: { $regex: searchQuery, $options: 'i' } },
      ];
    }

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
      medcertUser: { $exists: false } , // Field does not exist

      peForm: "" , // Field is empty
      labResults: "" , // Field is empty
      requestPE: "",  // Field is empty
      medcertUser: ""  // Field is empty

    };


    if (req.query.searchQuery) {
      const searchQuery = req.query.searchQuery.trim();
      query.$or = [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { middleName: { $regex: searchQuery, $options: 'i' } },
        { college: { $regex: searchQuery, $options: 'i' } },
        { degreeProgram: { $regex: searchQuery, $options: 'i' } },
        { yearLevel: { $regex: searchQuery, $options: 'i' } },
        { status: { $regex: searchQuery, $options: 'i' } }
      ];
    }

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

    if (req.query.searchQuery) {
      const searchQuery = req.query.searchQuery.trim();
      query.$or = [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { middleName: { $regex: searchQuery, $options: 'i' } },
        { college: { $regex: searchQuery, $options: 'i' } },
        { degreeProgram: { $regex: searchQuery, $options: 'i' } },
        { yearLevel: { $regex: searchQuery, $options: 'i' } },
        { status: { $regex: searchQuery, $options: 'i' } }
      ];
    }

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
            { requestPE: { $exists: true, $ne: "" } },
            { medcertUser: { $exists: true, $ne: "" } }

          ]
        },
        {
          $or: [
            { peForm: "" }, // At least one field is still empty
            { labResults: "" },
            { requestPE: "" },
            { medcertUser: "" }

          ]
        }
      ]
    };

    if (req.query.searchQuery) {
      const searchQuery = req.query.searchQuery.trim();
      query.$or = [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { middleName: { $regex: searchQuery, $options: 'i' } },
        { college: { $regex: searchQuery, $options: 'i' } },
        { degreeProgram: { $regex: searchQuery, $options: 'i' } },
        { yearLevel: { $regex: searchQuery, $options: 'i' } },
        { status: { $regex: searchQuery, $options: 'i' } }
      ];
    }

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
        { medcert: { $exists: true } },
        { medcertUser: { $exists: true } }

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
    const statusFilter = req.query.status;
    const searchQuery = req.query.search;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortBy = req.query.sortBy || "lastName"; // Default to sorting by lastName
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    let query = { degreeProgram: courseName, annualPE: "Online" };

    // Add status filter if provided
    if (statusFilter) {
      query.status = statusFilter;
    }

    // Add search query if provided
    if (searchQuery) {
      query.$or = [
        { firstName: { $regex: searchQuery, $options: "i" } },
        { lastName: { $regex: searchQuery, $options: "i" } },
        { middleName: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const sortCriteria = {};
    sortCriteria[sortBy] = sortDirection;

    const users = await User.find(query)
    .sort({
      yearLevel: sortDirection,
      lastName: 1
    })
      .skip(startIndex)
      .limit(limit);

    const totalUsers = await User.countDocuments(query)
    const totalApproved = await User.countDocuments({ status: 'approved', ...query });
    const totalDenied = await User.countDocuments({ status: 'denied', ...query });
    const totalPending = await User.countDocuments({ status: 'NO ACTION', ...query });

    res.status(200).json({ 
      users, 
      totalUsers, 
      totalApproved,
      totalDenied,
      totalPending });
  } catch (error) {
    next(error);
  }
};

export const getUsersByCourseInPerson = async (req, res, next) => {
  try {
    const courseName = req.params.courseName;
    const statusFilter = req.query.status; // Extract status filter from query parameters
    const searchQuery = req.query.search;

    // Base query
    let query = { degreeProgram: courseName, annualPE: 'InPerson' };

    if (req.query.searchQuery) {
      const searchQuery = req.query.searchQuery.trim();
      query.$or = [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { middleName: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    // Apply filtering by status and course if provided
    if (statusFilter) {
      query.status = statusFilter;
    }

    if (req.query.degreeProgram) {
      query.degreeProgram = req.query.degreeProgram;
    }


    // Pagination and sorting parameters
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    // Fetch users with pagination, sorting, and filtering
    const users = await User.find(query)
      .sort({
        yearLevel: sortDirection,
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
    const totalApproved = await User.countDocuments({ status: 'approved', ...query });
    const totalDenied = await User.countDocuments({ status: 'denied', ...query });
    const totalPending = await User.countDocuments({ status: 'NO ACTION', ...query });


    // Send response
    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      totalApproved,
      totalDenied, 
      totalPending
    });
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

    const totalApproved = await User.countDocuments({ status: 'approved', ...query });
    const totalDenied = await User.countDocuments({ status: 'denied', ...query });
    const totalPending = await User.countDocuments({ status: 'NO ACTION', ...query });

    // Send response
    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      totalInPersonUsers,
      totalApproved,
      totalDenied,
      totalPending
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

    if (req.query.searchQuery) {
      const searchQuery = req.query.searchQuery.trim();
      query.$or = [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { middleName: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    // Apply filtering by status and course if provided
    if (statusFilter) {
      query.status = statusFilter;
    }

    if (req.query.degreeProgram) {
      query.degreeProgram = req.query.degreeProgram;
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
    const totalApproved = await User.countDocuments({ status: 'approved', ...query });
    const totalDenied = await User.countDocuments({ status: 'denied', ...query });
    const totalPending = await User.countDocuments({ status: 'NO ACTION', ...query });


    // Send response
    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      totalApproved,
      totalDenied, 
      totalPending
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

    if (req.query.searchQuery) {
      const searchQuery = req.query.searchQuery.trim();
      query.$or = [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { middleName: { $regex: searchQuery, $options: 'i' } },
        { college: { $regex: searchQuery, $options: 'i' } },
        { degreeProgram: { $regex: searchQuery, $options: 'i' } },
        { yearLevel: { $regex: searchQuery, $options: 'i' } },
        { status: { $regex: searchQuery, $options: 'i' } }
      ];
    }
    
    if (req.query.degreeProgram) {
      query.degreeProgram = req.query.degreeProgram;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    // Pagination and sorting parameters
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = req.query.limit === 'all' ? 0 : parseInt(req.query.limit) || 9; 
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

    // Send response
    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
    });
  } catch (error) {
    next(error);
  }
};


// List of Philippine holidays for 2025 from UP Calendar and PH Official Gazette
const philippineHolidays2025 = [
  '2025-01-01', // New Year's Day
  '2025-01-29', // Chinese New Year
  '2025-02-11', // Evelio Javier
  '2025-02-25', // People Power
  '2025-03-18', // Liberation of Panay
  '2025-03-31', // Eidul Fitr
  '2025-04-09', // Araw ng Kagitingan
  '2025-04-17', // Maundy Thursday
  '2025-04-18', // Good Friday
  '2025-04-19', // Black Saturday
  '2025-05-01', // Labor Day
  '2025-06-06', // Eid'l Adha
  '2025-06-12', // Independence Day
  '2025-08-25', // National Heroes Day
  '2025-11-30', // Bonifacio Day
  '2025-12-25', // Christmas Day
  '2025-12-30', // Rizal Day
];

const holidaySet = new Set(philippineHolidays2025);

export const assignSchedule = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'Only admins are allowed to generate schedules.'));
    }

    const { startDate, endDate } = req.body;

    // Calculate available dates
    const oneDay = 24 * 60 * 60 * 1000;
    const days = Math.round(Math.abs((new Date(startDate) - new Date(endDate)) / oneDay));
    let currentDate = new Date(startDate);
    const assignedDates = [];

    // Get settings including custom unavailable dates
    const settings = await Settings.getSettings();
    
    // Create a combined set of all unavailable dates
    const unavailableDatesSet = new Set([
      ...philippineHolidays2025,
      ...(settings.unavailableDates || [])
    ]);

    for (let i = 0; i <= days; i++) {
      const formattedDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format

      if (
        currentDate.getDay() !== 0 && // Exclude Sundays
        currentDate.getDay() !== 6 && // Exclude Saturdays
        !unavailableDatesSet.has(formattedDate) // Exclude holidays and user-selected dates
      ) {
        assignedDates.push(currentDate.toISOString());
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Fetch all users
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const allUsers = await User.find({ annualPE: 'InPerson' })
      .sort({
        yearLevel: sortDirection,
        college: 1,
        degreeProgram: 1,
        lastName: 1,
      })
      .lean(); 

    //  bulk operations
    const bulkOps = [];
    let counter = 0;
    let assignedDatesIndex = 0;

    for (const user of allUsers) {
      const assignedDate = assignedDates[assignedDatesIndex];

      bulkOps.push({
        updateOne: {
          filter: { _id: user._id },
          update: {
            $set: { schedule: new Date(assignedDate) },
            $push: {
              notifications: {
                message: `Your schedule has been generated. Your assigned date is ${new Date(
                assignedDate
                ).toLocaleDateString()}.`,
                type: 'info',
                timestamp: new Date(),
                link: '/status',
                isRead: false,
              },
            },
          },
        },
      });

      counter++;
      if (counter % 20 === 0 && assignedDatesIndex < assignedDates.length - 1) {
        assignedDatesIndex++;
      }
      if (assignedDatesIndex === assignedDates.length - 1) {
        assignedDatesIndex = 0;
      }
    }

    // Execute all updates in bulk
    if (bulkOps.length > 0) {
      await User.bulkWrite(bulkOps, { ordered: false });
    }
    // Save the schedule generation information
    settings.lastScheduleGeneration = {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      unavailableDates: Array.from(unavailableDatesSet),
      generatedAt: new Date()
    };
    await settings.save();
    res.status(200).json({ 
      message: 'Assigned dates to all users successfully',
      stats: {
        totalUsers: allUsers.length,
        availableDates: assignedDates.length,
        unavailableDates: Array.from(unavailableDatesSet)
      }
    });    
  } catch (error) {
    next(error);
  }
};


export const rescheduleUser = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create holiday set inside the function

    // Get settings including custom unavailable dates
    const settings = await Settings.getSettings();
    
    // Create a combined set of all unavailable dates
    const unavailableDatesSet = new Set([
      ...philippineHolidays2025.map(date => new Date(date).toDateString()), // Ensure correct format
      ...(settings.unavailableDates || []).map(date => new Date(date).toDateString()) // Convert settings dates
    ]);


    // Fetch all emergency dates and add them to the set
    const emergencyDates = await Emergency.find({});
    emergencyDates.forEach(ed => {
      unavailableDatesSet.add(new Date(ed.date).toDateString());
    });

    const { userId } = req.params;
    const { startDate, endDate } = req.body;

    const user = await User.findById(userId).select('-queueNumber -queueNumberDate');

    if (!user) {
      return next(errorHandler(404, 'User not found.'));
    }

    let currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rescheduledDates = [];
    const remainingSlotsArray = [];

    while (rescheduledDates.length < 3 && currentDate <= endDateObj) {
      // Skip past dates, weekends, and holidays
      if (
        currentDate < today || 
        currentDate.getDay() === 0 || 
        currentDate.getDay() === 6 ||
        unavailableDatesSet.has(currentDate.toDateString())
      ) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      // Skip the current user's already scheduled date
      if (user.schedule && currentDate.toString() === new Date(user.schedule).toString()) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      // Check if the slot is already reserved in the DateSlot collection
      const dateSlot = await DateSlot.findOne({ date: currentDate.toString() });

      // If date is already in the DateSlot collection and is reserved, skip it
      if (dateSlot && dateSlot.reservedSlots >= dateSlot.totalSlots) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      // Count the number of users scheduled on this date if slot is not reserved
      const userCount = await User.countDocuments({ schedule: currentDate });

      // Calculate remaining slots
      const remainingSlots = 20 - userCount;

      if (remainingSlots > 0) {
        rescheduledDates.push(currentDate.toString());
        remainingSlotsArray.push({ 
          date: currentDate.toString(), 
          remainingSlots 
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (rescheduledDates.length === 0) {
      return res.status(400).json({ message: 'No available dates within the given range.' });
    }

    // Atomically reserve slots for dates with limited availability
    for (const slot of remainingSlotsArray.filter(s => s.remainingSlots === 1)) {
      const dateSlot = await DateSlot.findOne({ date: slot.date });

      if (dateSlot) {
        await DateSlot.findOneAndUpdate(
          { 
            date: slot.date, 
            reservedSlots: { $lt: 1 } 
          },
          { 
            $inc: { reservedSlots: 1 },
            $addToSet: { reservedBy: user._id }
          },
          { 
            new: true,
            session
          }
        );
      } else {
        await DateSlot.create([{
          date: slot.date,
          reservedSlots: 1,
          totalSlots: 1,
          reservedBy: [user._id]
        }], { session });
      }
    }

    // Update user's reschedule information
    user.rescheduleStatus = 'NO ACTION';
    user.isRescheduled = true;

    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ 
      message: 'Rescheduled dates generated successfully', 
      rescheduledDates,
      remainingSlots: remainingSlotsArray
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const handleEmergency = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'Only admins can reschedule due to emergencies.'));
    }

    const { emergencyDate, startDate, endDate, reason } = req.body;

     // Save emergency date to database
     await Emergency.create([{
      date: new Date(emergencyDate),
      reason: reason || 'Emergency Rescheduling',
      createdBy: req.user._id
    }], { session });


    const emergencyDateObj = new Date(emergencyDate);
    const startOfDay = new Date(emergencyDateObj);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(emergencyDateObj);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch students scheduled on the emergency date
    const affectedUsers = await User.find({ 
      annualPE: 'InPerson',
      schedule: { 
        $gte: startOfDay, 
        $lte: endOfDay 
      }
    }).lean();

    if (affectedUsers.length === 0) {
      return res.status(200).json({ message: 'No students scheduled on this date.' });
    }

    // Get all available dates (excluding weekends & PH holidays)

    const settings = await Settings.getSettings();
    
    // Create a combined set of all unavailable dates
    const unavailableDatesSet = new Set([
      ...philippineHolidays2025.map(date => new Date(date).toDateString()), // Ensure correct format
      ...(settings.unavailableDates || []).map(date => new Date(date).toDateString()) // Convert settings dates
    ]);


    // Fetch all emergency dates and add them to the set
    const emergencyDates = await Emergency.find({});
    emergencyDates.forEach(ed => {
      unavailableDatesSet.add(new Date(ed.date).toDateString());
    });

    let currentDate = new Date(startDate);
    const availableDates = [];

    while (currentDate <= new Date(endDate)) {
      const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD format

      if (
        currentDate.getDay() !== 0 && // Skip Sundays
        currentDate.getDay() !== 6 && // Skip Saturdays
        !unavailableDatesSet.has(currentDate.toDateString()) // Skip holidays
      ) {
        availableDates.push(new Date(currentDate)); // Store as Date object
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Reschedule users based on available slots
    let remainingUsers = [...affectedUsers]; // Remaining users to reschedule

    for (let date of availableDates) {
      // Check the current slot availability 
      const userCount = await User.countDocuments({ schedule: date });
      const remainingSlots = 20 - userCount;

      if (remainingSlots <= 0) {
        continue; // Skip this date if no slots are available
      }

      // Move students who can fit into this date
      const usersToReschedule = remainingUsers.slice(0, remainingSlots); // Take only as many as can fit
      const bulkOps = usersToReschedule.map(user => ({
        updateOne: {
          filter: { _id: user._id },
          update: {
            $set: { schedule: date },
            $push: {
              notifications: {
                message: `Your schedule has been moved to ${date.toLocaleDateString()}.`,
                type: 'warning',
                timestamp: new Date(),
                link: '/status',
                isRead: false
              }
            }
          }
        }
      }));

      if (bulkOps.length > 0) {
        await User.bulkWrite(bulkOps, { ordered: false, session });
      }

      usersToReschedule.forEach(user => {
        console.log(`User ${user._id} has been rescheduled to ${date.toLocaleDateString()}`);
      });

      remainingUsers = remainingUsers.slice(remainingSlots);

      // Stop if all students are rescheduled
      if (remainingUsers.length === 0) break;
    }

    // If there are any remaining users, they couldn't be rescheduled due to full slots
    if (remainingUsers.length > 0) {
      return res.status(400).json({
        message: `${remainingUsers.length} students could not be rescheduled due to full slots.`
      });
    }

    console.log(`Rescheduled ${affectedUsers.length} students successfully.`); // Log total rescheduled users

    // Finalize transaction
    await session.commitTransaction();
    session.endSession();

   
    const updatedUsers = await User.find({ _id: { $in: affectedUsers.map(user => user._id) } }).lean();
    res.status(200).json({
      message: `Rescheduled ${affectedUsers.length} students successfully.`,
      updatedUsers,  // Send the updated users
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const releaseUser = async (req, res) => {
  const { userId } = req.params;

  try {
    await releaseSlot(userId);
    res.status(200).json({ message: "Slots released successfully." });
  } catch (error) {
    console.error("Error releasing slots:", error);
    res.status(500).json({ message: "Failed to release slots." });
  }
};

export const releaseSlot = async (userId) => {
  try {
    // Delete all DateSlot documents where the user is listed in the reservedBy array
    const result = await DateSlot.deleteMany({ reservedBy: userId });

    if (result.deletedCount > 0) {
      console.log(`${result.deletedCount} slots released for user ${userId}`);
    } else {
      console.log(`No slots found to release for user ${userId}`);
    }
  } catch (error) {
    console.error('Error releasing slots:', error);
    throw new Error('Failed to release slots');
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






// First create a function to delete EmergencyDate collection
export const deleteAllEmergencyDates = async (req, res, next) => {
  try {
    await Emergency.deleteMany({});
    res.status(200).json({ message: 'All emergency dates deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteSchedule = async (req, res, next) => {
  try {
    // Clear user schedules and related fields
    await User.updateMany(
      { annualPE: 'InPerson' }, 
      { $set: { 
          schedule: "", 
          status: "NO ACTION", 
          doctorStatus: "NO ACTION", 
          dentistStatus: "NO ACTION", 
          reschedule: "", 
          comment: "",  
          medcert: "",
          rescheduleStatus: "",
          rescheduleRemarks: "",
          rescheduledDate: [], 
          rescheduleLimit: 0,
          isRescheduled: false,
          isPresent: "PENDING",
          isDental: false,
          isGeneral: false,
          lastLoggedIn: null,
          queueNumberDate: null,
          queueNumber: null,
          notifications: []
        } 
      }
    );

    // Delete all emergency dates
    await Emergency.deleteMany({});

    // Delete all date slots
    await DateSlot.deleteMany({});
    
    // Clear unavailable dates in Settings
    // Keep a backup of the current settings first for history/audit purposes
    const currentSettings = await Settings.findOne({ key: 'system' });
    if (currentSettings) {
      // Store the current configuration in lastScheduleGeneration
      await Settings.updateOne(
        { key: 'system' },
        { 
          $set: {
            lastScheduleGeneration: {
              startDate: currentSettings.startDate,
              endDate: currentSettings.endDate,
              unavailableDates: currentSettings.unavailableDates,
              generatedAt: new Date()
            },
            // Clear the current unavailable dates
            unavailableDates: []
          }
        }
      );
    }

    res.status(200).json({ 
      message: 'Schedules, statuses, and unavailable dates cleared successfully' 
    });
  } catch (error) {
    console.error('Error clearing schedules, statuses, and unavailable dates:', error);
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
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    console.log('Query start time:', startOfDay);
    console.log('Query end time:', endOfDay);

    const usersScheduledForToday = await User.find({
      annualPE: 'InPerson',
      schedule: {
        $elemMatch: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      }
    })
    .select({
      firstName: 1,
      middleName: 1,
      lastName: 1,
      profilePicture: 1,
      yearLevel: 1,
      college: 1,
      degreeProgram: 1,
      status: 1,
      isPresent: 1,
      schedule: 1
    })
    .sort({ lastName: 1, firstName: 1 })
    .lean();

    console.log(`Found ${usersScheduledForToday.length} users in schedule`);
    
    res.status(200).json(usersScheduledForToday);
  } catch (error) {
    console.error('Error fetching users scheduled for today:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};

export const getAll = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'Only admins can see all users!'));
  }
  
  try {
    // Base query
    let query = { isAdmin: false, isSuperAdmin: false };

    if (req.query.searchQuery) {
      const searchQuery = req.query.searchQuery.trim();
      query.$or = [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { middleName: { $regex: searchQuery, $options: 'i' } },
        { college: { $regex: searchQuery, $options: 'i' } },
        { degreeProgram: { $regex: searchQuery, $options: 'i' } },
        { yearLevel: { $regex: searchQuery, $options: 'i' } },
        { status: { $regex: searchQuery, $options: 'i' } }
      ];
    }
    
    if (req.query.degreeProgram) {
      query.degreeProgram = req.query.degreeProgram;
    }
    if (req.query.college) {
      query.college = req.query.college;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.isGraduating) {
      query.isGraduating = req.query.isGraduating;
    }
    // Pagination and sorting parameters
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = req.query.limit === 'all' ? 0 : parseInt(req.query.limit) || 9; 
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    // Execute queries in parallel using Promise.all
    const [users, aggregationResults] = await Promise.all([
      // Query 1: Get paginated user data
      User.find(query)
        .sort({
          yearLevel: sortDirection,
          college: 1,
          degreeProgram: 1,
          lastName: 1
        })
        .skip(startIndex)
        .limit(limit)
        .lean(), // Use lean() for better performance when you don't need Mongoose document methods
      
      // Query 2: Use aggregation for all counts in a single database operation
      User.aggregate([
        { $match: query },
        {
          $facet: {
            // Total counts
            'totalCounts': [
              {
                $group: {
                  _id: null,
                  totalUsers: { $sum: 1 },
                  totalApproved: { 
                    $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] }
                  },
                  totalGraduating: {
                    $sum: { $cond: [{ $eq: ["$isGraduating", true] }, 1, 0] }
                  },
                  totalActive: {                    
                  $sum: { $cond: [{ $eq: ["$isGraduating", false] }, 1, 0] }
                  },
                  totalDenied: { 
                    $sum: { $cond: [{ $eq: ["$status", "denied"] }, 1, 0] }
                  },
                  totalPending: { 
                    $sum: { $cond: [{ $eq: ["$status", "NO ACTION"] }, 1, 0] }
                  },
                  lastMonthUsers: {
                    $sum: {
                      $cond: [
                        { $gte: ["$createdAt", new Date(new Date().setMonth(new Date().getMonth() - 1))] },
                        1,
                        0
                      ]
                    }
                  }
                }
              }
            ],
          }
        }
      ])
    ]);

    // Process aggregation results
    const totalCountsResult = aggregationResults[0].totalCounts[0] || {
      totalUsers: 0,
      totalApproved: 0, 
      totalDenied: 0,
      totalActive: 0,
      totalPending: 0,
      lastMonthUsers: 0,
      totalGraduating: 0,
    };
  

    // Remove sensitive data (password)
    const usersWithoutPassword = users.map(user => {
      const { password, ...rest } = user;
      return rest;
    });


    // Send response
    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers: totalCountsResult.totalUsers,
      totalInPersonUsers: totalCountsResult.totalUsers,
      totalApproved: totalCountsResult.totalApproved,
      totalDenied: totalCountsResult.totalDenied,
      totalPending: totalCountsResult.totalPending,
      totalActive: totalCountsResult.totalActive,
      totalGraduating: totalCountsResult.totalGraduating
     
    });
  } catch (error) {
    next(error);
  }
};