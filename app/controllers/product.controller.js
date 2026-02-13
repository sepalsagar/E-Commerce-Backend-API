const Product = require("../models/product.model");

exports.create = async (req, res, next) => {
  try {
    const { name, description, price, stock, category } = req.body;
    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({ message: "name, price and stock are required" });
    }

    const id = await Product.create({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
    });

    const product = await Product.findById(id);
    return res.status(201).json({ message: "Product created", data: product });
  } catch (error) {
    next(error);
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "created_at";
    const sortDir = req.query.sortDir === "asc" ? "asc" : "desc";
    const category = req.query.category || "";

    const result = await Product.list({ page, limit, search, sortBy, sortDir, category });

    return res.json({
      message: "Products fetched",
      data: result.rows,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const product = await Product.findById(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({ data: product });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const affected = await Product.updateById(Number(req.params.id), {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
    });

    if (!affected) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = await Product.findById(Number(req.params.id));
    return res.json({ message: "Product updated", data: product });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const affected = await Product.removeById(Number(req.params.id));
    if (!affected) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};
