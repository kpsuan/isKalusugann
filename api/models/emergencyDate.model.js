import mongoose from 'mongoose';
const emergencyDateSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  reason: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

const Emergency = mongoose.model('Emergency', emergencyDateSchema);

export default Emergency;