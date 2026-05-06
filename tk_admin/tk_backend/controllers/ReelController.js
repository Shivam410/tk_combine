import { Reel } from "../models/reelModel.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";

export const createReel = catchAsyncError(async (req, res, next) => {
  const { link } = req.body;

  if (!link || !String(link).trim()) {
    return next(new ErrorHandler("Valid reel link is required!", 400));
  }

  const newReel = await Reel.create({ link: String(link).trim() });

  res.status(201).json({
    success: true,
    message: "Reel link added successfully",
    reel: newReel,
  });
});

export const getAllReels = catchAsyncError(async (req, res) => {
  const reels = await Reel.find().sort({ sortOrder: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    reels,
  });
});

export const getReelById = catchAsyncError(async (req, res, next) => {
  const reel = await Reel.findById(req.params.id);

  if (!reel) {
    return next(new ErrorHandler("Reel not found", 404));
  }

  res.status(200).json({
    success: true,
    reel,
  });
});

export const deleteReel = catchAsyncError(async (req, res, next) => {
  const reel = await Reel.findById(req.params.id);

  if (!reel) {
    return next(new ErrorHandler("Reel not found", 404));
  }

  await reel.deleteOne();

  res.status(200).json({
    success: true,
    message: "Reel deleted successfully",
  });
});

export const updateReelOrder = catchAsyncError(async (req, res, next) => {
  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds)) {
    return next(new ErrorHandler("orderedIds must be an array", 400));
  }

  for (let i = 0; i < orderedIds.length; i++) {
    await Reel.findByIdAndUpdate(orderedIds[i], { sortOrder: i });
  }

  res.status(200).json({
    success: true,
    message: "Order updated successfully",
  });
});

