import express from "express";
import { deleteMessage, getAllMessage, sendMessage } from "../controllers/messageController.js";
import {isAuthenticated} from "../middlewares/authentication.js"

const router = express.Router();

router.post("/send", sendMessage);
router.get("/getAll", getAllMessage);
router.delete("/delete/:id", isAuthenticated ,deleteMessage)

export default router;