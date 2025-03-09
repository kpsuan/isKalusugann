import mongoose from "mongoose";

const laboratorySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
    },
    faculty: {
      type: Number,
      required: true,
    },
    students: {
      type: Number,
      required: true,
    },
    regular: {
      type: Number,
      required: true,
    },
    senior: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const LaboratoryService = mongoose.model("LaboratoryService", laboratorySchema);

export default LaboratoryService;
