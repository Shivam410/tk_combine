import mongoose from "mongoose";

const driveLinkSchema = new mongoose.Schema(
  {
    thumbnail: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const DriveLink = mongoose.model("DriveLink", driveLinkSchema);

