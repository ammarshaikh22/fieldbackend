import Job from "../models/job.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { createNotification } from "../utils/createNotification.js";

export const createJob = async (req, res) => {
  try {
    const { title, description, location } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ msg: "Please provide all required fields" });
    }

    const job = await Job.create({
      title,
      description,
      location,
      client: req.user._id,
    });

    await createNotification(
      req.user._id,
      `Your job "${title}" has been created successfully!`,
      job._id
    );

    const admin = await User.findOne({ role: "admin" });

    if (admin) {
      await createNotification(
        admin._id,
        `New job "${title}" created by client`,
        job._id
      );
    }

    res.status(201).json({ msg: "Job created", job });

  } catch (error) {
    res.status(500).json({ msg: "Error creating job" });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      client: req.user._id,
    })
      .populate("technician", "name email field")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching jobs" });
  }
};

export const getSingleJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id)
      .populate("technician", "name email field")
      .populate("client", "name email");

    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    // ensure client owns this job
    if (job.client._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Access denied" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching job" });
  }
};

