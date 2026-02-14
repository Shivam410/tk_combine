import mongoose from "mongoose";

const photoAlbumSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const PhotoAlbum = mongoose.model("PhotoAlbum", photoAlbumSchema);
