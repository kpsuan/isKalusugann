import mongoose from "mongoose";

const activityLogSchema  = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    details: { type: mongoose.Schema.Types.Mixed } // Store related settings data
  }, { timestamps: true });

  const ActivityLog  = mongoose.model('ActivityLog', activityLogSchema);
  export default ActivityLog ;
  