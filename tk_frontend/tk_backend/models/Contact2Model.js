import mongoose from "mongoose";

const contact2Schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(v);
        },
        message: "Please enter a valid email address.",
      },
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    servicesNeeded: {
      type: [String],
      required: true,
    },
    weddingType: {
      type: String,
      required: true,
    },
    howDidYouHear: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Contact2 = mongoose.model("Contact2", contact2Schema);
