import mongoose from "mongoose";

const reelSchema = new mongoose.Schema(
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

export const Reel = mongoose.model("Reel", reelSchema);

