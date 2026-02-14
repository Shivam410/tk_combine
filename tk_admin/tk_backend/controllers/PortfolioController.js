import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Portfolio } from "../models/portfolioModel.js";
import ErrorHandler from "../utils/errorHandler.js";

import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import mongoose from "mongoose";

export const newPortfolio = catchAsyncError(async (req, res, next) => {
  if (!req.file) {
    throw new ErrorHandler("image is required!", 400);
  }

  let imageUrl;

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "tk_production_film/portfolio_images",
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

  const portfolio = await Portfolio.create({
    image: imageUrl,
  });

  res.status(201).json({
    success: true,
    message: "Portfolio added successfully!",
    portfolio,
  });
});

// GET SINGLE PORTFOLIO

export const getSinglePortfolio = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const portfolio = await Portfolio.findById(id);

  if (!portfolio) {
    return next(new ErrorHandler("Portfolio not found!", 404));
  }

  res.status(200).json({
    success: true,
    portfolio,
  });
});

// GET All PORTFOLIO

export const getAllPortfolios = catchAsyncError(async (req, res, next) => {
  const portfolios = await Portfolio.find();

  res.status(200).json({
    success: true,
    portfolios,
  });
});

// DELETE PORTFOLIO

export const deletePortfolio = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorHandler("Invalid ID format!", 400);
  }

  const portfolio = await Portfolio.findById(id);

  if (!portfolio) {
    return next(new ErrorHandler("Portfolio not found!", 404));
  }

  const imageUrl = portfolio.image;
  if (imageUrl) {
    const publicId = imageUrl.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy(
      `tk_production_film/portfolio_images/${publicId}`
    );
  }

  await portfolio.deleteOne();

  res.status(200).json({
    success: true,
    message: "Portfolio deleted successfully!",
  });
});
