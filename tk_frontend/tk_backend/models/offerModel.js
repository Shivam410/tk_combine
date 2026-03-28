import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
      trim: true,
    },
    serviceSlug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    offerTitle: {
      type: String,
      required: true,
      trim: true,
    },
    offerDescription: {
      type: String,
      required: true,
      trim: true,
    },
    offerPrice: {
      type: String,
      default: "",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

offerSchema.index({ serviceSlug: 1, isActive: 1, createdAt: -1 });

export const Offer = mongoose.model("Offer", offerSchema);
