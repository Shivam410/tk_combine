import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
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

export const Video2 = mongoose.model("Video2", videoSchema);
