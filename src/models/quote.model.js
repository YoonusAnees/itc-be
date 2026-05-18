import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: String,

    message: String,

    requestType: {
      type: String,
      enum: ["Quotation", "Inquiry", "Call Request", "WhatsApp"],
      default: "Quotation",
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        productName: String,

        purity: String,

        weight: Number,

        image: String,
      },
    ],

    status: {
      type: String,
      enum: ["New", "Contacted", "Quoted", "Closed"],
      default: "New",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Quote", quoteSchema);