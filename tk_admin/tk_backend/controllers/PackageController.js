import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Package } from "../models/packageModel.js";
import ErrorHandler from "../utils/errorHandler.js";

import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import mongoose from "mongoose";

const normalizeStringArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    // Common when sent via FormData as a JSON string.
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed : [trimmed];
      } catch {
        return [trimmed];
      }
    }

    return [trimmed];
  }
  return [];
};

export const newPackage = catchAsyncError(async (req, res, next) => {
  const { title, descriptionBlocks, includes, priceText, order } = req.body;

  if (!title?.trim()) {
    return next(new ErrorHandler("Title is required!", 400));
  }

  let imageUrl = "";

  if (req.file) {
    try {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "tk_production_film/packages",
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

  const newPackage = await Package.create({
    title: title.trim(),
    descriptionBlocks: normalizeStringArray(descriptionBlocks).filter((block) =>
      block?.trim()
    ),
    includes: normalizeStringArray(includes).filter((item) => item?.trim()),
    priceText: priceText?.trim() || "",
    image: imageUrl,
    order: Number(order) || 0,
  });

  res.status(201).json({
    success: true,
    message: "Package created successfully!",
    package: newPackage,
  });
});

export const getAllPackages = catchAsyncError(async (req, res, next) => {
  const packages = await Package.find().sort({ order: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    packages,
  });
});

export const getPackageById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid package ID!", 400));
  }

  const packageData = await Package.findById(id);

  if (!packageData) {
    return next(new ErrorHandler("Package not found!", 404));
  }

  res.status(200).json({
    success: true,
    package: packageData,
  });
});

export const updatePackage = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid package ID!", 400));
  }

  const packageData = await Package.findById(id);

  if (!packageData) {
    return next(new ErrorHandler("Package not found!", 404));
  }

  const { title, descriptionBlocks, includes, priceText, order } = req.body;

  if (title !== undefined && !title?.trim()) {
    return next(new ErrorHandler("Title cannot be empty!", 400));
  }

  let imageUrl = packageData.image;

  if (req.file) {
    try {
      // Delete old image if exists
      if (packageData.image) {
        const oldImagePublicId = packageData.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`tk_production_film/packages/${oldImagePublicId}`);
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "tk_production_film/packages",
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

  packageData.title = title?.trim() || packageData.title;
  if (descriptionBlocks !== undefined) {
    packageData.descriptionBlocks = normalizeStringArray(descriptionBlocks).filter(
      (block) => block?.trim()
    );
  }
  if (includes !== undefined) {
    packageData.includes = normalizeStringArray(includes).filter((item) =>
      item?.trim()
    );
  }
  packageData.priceText = priceText?.trim() || packageData.priceText;
  packageData.image = imageUrl;
  if (order !== undefined) {
    const parsedOrder = Number(order);
    if (!Number.isNaN(parsedOrder)) {
      packageData.order = parsedOrder;
    }
  }

  await packageData.save();

  res.status(200).json({
    success: true,
    message: "Package updated successfully!",
    package: packageData,
  });
});

export const deletePackage = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid package ID!", 400));
  }

  const packageData = await Package.findById(id);

  if (!packageData) {
    return next(new ErrorHandler("Package not found!", 404));
  }

  // Delete image from Cloudinary if exists
  if (packageData.image) {
    const publicId = packageData.image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`tk_production_film/packages/${publicId}`);
  }

  await packageData.deleteOne();

  res.status(200).json({
    success: true,
    message: "Package deleted successfully!",
  });
});
