import express from "express";
import { addProject, getAllProject, deleteProject, updateProject, getSingleProject } from "../controllers/projectController.js";
import {isAuthenticated} from "../middlewares/authentication.js"

const router = express.Router();

router.post("/addProject", isAuthenticated, addProject);
router.get("/getAllProject", getAllProject);
router.delete("/deleteProject/:id", isAuthenticated ,deleteProject);
router.put("/updateProject/:id", isAuthenticated, updateProject);
router.get("/getSingleProject/:id", getSingleProject);

export default router;