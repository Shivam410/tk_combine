
import jwt from "jsonwebtoken";
import { Auth } from "../models/authModel.js";

export const isAuthenticated = async (req, res, next) => {

  const { token } = req.cookies;

  if (!token) {
    return res.status(404).json({
      success: false,
      message: "Login First",
    });
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await Auth.findById(decode._id);
  next();
};
