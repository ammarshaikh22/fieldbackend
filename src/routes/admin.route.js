import express from "express";
import { approveTechnician, assignTechnician, getAllJobs, getAllTechnicians, getMyNotifications, getPendingTechnicians, getSingleJob, getSingleTechnician } from "../controllers/admin.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
const adminRouter = express.Router();

adminRouter.get("/technicians/pending",protect, allowRoles("admin"), getPendingTechnicians);
adminRouter.get("/notifications/:id", getMyNotifications);
adminRouter.get("/technicians", protect, allowRoles("admin"), getAllTechnicians);
adminRouter.get("/technicians/:id", protect, allowRoles("admin"), getSingleTechnician);
adminRouter.patch("/technicians/approve/:id", protect, allowRoles("admin"), approveTechnician);
adminRouter.get("/alljobs", protect, allowRoles("admin"), getAllJobs);
adminRouter.get("/jobs/:jobId", protect, allowRoles("admin"), getSingleJob);
adminRouter.post("/jobs/assign/:jobId", protect, allowRoles("admin"), assignTechnician);


export default adminRouter;