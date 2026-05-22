import {
  registerService,
  loginService,
  rotateRefreshToken,
  revokeRefreshToken,
} from "../services/auth.service.js";

const cookieOptions = (maxAgeMs) => ({
  httpOnly: true,
  secure: process.env.ENFORCE_HTTPS === "true" || process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: maxAgeMs,
});

export const register = async (req, res ) => {
  try {
    const { name, email, password ,role  } = req.body;
    const result = await registerService({ name, email, password ,role });

    res.cookie("accessToken", result.accessToken, cookieOptions(15 * 60 * 1000));
    res.cookie("refreshToken", result.refreshToken, cookieOptions(result.refreshExpiresAt - Date.now()));

    res.status(201).json({
      success: true,
      message: "Registered successfully",
      data: result.user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginService(req.body);

    res.cookie("accessToken", result.accessToken, cookieOptions(15 * 60 * 1000));
    res.cookie("refreshToken", result.refreshToken, cookieOptions(result.refreshExpiresAt - Date.now()));

    res.json({
      success: true,
      message: "Login successful",
      data: result.user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const refresh = async (req, res) => {
  try {
    const oldRefresh = req.cookies?.refreshToken;
    if (!oldRefresh) throw new Error("No refresh token provided");

    const result = await rotateRefreshToken(oldRefresh);

    // set new cookies
    res.cookie("accessToken", result.accessToken, cookieOptions(15 * 60 * 1000));
    res.cookie("refreshToken", result.refreshToken, cookieOptions(result.refreshExpiresAt - Date.now()));

    res.json({ success: true, message: "Tokens rotated" });
  } catch (error) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(401).json({ success: false, message: error.message || "Unauthorized" });
  }
};

export const logout = async (req, res) => {
  try {
    const refresh = req.cookies?.refreshToken;
    if (refresh) await revokeRefreshToken(refresh);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ success: true, message: "Logged out" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
