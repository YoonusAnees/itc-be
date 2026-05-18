import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);


export default router;