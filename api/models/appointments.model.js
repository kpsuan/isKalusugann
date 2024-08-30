import mongoose from "mongoose";

const appointmentsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    date: {
        type: String, // Store date as a string in 'YYYY-MM-DD' format
        required: true,
    },
    timeSlot: {
        type: String, // Store time slot as a string, e.g., '09:00 AM - 10:00 AM'
        required: true,
    },
    service: {
        type: String,
        required: true,
        default: '',
    },
    category: {
        type: String,
        default: 'uncategorized',
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
}, { timestamps: true });

// Create a unique compound index for userId, date, and timeSlot
appointmentsSchema.index({ userId: 1, date: 1, timeSlot: 1 }, { unique: true });

const Appointments = mongoose.model('Appointments', appointmentsSchema);

export default Appointments;
