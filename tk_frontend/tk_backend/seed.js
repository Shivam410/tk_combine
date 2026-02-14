import mongoose from "mongoose";
import { Auth } from "./models/authModel.js";
import { config } from "dotenv";

config({ path: "./tk_backend/data/config.env" });

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("DB Connected for seeding");
};

const seedUser = async () => {
  try {
    await connectDB();

    // Check if user already exists
    const existingUser = await Auth.findOne({ email: "admin@gmail.com" });
    if (existingUser) {
      console.log("User already exists");
      return;
    }

    // Create user with valid password (Admin123! meets requirements)
    const user = await Auth.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: "Admin123!", // This meets: uppercase, number, special char
    });

    console.log("User created:", user.email);
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedUser();