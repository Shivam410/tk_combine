import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Auth } from "../models/authModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendCookie } from "../utils/features.js";
import bcrypt from "bcrypt";

export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check for empty fields
  if (!name || !email || !password) {
    return next(new ErrorHandler("All fields are required!", 400));
  }

  // Check if the user already exists
  let existingUser = await Auth.findOne({ email });

  if (existingUser) return next(new ErrorHandler("User Already Exists", 400));

  // 🔹 Check if email is the admin's email
  const isAdmin = email === process.env.ADMIN_EMAIL;


  // Create a new user
  const user = await Auth.create({ name, email, password, isAdmin });

  sendCookie(user, res, "Registered Successfully", 201);
});


export const login = catchAsyncError(async (req, res, next) => {
   const { email, password } = req.body;

   try {
     const user = await Auth.findOne({ email }).select("+password");

     if (!user) {
       return next(new ErrorHandler("User Not Found With This Email", 400));
     }

     const isMatch = await bcrypt.compare(password, user.password);

     if (!isMatch) {
       return next(new ErrorHandler("Invalid Email or Password", 400));
     }

     // ✅ Ensure password is removed **only after** checking
     user.password = undefined;

     sendCookie(user, res, "Login Successfully", 200);
   } catch (error) {
     console.error("Login error:", error);
     return next(new ErrorHandler("Database connection error", 500));
   }
});




// LOGOUT 
export const logout = catchAsyncError(async (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Development" ? false : true,
    })
    .json({
      success: true,
      message: "Logout Successfully",
      user: req.user,
    });
});


// UPDATE PASSWORD
export const updatePassword = catchAsyncError(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new ErrorHandler("Both current and new passwords are required", 400));
  }

  if (!req.user?.id) {
    return next(new ErrorHandler("User not authenticated", 401));
  }

  const user = await Auth.findById(req.user.id).select("+password");

  if (!user) return next(new ErrorHandler("User not found!", 404));
  if (!user.password) return next(new ErrorHandler("Password not set", 400));

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) return next(new ErrorHandler("Invalid current password", 400));

  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    return next(new ErrorHandler("New password cannot be the same as the old one", 400));
  }

  // ✅ Ensure password is hashed only once before saving
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});




