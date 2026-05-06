import express from "express";
import {
  createReel,
  deleteReel,
  getAllReels,
  getReelById,
  updateReelOrder,
} from "../controllers/ReelController.js";

const router = express.Router();

router.post("/new-reel", createReel);
router.get("/all-reels", getAllReels);
router.get("/:id", getReelById);
router.delete("/:id", deleteReel);
router.put("/reorder", updateReelOrder);

export default router;

