import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "assigned", "in-progress", "completed"],
      default: "pending",
    },

    location: String,
    scheduledDate: Date,
  },
  { timestamps: true }
);

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);
export default Job;