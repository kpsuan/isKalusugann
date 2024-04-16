import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';

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
  if(!req.user.isAdmin){
    return next(errorHandler(403, 'Only admins can see all users!'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? -1 : 1;

    const users = await User.find({ annualPE: 'Online' })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

      const usersWithoutPassword = users.map((user) => {
        const { password, ...rest } = user._doc;
        return rest;
      });

      const totalUsers = await User.countDocuments();
      const totalOnlinePE = await User.countDocuments({ annualPE: 'Online' }); // Count only users with annual = 'online'

      const now = new Date(); 
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );

      const lastMonthUsers = await User.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });

      res.status(200).json(
        { 
          users: usersWithoutPassword, 
          totalUsers, 
          totalOnlinePE,
          lastMonthUsers });
  } catch (error) {
    next(error);
  }
}

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
  if(!req.user.isAdmin){
    return next(errorHandler(403, 'Only admins can see all users!'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    const users = await User.find({ annualPE: 'InPerson' })
      .sort({ yearLevel: sortDirection, college: sortDirection, degreeProgram: sortDirection, lastName: sortDirection })
      .skip(startIndex)
      .limit(limit);

      const usersWithoutPassword = users.map((user) => {
        const { password, ...rest } = user._doc;
        return rest;
      });

      const totalUsers = await User.countDocuments();
      const totalInPersonUsers = await User.countDocuments({ annualPE: 'InPerson' }); // Count only users with annual = 'online'

      const now = new Date(); 
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );

      const lastMonthUsers = await User.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });

      res.status(200).json(
        { 
          users: usersWithoutPassword, 
          totalUsers, 
          totalInPersonUsers,
          lastMonthUsers });
  } catch (error) {
    next(error);
  }
}

