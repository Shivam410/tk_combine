import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Team } from "../models/teamModel.js";
import ErrorHandler from "../utils/errorHandler.js";

import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import mongoose from "mongoose";

export const newTeam = catchAsyncError(async (req, res, next) => {
  const { name, title } = req.body;

  if (!name || !title || !req.file) {
    return next(new ErrorHandler("All fields are required!", 400));
  }

  let imageUrl;

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "tk_production_film/team_images",
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

  const newTeam = await Team.create({
    name,
    title,
    image: imageUrl,
  });

  res.status(201).json({
    success: true,
    message: "Team member added successfully!",
    team: newTeam,
  });
});

// GET SINGLE TEAM

export const getSingleTeam = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const team = await Team.findById(id);

  if (!team) {
    return next(new ErrorHandler("Team not found!", 404));
  }

  res.status(200).json({
    success: true,
    team,
  });
});

// GET All Team

export const getAllTeams = catchAsyncError(async (req, res, next) => {
  const teams = await Team.find();

  res.status(200).json({
    success: true,
    teams,
  });
});

// UPDATE TEAM

export const updateTeam = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const { name, title } = req.body;

  const team = await Team.findById(id);

  if (!team) {
    return next(new ErrorHandler("Team member not found!", 404));
  }

  let imageUrl = team.image;

  if (req.file) {
    try {
      const oldImagePublicId = team.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(
        `tk_production_film/team_images/${oldImagePublicId}`
      );

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "tk_production_film/team_images",
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

  team.name = name || team.name;
  team.title = title || team.title;
  team.image = imageUrl;

  await team.save();

  res.status(200).json({
    success: true,
    message: "Team member updated successfully!",
    team,
  });
});

// DELETE TEAM

export const deleteTeam = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorHandler("Invalid ID format!", 400);
  }

  const team = await Team.findById(id);

  if (!team) {
    return next(new ErrorHandler("Team not found!", 404));
  }

  const imageUrl = team.image;

  if (imageUrl) {
    const publicId = imageUrl.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy(
      `tk_production_film/team_images/${publicId}`
    );
  }

  await team.deleteOne();

  res.status(200).json({
    success: true,
    message: "Team member deleted successfully!",
  });
});
