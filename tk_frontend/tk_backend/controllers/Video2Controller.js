import { Video2 } from "../models/video2Model.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";

// CREATE VIDEO
export const createVideo = catchAsyncError(async (req, res, next) => {
  const { link } = req.body;

  if (!link) {
    return next(new ErrorHandler("Valid YouTube link is required!", 400));
  }

  const newVideo = await Video2.create({ link });

  res.status(201).json({
    success: true,
    message: "Video link added successfully",
    video: newVideo,
  });
});

// GET ALL

export const getAllVideos = catchAsyncError(async (req, res) => {
  const videos = await Video2.find().sort({ sortOrder: 1 });

  res.status(200).json({
    success: true,
    videos,
  });
});

// GET SINLGE
export const getVideoById = catchAsyncError(async (req, res, next) => {
  const video = await Video2.findById(req.params.id);

  if (!video) {
    return next(new ErrorHandler("Video not found", 404));
  }

  res.status(200).json({
    success: true,
    video,
  });
});

// DELETE VIDE

export const deleteVideo = catchAsyncError(async (req, res, next) => {
  const video = await Video2.findById(req.params.id);

  if (!video) {
    return next(new ErrorHandler("Video not found", 404));
  }

  await video.deleteOne();

  res.status(200).json({
    success: true,
    message: "Video deleted successfully",
  });
});


export const updateVideoOrder2 = catchAsyncError(async (req, res) => {

  const { orderedIds } = req.body;

  for (let i = 0; i < orderedIds.length; i++) {
    await Video2.findByIdAndUpdate(orderedIds[i], { sortOrder: i });
  }

  res.status(200).json({
    success: true,
    message: "Order updated successfully",
  });
  
});
