import express from "express";
import {
  deleteService,
  getAllServicesImg,
  getServiceBySlug,
  getServicesImg,
  newServicesImg,
  updateServicesImg,
} from "../controllers/ServicesController.js";

import upload from "../middlewares/multer.js";

const router = express.Router();

router.get("/", getAllServicesImg);

// Generic dynamic endpoints
router.post("/new", upload.array("images"), newServicesImg);
router.get("/by-id/:id", getServicesImg);
router.delete("/by-id/:id", deleteService);
router.put("/:id", upload.array("images"), updateServicesImg);
router.delete("/:id", deleteService);
router.get("/:slug", getServiceBySlug);

// Legacy endpoints (kept for backward compatibility)
router.post("/new/wedding-photography", upload.array("images"), newServicesImg);
router.get("/wedding-photography/:id", getServicesImg);
router.put("/wedding-photography/:id", upload.array("images"), updateServicesImg);

router.post("/new/wedding-cinematography", upload.array("images"), newServicesImg);
router.get("/wedding-cinematography/:id", getServicesImg);
router.put("/wedding-cinematography/:id", upload.array("images"), updateServicesImg);

router.post("/new/pre-wedding-film", upload.array("images"), newServicesImg);
router.get("/pre-wedding-film/:id", getServicesImg);
router.put("/pre-wedding-film/:id", upload.array("images"), updateServicesImg);

router.post("/new/pre-wedding-photography", upload.array("images"), newServicesImg);
router.get("/pre-wedding-photography/:id", getServicesImg);
router.put("/pre-wedding-photography/:id", upload.array("images"), updateServicesImg);

router.post("/new/civil-marriage-photography", upload.array("images"), newServicesImg);
router.get("/civil-marriage-photography/:id", getServicesImg);
router.put("/civil-marriage-photography/:id", upload.array("images"), updateServicesImg);

router.post(
  "/new/engagement-photography-couple-portraits",
  upload.array("images"),
  newServicesImg
);
router.get("/engagement-photography-couple-portraits/:id", getServicesImg);
router.put(
  "/engagement-photography-couple-portraits/:id",
  upload.array("images"),
  updateServicesImg
);

router.post("/new/birthday-photography", upload.array("images"), newServicesImg);
router.get("/birthday-photography/:id", getServicesImg);
router.put("/birthday-photography/:id", upload.array("images"), updateServicesImg);

router.post("/new/baby-shower-photography", upload.array("images"), newServicesImg);
router.get("/baby-shower-photography/:id", getServicesImg);
router.put("/baby-shower-photography/:id", upload.array("images"), updateServicesImg);

router.post("/new/graduation-photography", upload.array("images"), newServicesImg);
router.get("/graduation-photography/:id", getServicesImg);
router.put("/graduation-photography/:id", upload.array("images"), updateServicesImg);

export default router;
