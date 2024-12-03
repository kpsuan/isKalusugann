import User from '../models/user.model.js';
import bcrypt from 'bcrypt'; 
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const slug =req.body.email.split(' ').join('').toLowerCase().replace(/up|edu|ph/g, '').replace(/[^a-zA-Z0-9-]/g, '-');
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, slug, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
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