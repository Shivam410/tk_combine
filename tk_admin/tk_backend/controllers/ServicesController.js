import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Service } from "../models/servicesModel.js";
import ErrorHandler from "../utils/errorHandler.js";

import streamifier from "streamifier";
import cloudinary from "../utils/cloudinary.js";

const slugify = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeTextList = (value) => {
  if (!value) return [];
  const list = Array.isArray(value) ? value : [value];
  return list
    .flatMap((item) => String(item).split("\n"))
    .map((item) => item.trim())
    .filter(Boolean);
};

const findServiceBySlug = async (slug) => {
  const services = await Service.find();
  return services.find((service) => slugify(service.serviceName) === slug);
};

const hasDuplicateSlug = async (serviceName, ignoreId = null) => {
  const desiredSlug = slugify(serviceName);
  const services = await Service.find(ignoreId ? { _id: { $ne: ignoreId } } : {});
  return services.some((service) => slugify(service.serviceName) === desiredSlug);
};

// NEW SERVICE
export const newServicesImg = catchAsyncError(async (req, res, next) => {
  const { serviceName, description = "" } = req.body;

  if (!serviceName?.trim()) {
    return next(new ErrorHandler("Service name is required!", 400));
  }

  const duplicate = await hasDuplicateSlug(serviceName.trim());
  if (duplicate) {
    return next(new ErrorHandler("A service with this name already exists!", 409));
  }

  if (!req.files || req.files.length === 0) {
    return next(new ErrorHandler("At least one image is required!", 400));
  }

  const imageUrls = [];

  try {
    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "tk_production_film/service_images",
            transformation: [{ quality: "auto", fetch_format: "auto" }],
          },
          (error, uploadResult) => {
            if (error) reject(error);
            else resolve(uploadResult);
          }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
      });

      imageUrls.push(result.secure_url);
    }
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return next(new ErrorHandler("Failed to upload images to Cloudinary", 500));
  }

  const service = await Service.create({
    serviceName: serviceName.trim(),
    description: description?.trim?.() || "",
    whatWeOffer: normalizeTextList(req.body.whatWeOffer),
    howItWorks: normalizeTextList(req.body.howItWorks),
    images: imageUrls,
  });

  res.status(201).json({
    success: true,
    message: "Service created successfully!",
    service,
  });
});

// GET SERVICE BY SLUG
export const getServiceBySlug = catchAsyncError(async (req, res, next) => {
  const normalizedSlug = slugify(req.params.slug);
  const serviceImages = await findServiceBySlug(normalizedSlug);

  if (!serviceImages) {
    return next(new ErrorHandler("No service image found!", 404));
  }

  res.status(200).json({
    success: true,
    serviceImages,
  });
});

// GET SERVICE BY ID
export const getServicesImg = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const serviceImages = await Service.findById(id);

  if (!serviceImages) {
    return next(new ErrorHandler("No service image found!", 404));
  }

  res.status(200).json({
    success: true,
    serviceImages,
  });
});

// UPDATE SERVICE
export const updateServicesImg = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const service = await Service.findById(id);

  if (!service) {
    return next(new ErrorHandler("Service not found", 404));
  }

  const nextServiceName = (req.body.serviceName || service.serviceName || "").trim();
  if (!nextServiceName) {
    return next(new ErrorHandler("Service name is required!", 400));
  }

  const duplicate = await hasDuplicateSlug(nextServiceName, service._id);
  if (duplicate) {
    return next(new ErrorHandler("A service with this name already exists!", 409));
  }

  const imageUrls = [];

  if (req.files && req.files.length > 0) {
    try {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "tk_production_film/service_images",
              transformation: [{ quality: "auto", fetch_format: "auto" }],
            },
            (error, uploadResult) => {
              if (error) reject(error);
              else resolve(uploadResult);
            }
          );

          streamifier.createReadStream(file.buffer).pipe(stream);
        });

        imageUrls.push(result.secure_url);
      }
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return next(new ErrorHandler("Failed to upload images to Cloudinary", 500));
    }
  }

  if (req.body.images) {
    const existingImages = Array.isArray(req.body.images)
      ? req.body.images
      : [req.body.images];

    imageUrls.push(...existingImages);
  }

  service.serviceName = nextServiceName;
  service.description = (req.body.description ?? service.description ?? "").trim();
  service.whatWeOffer = normalizeTextList(req.body.whatWeOffer);
  service.howItWorks = normalizeTextList(req.body.howItWorks);
  service.images = imageUrls;

  await service.save();

  res.status(200).json({
    success: true,
    message: "Service updated successfully",
    data: service,
  });
});

// GET ALL SERVICES
export const getAllServicesImg = catchAsyncError(async (req, res, next) => {
  const services = await Service.find().sort({ createdAt: -1 });

  if (!services || services.length === 0) {
    return next(new ErrorHandler("No services found!", 404));
  }

  const normalizedServices = services.map((service) => ({
    ...service.toObject(),
    slug: slugify(service.serviceName),
  }));

  res.status(200).json({
    success: true,
    count: normalizedServices.length,
    services: normalizedServices,
  });
});

// DELETE SERVICE
export const deleteService = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const service = await Service.findById(id);

  if (!service) {
    return next(new ErrorHandler("Service not found", 404));
  }

  // Best-effort cleanup of cloud images.
  for (const imageUrl of service.images || []) {
    try {
      const uploadIndex = imageUrl.indexOf("/upload/");
      if (uploadIndex === -1) continue;
      const pathAfterUpload = imageUrl.slice(uploadIndex + "/upload/".length);
      const publicPath = pathAfterUpload.split("/").slice(1).join("/").split(".")[0];
      if (publicPath) {
        await cloudinary.uploader.destroy(publicPath);
      }
    } catch (imageError) {
      console.error("Cloudinary delete warning:", imageError?.message || imageError);
    }
  }

  await service.deleteOne();

  res.status(200).json({
    success: true,
    message: "Service deleted successfully",
  });
});
