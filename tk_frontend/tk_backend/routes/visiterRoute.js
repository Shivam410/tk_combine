import express from "express";
import { incrementVisitor, getVisitorCount } from "../controllers/VisiterController.js";

const router = express.Router();

router.post("/increment", incrementVisitor);
router.get("/count", getVisitorCount);      

export default router;
