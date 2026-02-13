const db = require("./db");

const createOrderWithItems = async ({ userId, items }) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    let subtotal = 0;
    const itemRows = [];

    for (const item of items) {
      const [productRows] = await connection.execute(
        "SELECT id, name, price, stock FROM products WHERE id = ? FOR UPDATE",
        [item.productId]
      );

      if (!productRows.length) {
        throw new Error(`Product ${item.productId} not found`);
      }

      const product = productRows[0];
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      const unitPrice = Number(product.price);
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      itemRows.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
      });

      await connection.execute(
        "UPDATE products SET stock = stock - ? WHERE id = ?",
        [item.quantity, product.id]
      );
    }

    const [orderResult] = await connection.execute(
      "INSERT INTO orders (user_id, status, subtotal, total_amount) VALUES (?, 'placed', ?, ?)",
      [userId, subtotal, subtotal]
    );

    const orderId = orderResult.insertId;

    for (const row of itemRows) {
      await connection.execute(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, row.productId, row.quantity, row.unitPrice, row.lineTotal]
      );
    }

    await connection.commit();
    return orderId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const getOrdersByUser = async ({ userId, page, limit }) => {
  const offset = (page - 1) * limit;
  const [orders] = await db.execute(
    `SELECT id, status, subtotal, total_amount, created_at
     FROM orders
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );

  const orderIds = orders.map((o) => o.id);
  let items = [];
  if (orderIds.length) {
    const placeholders = orderIds.map(() => "?").join(",");
    const [rows] = await db.query(
      `SELECT oi.order_id, oi.product_id, p.name AS product_name, oi.quantity, oi.unit_price, oi.line_total
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id IN (${placeholders})
       ORDER BY oi.order_id DESC`,
      orderIds
    );
    items = rows;
  }

  const [countRows] = await db.execute(
    "SELECT COUNT(*) AS total FROM orders WHERE user_id = ?",
    [userId]
  );

  const data = orders.map((order) => ({
    ...order,
    items: items.filter((item) => item.order_id === order.id),
  }));

  return {
    rows: data,
    total: countRows[0].total,
    page,
    limit,
  };
};

module.exports = { createOrderWithItems, getOrdersByUser };
