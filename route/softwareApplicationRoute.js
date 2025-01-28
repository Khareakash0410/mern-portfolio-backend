import express from "express";
import {addSoftwareApplication, deleteSoftwareApplication, getAllSoftwareApplication} from "../controllers/softwareApplicationController.js";
import {isAuthenticated} from "../middlewares/authentication.js"

const router = express.Router();

router.post("/addSoftwareApplication", isAuthenticated, addSoftwareApplication);
router.delete("/deleteSoftwareApplication/:id", isAuthenticated, deleteSoftwareApplication);
router.get("/getAllSoftwareApplication", getAllSoftwareApplication);

export default router;