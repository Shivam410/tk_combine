import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import MobileBanner from "../models/mobileModel.js";
import ErrorHandler from "../utils/errorHandler.js";

import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import mongoose from "mongoose";

export const newMobileBanner = catchAsyncError(async (req, res, next) => {
  if (!req.file) {
    throw new ErrorHandler("image is required!", 400);
  }

  let imageUrl;

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "tk_production_film/mobileBanner_images",
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

  const homeBanner = await MobileBanner.create({
    image: imageUrl,
  });

  res.status(201).json({
    success: true,
    message: "Home Banner added successfully!",
    homeBanner,
  });
});

// GET SINGLE homeBanner

export const getSingleMobileBanner = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const homeBanner = await MobileBanner.findById(id);

  if (!homeBanner) {
    return next(new ErrorHandler("Home Banner not found!", 404));
  }

  res.status(200).json({
    success: true,
    homeBanner,
  });
});

// GET All homeBanner

export const getAllMobileBanner = catchAsyncError(async (req, res, next) => {
  const homeBanner = await MobileBanner.find();

  res.status(200).json({
    success: true,
    homeBanner,
  });
});

// DELETE homeBanner

export const deleteMobileBanner = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorHandler("Invalid ID format!", 400);
  }

  const homeBanner = await MobileBanner.findById(id);

  if (!homeBanner) {
    return next(new ErrorHandler("Home Banner not found!", 404));
  }

  const imageUrl = homeBanner.image;
  if (imageUrl) {
    const publicId = imageUrl.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy(
      `tk_production_film/mobileBanner_images/${publicId}`
    );
  }

  await homeBanner.deleteOne();

  res.status(200).json({
    success: true,
    message: "Home Banner deleted successfully!",
  });
});
