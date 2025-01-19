import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import docsRoutes from './routes/docs.route.js';
import appointmentsRoute from './routes/appointments.route.js';
import eventsRoutes from './routes/events.route.js';
import settingsRoutes from './routes/settings.route.js';
import documentRequestRoute from './routes/documentRequest.route.js'
import emailUserRoute from './routes/emailuser.route.js'
import cookieParser from 'cookie-parser';
import path from 'path';

// Import the cron jobs
import './controllers/cronJob.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();
const app = express();

app.use(express.json());
app.use(cookieParser());

// Route handlers
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/docs', docsRoutes);
app.use('/api/appointments', appointmentsRoute);
app.use('/api/events', eventsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/docrequest', documentRequestRoute);
app.use('/api/email', emailUserRoute);




// Serve static files from the client
app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
