import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import { slugify } from "../utils/slugify.js";

export const createProductService = async (body, files = []) => {
  const {
    name,
    category,
    purity,
    weight,
    description,
    availability,
    featured,
  } = body;

  if (!name || !category || !purity || !weight || !description) {
    throw new Error("Name, category, purity, weight and description are required");
  }

  const categoryExists = await Category.findById(category);

  if (!categoryExists) {
    throw new Error("Category not found");
  }

  let slug = slugify(name);

  const exists = await Product.findOne({ slug });

  if (exists) {
    slug = `${slug}-${Date.now()}`;
  }

  const images = files.map((file) => file.path);

  const product = await Product.create({
    name,
    slug,
    category,
    purity,
    weight,
    description,
    availability,
    featured,
    images,
  });

  return product;
};

export const getProductsService = async (query) => {
  const { search, category, purity, availability, featured } = query;

  const filter = {};

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  if (category) {
    filter.category = category;
  }

  if (purity) {
    filter.purity = purity;
  }

  if (availability) {
    filter.availability = availability;
  }

  if (featured === "true") {
    filter.featured = true;
  }

  return await Product.find(filter)
    .populate("category")
    .sort({ createdAt: -1 });
};

export const getSingleProductService = async (slug) => {
  const product = await Product.findOne({ slug }).populate("category");

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

export const updateProductService = async (id, body, files = []) => {
  const updateData = { ...body };

  if (body.name) {
    updateData.slug = slugify(body.name);
  }

  if (files.length > 0) {
    updateData.images = files.map((file) => file.path);
  }

  const product = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate("category");

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

export const deleteProductService = async (id) => {
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};