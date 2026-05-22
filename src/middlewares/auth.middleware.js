import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    // Prefer cookie-based token for browser clients
    const cookieToken = req.cookies?.accessToken;
    let token = null;

    if (cookieToken) token = cookieToken;
    else if (req.headers.authorization) token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};