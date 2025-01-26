import mongoose from "mongoose";

const dateSlotSchema = new mongoose.Schema({
    date: {
      type: String,
      required: true,
      unique: true
    },
    totalSlots: {
      type: Number,
      default: 1
    },
    reservedSlots: {
      type: Number,
      default: 0
    },
    reservedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }, { timestamps: true });

  const DateSlot = mongoose.model('DateSlot', dateSlotSchema);
  export default DateSlot;
  