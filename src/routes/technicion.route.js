import express from "express";
import {
  getAssignedJobs,
  getJobDetail,
  updateJobStatus,
} from "../controllers/technicion.controller.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { getMyNotifications } from "../controllers/admin.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const technicionRouter = express.Router();
technicionRouter.get("/notifications", getMyNotifications);
technicionRouter.get("/technician/jobs",protect, allowRoles("technician"), getAssignedJobs);
technicionRouter.get("/technician/jobs/:id",protect, allowRoles("technician"), getJobDetail);
technicionRouter.patch("/technician/jobs/status/:id",protect, allowRoles("technician"), updateJobStatus);

export default technicionRouter;
