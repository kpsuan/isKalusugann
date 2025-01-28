import mongoose from "mongoose";

const queueSchema = new mongoose.Schema(
    {
    step: { type: String, required: true }, // 'General PE', 'Dental', or 'Doctor Check-up'
    date: { type: String, required: true }, 
    students: [
        {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        studentNumber: {
            type: String,
            default: '',
          }, 
        firstName: {
            type: String,
            default: '',
          },
        lastName: {
            type: String,
            default: '',
          },
        yearLevel: {
            type: String,
            default: '',
          },
        college: {
            type: String,
            default: '',
          },
        degreeProgram: {
            type: String,
            default: '',
          },
        queueNumber: { type: Number, required: true }, // Position in the queue
        arrivedAt: { type: Date, default: Date.now },  // Time the student arrives
        priority: { type: Boolean, default: false }    // High priority status
        }
    ]
});


const Queue = mongoose.model('Queue', queueSchema);


export default Queue;