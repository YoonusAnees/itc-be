import express from "express";

import {
  createQuote,
  getQuotes,
  getSingleQuote,
  updateQuoteStatus,
  deleteQuote,
} from "../controllers/quote.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post("/", createQuote);
router.get("/", protect, adminOnly, getQuotes);
router.get("/:id", protect, adminOnly, getSingleQuote);
router.patch("/:id/status", protect, adminOnly, updateQuoteStatus);
router.delete("/:id", protect, adminOnly, deleteQuote);

export default router;