import express from "express";

import {
  login,
  logout,
  register,
  updatePassword,
} from "../controllers/AuthController.js";

import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout" , logout);

router.put("/update-password", isAuthenticated, updatePassword);

export default router;
