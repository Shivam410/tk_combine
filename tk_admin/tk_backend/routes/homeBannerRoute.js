import express from "express";
import {
  deleteHomeBanner,
  getAllHomeBanner,
  getSingleHomeBanner,
  newHomeBanner,
} from "../controllers/HomeBannerController.js";


import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/new-home-banner",  upload.single("image"), newHomeBanner);

router.get("/all-home-banners", getAllHomeBanner);

router.get("/:id", getSingleHomeBanner);


router.delete("/:id", deleteHomeBanner);

export default router;
