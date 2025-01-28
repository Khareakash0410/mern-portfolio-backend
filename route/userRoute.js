import express from "express";
import { forgetPassword, getUser, getUserForPortfolio, login, logout, register, resetPassword, updatePassword, updateUser } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/authentication.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/getUser", isAuthenticated, getUser);
router.put("/updateUser", isAuthenticated, updateUser);
router.put("/updatePassword", isAuthenticated, updatePassword);
router.get("/getUserForPortfolio", getUserForPortfolio);
router.post("/forgetPassword", forgetPassword);
router.put("/resetPassword/:resetToken", resetPassword);

export default router;