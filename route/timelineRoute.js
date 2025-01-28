import express from "express";
import {addTimeline, deleteTimeline, getAllTimeline} from "../controllers/timelineController.js";
import {isAuthenticated} from "../middlewares/authentication.js"

const router = express.Router();

router.post("/addTimeline", isAuthenticated, addTimeline);
router.delete("/deleteTimeline/:id", isAuthenticated, deleteTimeline);
router.get("/getAllTimeline", getAllTimeline);

export default router;