import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

import {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, upload.array("images", 10), createProduct);
router.get("/", getProducts);
router.get("/:slug", getSingleProduct);
router.put("/:id", protect, adminOnly, upload.array("images", 10), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;