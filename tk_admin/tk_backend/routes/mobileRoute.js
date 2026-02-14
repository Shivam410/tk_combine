import express from "express";
import {
  deleteMobileBanner,
  getAllMobileBanner,
  getSingleMobileBanner,
  newMobileBanner,
} from "../controllers/mobileController.js";

import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/new-mobile-banner", upload.single("image"), newMobileBanner);

router.get("/all-mobile-banners", getAllMobileBanner);

router.get("/:id", getSingleMobileBanner);

router.delete("/:id", deleteMobileBanner);

export default router;
