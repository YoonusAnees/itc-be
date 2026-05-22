import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken, refreshTokenExpiryMs } from "../utils/generateTokens.js";

export const registerService = async ({ name, email, password, role }) => {
  const exists = await User.findOne({ email });

  if (exists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "customer",
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken();
  const expiresAt = new Date(Date.now() + refreshTokenExpiryMs());

  user.refreshTokens.push({ token: refreshToken, expiresAt });
  await user.save();

  return {
    user,
    accessToken,
    refreshToken,
    refreshExpiresAt: expiresAt,
  };
};

export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken();
  const expiresAt = new Date(Date.now() + refreshTokenExpiryMs());

  user.refreshTokens.push({ token: refreshToken, expiresAt });
  await user.save();

  return {
    user,
    accessToken,
    refreshToken,
    refreshExpiresAt: expiresAt,
  };
};

export const rotateRefreshToken = async (oldToken) => {
  const user = await User.findOne({ "refreshTokens.token": oldToken });
  if (!user) throw new Error("Invalid refresh token");

  // remove the old token
  user.refreshTokens = user.refreshTokens.filter((t) => t.token !== oldToken);

  // create a new refresh token
  const newRefreshToken = generateRefreshToken();
  const expiresAt = new Date(Date.now() + refreshTokenExpiryMs());
  user.refreshTokens.push({ token: newRefreshToken, expiresAt });

  await user.save();

  const accessToken = generateAccessToken(user._id);

  return { user, accessToken, refreshToken: newRefreshToken, refreshExpiresAt: expiresAt };
};

export const revokeRefreshToken = async (token) => {
  const user = await User.findOne({ "refreshTokens.token": token });
  if (!user) return;

  user.refreshTokens = user.refreshTokens.filter((t) => t.token !== token);
  await user.save();
};
