import express from "express";
import {
  deletePackage,
  getAllPackages,
  getPackageById,
  newPackage,
  updatePackage,
} from "../controllers/PackageController.js";

import upload from "../middlewares/multer.js";

const router = express.Router();

router.get("/", getAllPackages);
router.post("/", upload.single("image"), newPackage);
router.get("/:id", getPackageById);
router.put("/:id", upload.single("image"), updatePackage);
router.delete("/:id", deletePackage);

export default router;