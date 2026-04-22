import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    message: String,

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24, 
    },
  },
  { timestamps: true }
);

const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
export default Notification;