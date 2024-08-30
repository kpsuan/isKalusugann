import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';

import fs from 'fs';
import path from 'path';




export const test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};

// update user

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return next(errorHandler(401, 'You can update only your account!'));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
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
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
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

    // Fetch the user's current schedule
    const user = await User.findById(userId);

    if (!user) {
      return next(errorHandler(404, 'User not found.'));
    }

    let currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);
    const rescheduledDates = [];

    // Find the 3 earliest available dates within the range
    while (rescheduledDates.length < 3 && currentDate <= endDateObj) {
      // Skip weekends (Saturday and Sunday)
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        // Count the number of users scheduled on this date
        const userCount = await User.countDocuments({ schedule: currentDate.toString() });

        // Log the number of users scheduled on this date
        console.log(`Date: ${currentDate.toDateString()}, Users Scheduled: ${userCount}`);

        if (userCount < 20) {
          // Add the date to the available dates if there are slots available
          rescheduledDates.push(currentDate.toString());  // Save the date in the desired format
        }
      }

      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    if (rescheduledDates.length === 0) {
      return res.status(400).json({ message: 'No available dates within the given range.' });
    }

    res.status(200).json({ message: 'Rescheduled dates generated successfully', rescheduledDates });
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
      rescheduledDate: []
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




