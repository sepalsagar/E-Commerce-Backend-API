const Order = require("../models/order.model");

exports.create = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: "Order items are required" });
    }

    const normalizedItems = items.map((item) => ({
      productId: Number(item.productId),
      quantity: Number(item.quantity),
    }));

    if (normalizedItems.some((item) => !item.productId || item.quantity <= 0)) {
      return res.status(400).json({ message: "Invalid item payload" });
    }

    const orderId = await Order.createOrderWithItems({
      userId: req.user.userId,
      items: normalizedItems,
    });

    return res.status(201).json({ message: "Order placed", data: { orderId } });
  } catch (error) {
    if (error.message.includes("Insufficient stock") || error.message.includes("not found")) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);

    const result = await Order.getOrdersByUser({
      userId: req.user.userId,
      page,
      limit,
    });

    return res.json({
      message: "Orders fetched",
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
