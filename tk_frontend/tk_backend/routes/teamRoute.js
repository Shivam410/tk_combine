import express from "express";

import {
  deleteTeam,
  getAllTeams,
  getSingleTeam,
  newTeam,
  updateTeam,
} from "../controllers/TeamController.js";

import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/new-team", upload.single("image"), newTeam);
router.get("/all-teams", getAllTeams);

router.get("/:id", getSingleTeam);

router.put("/:id", upload.single("image"), updateTeam);

router.delete("/:id", deleteTeam);

export default router;
