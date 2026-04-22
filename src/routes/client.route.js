import express from "express";
import { createJob, getMyJobs, getSingleJob } from "../controllers/client.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { getMyNotifications } from "../controllers/admin.controller.js";
const clientRouter = express.Router();

clientRouter.post("/createjob",protect, allowRoles("client"), createJob);
clientRouter.get("/clientjobs", protect, allowRoles("client"), getMyJobs);
clientRouter.get("/clientjobs/:id", protect, allowRoles("client"), getSingleJob);
clientRouter.get("/notifications/:id", getMyNotifications);

export default clientRouter;
