import {
  registerService,
  loginService,
} from "../services/auth.service.js";

export const register = async (req, res ) => {
  try {
    const { name, email, password ,role  } = req.body;
    const result = await registerService({ name, email, password ,role });

    res.status(201).json({
      success: true,
      message: "Registered successfully",
      token: result.token,
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

    res.json({
      success: true,
      message: "Login successful",
      token: result.token,
      data: result.user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

