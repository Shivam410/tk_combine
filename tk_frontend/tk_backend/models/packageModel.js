import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    descriptionBlocks: {
      type: [String],
      default: [],
    },
    includes: {
      type: [String],
      default: [],
    },
    priceText: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "packages",
  }
);

export const Package = mongoose.model("Package", packageSchema);