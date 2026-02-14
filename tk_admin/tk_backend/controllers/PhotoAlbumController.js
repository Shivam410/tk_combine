
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { PhotoAlbum } from "../models/photoAlbumModel.js";

import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import mongoose from "mongoose";


export const newPhotoAlbum = catchAsyncError(async (req, res, next) => {
  if (!req.file) {
    throw new ErrorHandler("image is required!", 400);
  }

  let imageUrl;

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "tk_production_film/photoAlbum_images",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    imageUrl = result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new ErrorHandler("Failed to upload image to Cloudinary", 500);
  }

  const photoAlbum = await PhotoAlbum.create({
    image: imageUrl,
  });

  res.status(201).json({
    success: true,
    message: "Photo Album added successfully!",
    photoAlbum,
  });
});

// GET SINGLE photoAlbum

export const getSinglePhotoAlbum = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const photoAlbum = await PhotoAlbum.findById(id);

  if (!photoAlbum) {
    return next(new ErrorHandler("Photo Album not found!", 404));
  }

  res.status(200).json({
    success: true,
    photoAlbum,
  });
});

// GET All photoAlbum

export const getAllPhotoAlbums = catchAsyncError(async (req, res, next) => {

  const photoAlbum = await PhotoAlbum.find();

  res.status(200).json({
    success: true,
    photoAlbum,
  });
});

// DELETE photoAlbum

export const deletePhotoAlbum = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorHandler("Invalid ID format!", 400);
  }

  const photoAlbum = await PhotoAlbum.findById(id);

  if (!photoAlbum) {
    return next(new ErrorHandler("Photo Album not found!", 404));
  }

  const imageUrl = photoAlbum.image;
  if (imageUrl) {
    const publicId = imageUrl.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy(
      `tk_production_film/photoAlbum_images/${publicId}`
    );
  }

  await photoAlbum.deleteOne();

  res.status(200).json({
    success: true,
    message: "Photo Album deleted successfully!",
  });
});
