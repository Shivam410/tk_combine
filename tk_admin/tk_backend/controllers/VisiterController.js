import VisitorCount from "../models/visitorModel.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";

// Increment visitor count
export const incrementVisitor = catchAsyncError(async (req, res, next) => {
  let visitorData = await VisitorCount.findOne();

  if (!visitorData) {
    visitorData = await VisitorCount.create({ count: 1 });
  } else {
    visitorData.count += 1;
    await visitorData.save();
  }

  res.status(200).json({
    success: true,
    message: "Visitor count updated!",
    count: visitorData.count,
  });
});

// Get visitor count
export const getVisitorCount = catchAsyncError(async (req, res, next) => {
  const visitorData = await VisitorCount.findOne();

  if (!visitorData) {
    return next(new ErrorHandler("Visitor data not found!", 404));
  }

  res.status(200).json({
    success: true,
    count: visitorData.count,
  });
});
