import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m",
  });
};

export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

export const refreshTokenExpiryMs = () => {
  const days = parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || "30", 10);
  return days * 24 * 60 * 60 * 1000;
};
