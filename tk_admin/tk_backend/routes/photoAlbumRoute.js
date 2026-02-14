import express from "express";
import {
  deletePhotoAlbum,
  getAllPhotoAlbums,
  getSinglePhotoAlbum,
  newPhotoAlbum,
} from "../controllers/PhotoAlbumController.js";

import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/new-photo-album", upload.single("image"), newPhotoAlbum);

router.get("/all-photo-album", getAllPhotoAlbums);

router.get("/:id", getSinglePhotoAlbum);

router.delete("/:id", deletePhotoAlbum);

export default router;
