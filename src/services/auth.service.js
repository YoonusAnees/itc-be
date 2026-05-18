import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";

export const registerService = async ({ name, email, password , role }) => {
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

  const token = generateToken(user._id);

  return {
    user,
    token,
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

  const token = generateToken(user._id);

  return {
    user,
    token,
  };
};

