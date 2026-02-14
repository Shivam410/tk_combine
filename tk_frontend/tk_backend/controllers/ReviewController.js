import { Review } from "../models/reviewModel.js";
import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";

import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import mongoose from "mongoose";

// CREATE REVIEW
export const createReview = catchAsyncError(async (req, res, next) => {
  const { name, review } = req.body;

  if (!name || !review || !req.file) {
    return next(new ErrorHandler("All fields are required!", 400));
  }

  let imageUrl;

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "tk_production_film/review_images",
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

  const reviewData = await Review.create({
    name,
    review,
    image: imageUrl,
  });

  res.status(201).json({
    success: true,
    message: "Review created successfully",
    reviewData,
  });
});

// GET ALL REVIEW
export const getAllReviews = catchAsyncError(async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    reviews,
  });
});

// GET SINGLE REVIEW
export const getReviewById = catchAsyncError(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorHandler("Review not found", 404));
  }

  res.status(200).json({
    success: true,
    review,
  });
});

// UPDATE REVIEW

export const updateReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const { name, review } = req.body;

  const reviewData = await Review.findById(id);

  if (!reviewData) {
    return next(new ErrorHandler(" Review not found!", 404));
  }

  let imageUrl = reviewData.image;

  if (req.file) {
    try {
      const oldImagePublicId = reviewData.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(
        `tk_production_film/review_images/${oldImagePublicId}`
      );

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "tk_production_film/review_images",
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
  }

  reviewData.name = name || reviewData.name;
  reviewData.review = review || reviewData.review;
  reviewData.image = imageUrl;

  await reviewData.save();

  res.status(200).json({
    success: true,
    message: "Review updated successfully!",
    reviewData,
  });
});

// DELETE REVIEW

export const deleteReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorHandler("Invalid ID format!", 400);
  }

  const reviewData = await Review.findById(id);

  if (!reviewData) {
    return next(new ErrorHandler("Review not found!", 404));
  }

  const imageUrl = reviewData.image;

  if (imageUrl) {
    const publicId = imageUrl.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy(
      `tk_production_film/review_images/${publicId}`
    );
  }

  await reviewData.deleteOne();

  res.status(200).json({
    success: true,
    message: "Review deleted successfully!",
  });
});
