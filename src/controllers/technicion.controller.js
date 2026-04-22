import Job from "../models/job.model.js";
import User from "../models/user.model.js";
import { createNotification } from "../utils/createNotification.js";

export const getAssignedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      technician: req.user.id,
    })
    .populate("client", "name email")
    .populate("technician", "name email")
    .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getJobDetail = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      technician: req.user.id,
    })
    .populate("client", "name email")
    .populate("technician", "name email");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["pending", "in-progress", "completed"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const job = await Job.findOneAndUpdate(
      {
        _id: id,
        technician: req.user.id,
      },
      { status },
      { new: true }
    )
      .populate("client", "name email")
      .populate("technician", "name email");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await createNotification(
      job.client._id,
      `Your job status updated to ${status}`,
      job._id
    );

    const admin = await User.findOne({ role: "admin" });

    if (admin) {
      await createNotification(
        admin._id,
        `Job status updated to ${status} by technician`,
        job._id
      );
    }

    res.json({
      message: "Status updated successfully",
      job,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};