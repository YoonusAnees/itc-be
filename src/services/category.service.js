import Category from "../models/category.model.js";
import { slugify } from "../utils/slugify.js";

export const createCategoryService = async ({ name, image }) => {
  if (!name) {
    throw new Error("Category name is required");
  }

  const slug = slugify(name);

  const exists = await Category.findOne({ slug });

  if (exists) {
    throw new Error("Category already exists");
  }

  const category = await Category.create({
    name,
    slug,
    image,
  });

  return category;
};

export const getCategoriesService = async () => {
  return await Category.find().sort({ createdAt: -1 });
};

export const updateCategoryService = async (id, data) => {
  if (data.name) {
    data.slug = slugify(data.name);
  }

  const category = await Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

export const deleteCategoryService = async (id) => {
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};