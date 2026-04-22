import Notification from "../models/notification.model.js";

export const createNotification = async (userId, message, jobId) => {
  await Notification.create({
    user: userId,
    message,
    job: jobId,
  });
};