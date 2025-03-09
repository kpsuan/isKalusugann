import User from '../models/user.model.js';
import crypto from "crypto"
import bcrypt from 'bcrypt'; 
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import { emailUser } from './emailuser.controller.js';

export const signup = async (req, res, next) => {
  const { username, email, password, firstName, lastName, role, isAdmin, isSuperAdmin, licenseNumber, isGraduating, college, degreeProgram, yearLevel } = req.body;
  const slug =req.body.email.split(' ').join('').toLowerCase().replace(/up|edu|ph/g, '').replace(/[^a-zA-Z0-9-]/g, '-');
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, slug, password: hashedPassword, firstName, lastName, role, isAdmin, isSuperAdmin, licenseNumber, isGraduating, college, degreeProgram, yearLevel });
  try {
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};

export const importStudents = async (req, res, next) => {
  const { students } = req.body;
  
  if (!students || !Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ success: false, message: 'No valid student data provided' });
  }

  try {
    const results = {
      total: students.length,
      successful: 0,
      failed: 0,
      errors: []
    };

    // Process each student
    for (const student of students) {
      try {
        // Generate slug like in the signup function
        const slug = student.email?.split(' ').join('').toLowerCase().replace(/up|edu|ph/g, '').replace(/[^a-zA-Z0-9-]/g, '-');
        
        // Hash password
        const hashedPassword = bcrypt.hashSync(student.password, 10);
        
        // Create new user object
        const newUser = new User({
          username: student.username,
          email: student.email,
          slug,
          password: hashedPassword,
          firstName: student.firstName,
          lastName: student.lastName,
          middleName: student.middleName || '',
          isAdmin: student.isAdmin || false,
          isSuperAdmin: student.isSuperAdmin || false,
          licenseNumber: student.licenseNumber || '',
          isGraduating: student.isGraduating || false,
          college: student.college,
          degreeProgram: student.degreeProgram,
          yearLevel: student.yearLevel
        });
        
        // Save the user
        await newUser.save();
        results.successful++;
        
      } catch (error) {
        results.failed++;
        // Add meaningful error message with the problematic record
        results.errors.push({
          email: student.email || 'Unknown',
          error: error.message || 'Unknown error',
          code: error.code // MongoDB error code (e.g., 11000 for duplicate)
        });
      }
    }
    
    // Return results
    res.status(200).json({
      success: true,
      message: `Imported ${results.successful} of ${results.total} students`,
      results
    });
    
  } catch (error) {
    next(error);
  }
};


export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found'));

    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'wrong credentials'));

    const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);
    const { password: hashedPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour
    res
      .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};


export const attendance = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }

    // Check the password
    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, 'Wrong credentials'));
    }

    // Generate JWT token and return the updated user details
    const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);
    const { password: hashedPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour

    res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
       .status(200)
       .json({ ...rest });
  } catch (error) {
    next(error);
  }
};

export const attendanceOriginal = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }

    // Check the password
    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, 'Wrong credentials'));
    }

    // Determine today's date
    const today = new Date().toDateString();

    // Check if the user already has a queue number for today
    if (validUser.queueNumberDate === today) {
      // User already has a queue number for today, return the existing details
      const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = validUser._doc;
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour

      return res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
                 .status(200)
                 .json({ ...rest }); // Return the existing queueNumber and other user details
    }

    // Use an atomic increment to safely assign a unique queue number
    const usersWithQueueToday = await User.countDocuments({
      queueNumberDate: today
    });

    const newQueueNumber = usersWithQueueToday + 1;

    if (newQueueNumber > 20) {
      return next(errorHandler(400, 'Queue limit reached for today'));
    }

    // Update the user with the new queue number atomically
    const updatedUser = await User.findByIdAndUpdate(
      validUser._id,
      {
        $set: {
          isPresent: 'ARRIVED',
          lastLoggedIn: new Date(),
          queueNumber: newQueueNumber, // Assign the new queue number
          queueNumberDate: today // Store the date for today's queue
        },
        $push: {
          notifications: {
            message: `Annual PE done.`,
            type: 'success',
            timestamp: new Date(),
            link: '/status',
            isRead: false
          }
        }
      },
      { new: true }
    );

    // Generate JWT token and return the updated user details
    const token = jwt.sign({ id: updatedUser._id, isAdmin: updatedUser.isAdmin }, process.env.JWT_SECRET);
    const { password: hashedPassword, ...rest } = updatedUser._doc;
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour

    res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
       .status(200)
       .json({ ...rest });
  } catch (error) {
    next(error);
  }
};
export const attendance2 = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }

    // Check the password
    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, 'Wrong credentials'));
    }

    // Determine today's date
    const today = new Date().toDateString();

    // Check if the user already has a queue number for today
    if (validUser.queueNumberDate === today) {
      // User already has a queue number for today, return the existing details
      const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = validUser._doc;
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour

      return res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
                 .status(200)
                 .json({ ...rest }); // Return the existing queueNumber and other user details
    }

    // Use an atomic increment to safely assign a unique queue number
    const usersWithQueueToday = await User.countDocuments({
      queueNumberDate: today
    });

    const newQueueNumber = usersWithQueueToday + 1;

    if (newQueueNumber > 20) {
      return next(errorHandler(400, 'Queue limit reached for today'));
    }

    // Update the user with the new queue number atomically
    const updatedUser = await User.findByIdAndUpdate(
      validUser._id,
      {
        $set: {
          isPresent: 'ARRIVED',
          lastLoggedIn: new Date(),
          queueNumber: newQueueNumber, // Assign the new queue number
          queueNumberDate: today // Store the date for today's queue
        },
        $push: {
          notifications: {
            message: `Annual PE done.`,
            type: 'success',
            timestamp: new Date(),
            link: '/status',
            isRead: false
          }
        }
      },
      { new: true }
    );

    // Generate JWT token and return the updated user details
    const token = jwt.sign({ id: updatedUser._id, isAdmin: updatedUser.isAdmin }, process.env.JWT_SECRET);
    const { password: hashedPassword, ...rest } = updatedUser._doc;
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour

    res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
       .status(200)
       .json({ ...rest });
  } catch (error) {
    next(error);
  }
};




export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = user._doc;
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour
      res
        .cookie('access_token', token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-8),
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
        slug: req.body.email.split(' ').join('').toLowerCase().replace(/up|edu|ph/g, '').replace(/[^a-zA-Z0-9-]/g, '-')
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: hashedPassword2, ...rest } = newUser._doc;
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour
      res
        .cookie('access_token', token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res) => {
  res.clearCookie('access_token').status(200).json('Signout success!');
};

// Backend changes - forgotPassword controller
export const forgotPassword = async (req, res) => {
  // Add request body logging for debugging
  console.log('Request body:', req.body);
  
  if (!req.body || !req.body.email) {
    return res.status(400).json({ 
      success: false, 
      message: "Email is required" 
    });
  }

  const { email } = req.body;

  // Validate email format
  if (!email || !email.includes('@')) {
    return res.status(400).json({ 
      success: false, 
      message: "Please provide a valid email address" 
    });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "If a user exists with this email, they will receive password reset instructions" 
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetTokenExpiresAt = resetTokenExpiresAt;

    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await emailUser(user.email, 'Password Reset Request', resetURL);
      return res.status(200).json({ 
        success: true, 
        message: "Password reset instructions have been sent to your email" 
      });
    } catch (emailError) {
      // If email fails, reset the token
      user.resetPasswordToken = undefined;
      user.resetTokenExpiresAt = undefined;
      await user.save();
      
      console.error('Email sending error:', emailError);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to send reset email. Please try again later." 
      });
    }

  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred. Please try again.' 
    });
  }
};



