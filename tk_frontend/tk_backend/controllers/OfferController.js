import mongoose from "mongoose";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Offer } from "../models/offerModel.js";
import { Service } from "../models/servicesModel.js";

const slugify = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const resolveServiceMeta = async ({ serviceId, serviceName, serviceSlug }) => {
  if (!serviceId || !mongoose.Types.ObjectId.isValid(serviceId)) {
    throw new ErrorHandler("Valid serviceId is required", 400);
  }

  const service = await Service.findById(serviceId);
  if (!service) {
    throw new ErrorHandler("Service not found", 404);
  }

  return {
    serviceId: service._id,
    serviceName: serviceName?.trim?.() || service.serviceName,
    serviceSlug: serviceSlug?.trim?.() || slugify(service.serviceName),
  };
};

export const createOffer = catchAsyncError(async (req, res, next) => {
  const { serviceId, serviceName, serviceSlug, offerTitle, offerDescription, offerPrice, isActive } =
    req.body;

  if (!offerTitle?.trim()) {
    return next(new ErrorHandler("Offer title is required", 400));
  }
  if (!offerDescription?.trim()) {
    return next(new ErrorHandler("Offer description is required", 400));
  }

  const serviceMeta = await resolveServiceMeta({ serviceId, serviceName, serviceSlug });

  const offer = await Offer.create({
    ...serviceMeta,
    offerTitle: offerTitle.trim(),
    offerDescription: offerDescription.trim(),
    offerPrice: offerPrice?.toString?.().trim?.() || "",
    isActive: typeof isActive === "boolean" ? isActive : true,
  });

  res.status(201).json({
    success: true,
    message: "Offer created successfully",
    offer,
  });
});

export const getAllOffers = catchAsyncError(async (req, res) => {
  const { serviceSlug, serviceId, active } = req.query;
  const filter = {};

  if (serviceSlug) {
    filter.serviceSlug = slugify(serviceSlug);
  }
  if (serviceId && mongoose.Types.ObjectId.isValid(serviceId)) {
    filter.serviceId = serviceId;
  }
  if (active === "true") {
    filter.isActive = true;
  }
  if (active === "false") {
    filter.isActive = false;
  }

  const offers = await Offer.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: offers.length,
    offers,
  });
});

export const getOfferById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid offer ID", 400));
  }

  const offer = await Offer.findById(id);
  if (!offer) {
    return next(new ErrorHandler("Offer not found", 404));
  }

  res.status(200).json({
    success: true,
    offer,
  });
});

export const getOffersByServiceSlug = catchAsyncError(async (req, res) => {
  const serviceSlug = slugify(req.params.serviceSlug || "");
  const offers = await Offer.find({ serviceSlug }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: offers.length,
    offers,
  });
});

export const updateOffer = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid offer ID", 400));
  }

  const offer = await Offer.findById(id);
  if (!offer) {
    return next(new ErrorHandler("Offer not found", 404));
  }

  const { serviceId, serviceName, serviceSlug, offerTitle, offerDescription, offerPrice, isActive } =
    req.body;

  if (offerTitle !== undefined && !String(offerTitle).trim()) {
    return next(new ErrorHandler("Offer title cannot be empty", 400));
  }
  if (offerDescription !== undefined && !String(offerDescription).trim()) {
    return next(new ErrorHandler("Offer description cannot be empty", 400));
  }

  if (serviceId) {
    const serviceMeta = await resolveServiceMeta({ serviceId, serviceName, serviceSlug });
    offer.serviceId = serviceMeta.serviceId;
    offer.serviceName = serviceMeta.serviceName;
    offer.serviceSlug = serviceMeta.serviceSlug;
  } else {
    if (serviceName !== undefined) offer.serviceName = String(serviceName).trim();
    if (serviceSlug !== undefined) offer.serviceSlug = slugify(serviceSlug);
  }

  if (offerTitle !== undefined) offer.offerTitle = String(offerTitle).trim();
  if (offerDescription !== undefined) offer.offerDescription = String(offerDescription).trim();
  if (offerPrice !== undefined) offer.offerPrice = String(offerPrice).trim();
  if (isActive !== undefined) offer.isActive = Boolean(isActive);

  await offer.save();

  res.status(200).json({
    success: true,
    message: "Offer updated successfully",
    offer,
  });
});

export const deleteOffer = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid offer ID", 400));
  }

  const offer = await Offer.findById(id);
  if (!offer) {
    return next(new ErrorHandler("Offer not found", 404));
  }

  await offer.deleteOne();

  res.status(200).json({
    success: true,
    message: "Offer deleted successfully",
  });
});
