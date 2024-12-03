import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  startDate: Date,
  endDate: Date,
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;