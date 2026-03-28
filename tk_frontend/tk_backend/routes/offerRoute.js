import express from "express";
import {
  createOffer,
  deleteOffer,
  getAllOffers,
  getOfferById,
  getOffersByServiceSlug,
  updateOffer,
} from "../controllers/OfferController.js";

const router = express.Router();

router.get("/", getAllOffers);
router.get("/service/:serviceSlug", getOffersByServiceSlug);
router.get("/:id", getOfferById);
router.post("/new", createOffer);
router.post("/", createOffer);
router.put("/:id", updateOffer);
router.delete("/:id", deleteOffer);

export default router;
