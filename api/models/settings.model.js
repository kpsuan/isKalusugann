import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true }, // Add key field
  startDate: Date,
  endDate: Date,
  preEnlistStart: Date,
  preEnlistEnd: Date,
}, { timestamps: true });


const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;