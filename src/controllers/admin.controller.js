import Job from "../models/job.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { createNotification } from "../utils/createNotification.js";

export const getPendingTechnicians = async (req, res) => {
  try {
    const technicians = await User.find({
      role: "technician",
      isApproved: false,
    }).select("-password");

    res.json(technicians);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching technicians" });
  }
};

export const approveTechnician = async (req, res) => {
  try {
    const { id } = req.params;

    const technician = await User.findById(id);

    if (!technician || technician.role !== "technician") {
      return res.status(404).json({ msg: "Technician not found" });
    }

    technician.isApproved = true;
    await technician.save();

    res.json({ msg: "Technician approved successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Error approving technician" });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
     .populate("technician", "name email field")
      .populate("client", "name email");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching jobs" });
  }
};

export const assignTechnician = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { technicianId,scheduledDate } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    const technician = await User.findById(technicianId);
    if (
      technician.role !== "technician" ||
      !technician.isApproved
    ) {
      return res.status(400).json({ msg: "Invalid technician or not approved" });
    }

    job.technician = technicianId;
    job.status = "assigned";
    job.scheduledDate = new Date(scheduledDate);

    await createNotification(technicianId, "New job assigned to you", job._id);

    await createNotification(
      job.client,
      "Your job has been assigned to a technician",
      job._id,
    );
    await job.save();

    res.json({ msg: "Technician assigned successfully", job });
  } catch (error) {
    res.status(500).json({ msg: "Error assigning worker" });
  }
};

export const getMyNotifications = async (req, res) => {
  try {
    const { id } = req.params;
    const notifications = await Notification.find({
      user: id,
    })
    .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching notifications" });
  }
};


export const getAllTechnicians = async (req, res) => {
  try {
    const techs = await User.find({
      role: "technician",
      isApproved: true,
    }).select("-password");

    res.json(techs);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching technicians" });
  }
};

export const getSingleJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId)
     .populate("technician", "name email field")
      .populate("client", "name email");

    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    res.status(200).json({
      msg: "Job fetched successfully",
      job,
    });

  } catch (error) {
    res.status(500).json({
      msg: "Error fetching job",
      error: error.message,
    });
  }
};
export const getSingleTechnician = async (req, res) => {
  try {
    const { id } = req.params;

    const technician = await User.findById(id)

    if (!technician) {
      return res.status(404).json({ msg: "Technician not found" });
    }

    res.status(200).json({
      msg: "Technician fetched successfully",
      technician,
    });

  } catch (error) {
    res.status(500).json({
      msg: "Error fetching technician",
      error: error.message,
    });
  }
};