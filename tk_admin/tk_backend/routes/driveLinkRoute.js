import express from "express";
import {
  createDriveLink,
  deleteDriveLink,
  getAllDriveLinks,
  updateDriveLinkOrder,
} from "../controllers/DriveLinkController.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/new", upload.single("image"), createDriveLink);
router.get("/all", getAllDriveLinks);
router.delete("/:id", deleteDriveLink);
router.put("/reorder", updateDriveLinkOrder);

export default router;
