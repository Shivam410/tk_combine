import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { errorMiddleware } from "./middlewares/error.js";
import authRouter from "./routes/authRoute.js";
import homeBannerRouter from "./routes/homeBannerRoute.js";
import contactRouter from "./routes/contactRoute.js";
import portfolioRouter from "./routes/portfolioRoute.js";
import teamRouter from "./routes/teamRoute.js";
import contact2Router from "./routes/contact2Route.js";
import visitorRouter from "./routes/visiterRoute.js";
import photoAlbumRouter from "./routes/photoAlbumRoute.js";

import ServicesRouter from "./routes/servicesRoute.js";

import mobileRouter from "./routes/mobileRoute.js";

import reviewRouter from "./routes/reviewRoute.js";

import video1Router from "./routes/video1Route.js";
import video2Router from "./routes/video2Route.js";
import offerRouter from "./routes/offerRoute.js";




// Initialize Express app
export const app = express();

// Load environment variables
config({
  path: "./data/config.env",
});

const allowedOrigins = [
  "https://tk-combine.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5000",
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());



// Routes
app.use("/api/auth", authRouter);
app.use("/api/home-banner", homeBannerRouter);
app.use("/api/contact", contactRouter);
app.use("/api/portfolio", portfolioRouter);
app.use("/api/team", teamRouter);

app.use("/api/contact2", contact2Router);
app.use("/api/visitors", visitorRouter);
app.use("/api/photoAlbum", photoAlbumRouter);
app.use("/api/services", ServicesRouter);

app.use("/api/mobile", mobileRouter);
app.use("/api/review", reviewRouter);

app.use("/api/wedding-cinematography", video1Router);
app.use("/api/pre-wedding-film", video2Router);
app.use("/api/offers", offerRouter);
app.use("/api/special-offers", offerRouter);




app.get("/", (req, res) => {
  res.send("Welcome to Project 3");
});

// Error Middleware
app.use(errorMiddleware);
