import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    purity: {
      type: String,
      enum: ["18K", "21K", "22K", "24K"],
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    availability: {
      type: String,
      enum: ["Available", "Made To Order", "Sold"],
      default: "Available",
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);