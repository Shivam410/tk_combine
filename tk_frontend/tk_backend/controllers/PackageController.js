import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Package } from "../models/packageModel.js";

export const getAllPackages = catchAsyncError(async (req, res, next) => {
  const packages = await Package.find().sort({ order: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    packages,
  });
});