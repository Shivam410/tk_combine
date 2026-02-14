import express from "express";
import {
  deletePortfolio,
  getAllPortfolios,
  getSinglePortfolio,
  newPortfolio,
} from "../controllers/PortfolioController.js";

import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/new-portfolio", upload.single("image"), newPortfolio);

router.get("/all-portfolios", getAllPortfolios);

router.get("/:id", getSinglePortfolio);


router.delete("/:id", deletePortfolio);

export default router;
