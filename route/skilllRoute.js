import express from "express";
import { addSkill, getAllSkill, deleteSkill, updateSkill } from "../controllers/skillController.js";
import {isAuthenticated} from "../middlewares/authentication.js"

const router = express.Router();

router.post("/addSkill", isAuthenticated, addSkill);
router.get("/getAllSkill", getAllSkill);
router.delete("/deleteSkill/:id", isAuthenticated ,deleteSkill);
router.put("/updateSkill/:id", isAuthenticated, updateSkill);

export default router;