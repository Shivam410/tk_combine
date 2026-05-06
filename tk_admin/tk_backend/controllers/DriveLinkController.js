import { DriveLink } from "../models/driveLinkModel.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import mongoose from "mongoose";

export const createDriveLink = catchAsyncError(async (req, res, next) => {
  const { link } = req.body;

  if (!req.file) {
    return next(new ErrorHandler("Thumbnail image is required!", 400));
  }

  if (!link || !String(link).trim()) {
    return next(new ErrorHandler("Valid Google Drive link is required!", 400));
  }

  let thumbnailUrl;

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "tk_production_film/drive_links_thumbnails",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    thumbnailUrl = result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new ErrorHandler("Failed to upload image to Cloudinary", 500);
  }

  const driveLink = await DriveLink.create({
    thumbnail: thumbnailUrl,
    link: String(link).trim(),
  });

  res.status(201).json({
    success: true,
    message: "Drive link added successfully",
    driveLink,
  });
});

export const getAllDriveLinks = catchAsyncError(async (req, res) => {
  const driveLinks = await DriveLink.find().sort({ sortOrder: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    driveLinks,
  });
});

export const deleteDriveLink = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorHandler("Invalid ID format!", 400);
  }

  const driveLink = await DriveLink.findById(id);

  if (!driveLink) {
    return next(new ErrorHandler("Drive link not found", 404));
  }

  const imageUrl = driveLink.thumbnail;
  if (imageUrl) {
    const publicId = imageUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`tk_production_film/drive_links_thumbnails/${publicId}`);
  }

  await driveLink.deleteOne();

  res.status(200).json({
    success: true,
    message: "Drive link deleted successfully",
  });
});

export const updateDriveLinkOrder = catchAsyncError(async (req, res, next) => {
  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds)) {
    return next(new ErrorHandler("orderedIds must be an array", 400));
  }

  for (let i = 0; i < orderedIds.length; i++) {
    await DriveLink.findByIdAndUpdate(orderedIds[i], { sortOrder: i });
  }

  res.status(200).json({
    success: true,
    message: "Order updated successfully",
  });
});
