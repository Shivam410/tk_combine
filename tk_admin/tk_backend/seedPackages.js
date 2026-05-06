import mongoose from "mongoose";
import { config } from "dotenv";
import { Package } from "./models/packageModel.js";

config({ path: "./data/config.env" });

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("DB Connected for seeding packages");
};

const seedPackages = async () => {
  try {
    await connectDB();

    const count = await Package.countDocuments();
    if (count > 0) {
      console.log(`Packages already exist (${count}). Skipping seed.`);
      return;
    }

    await Package.insertMany([
      {
        title: "Silver Package",
        descriptionBlocks: ["Perfect for small ceremonies.", "Best value starter package."],
        includes: ["2 Photographers", "1 Cinematographer", "Raw data delivery"],
        priceText: "Starts at Rs. 49,999",
        order: 1,
      },
      {
        title: "Gold Package",
        descriptionBlocks: ["Ideal for full-day coverage.", "Cinematic highlight film included."],
        includes: ["2 Photographers", "2 Cinematographers", "Album + Teaser reel"],
        priceText: "Starts at Rs. 89,999",
        order: 2,
      },
    ]);

    console.log("Seeded sample packages.");
  } catch (error) {
    console.error("Package seeding error:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedPackages();

