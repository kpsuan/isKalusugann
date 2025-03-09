import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // Add key field with unique constraint
  startDate: Date,
  endDate: Date,
  preEnlistStart: Date,
  preEnlistEnd: Date,
  unavailableDates: [String], // Array of date strings in 'YYYY-MM-DD' format
  lastScheduleGeneration: {
    startDate: Date,
    endDate: Date,
    unavailableDates: [String], // Store all unavailable dates used in generation
    generatedAt: Date
  }
}, { timestamps: true });

// Create a default settings document if none exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne({ key: 'system' });
  
  if (!settings) {
    settings = await this.create({
      key: 'system',
      unavailableDates: []
    });
  }
  
  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;