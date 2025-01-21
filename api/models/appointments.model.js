import mongoose from 'mongoose';

const appointmentsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: String, // Store date as a string in 'YYYY-MM-DD' format
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
  },
  service: {
    type: String,
  },
  timeSlot: {
    type: String,
  },
  category: {
    type: String,
    default: 'uncategorized',
  },
  status: {
    type: String,
    default: 'pending', // Appointment status, can be 'pending', 'confirmed', 'completed', etc.
  },
});

const Appointments = mongoose.model('Appointment', appointmentsSchema);

export default Appointments;
