const db = require("./db");

const create = async ({ name, description, price, stock, category }) => {
  const [result] = await db.execute(
    "INSERT INTO products (name, description, price, stock, category) VALUES (?, ?, ?, ?, ?)",
    [name, description || null, price, stock, category || null]
  );
  return result.insertId;
};

const findById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);
  return rows[0] || null;
};

const list = async ({ page, limit, search, sortBy, sortDir, category }) => {
  const allowedSort = new Set(["id", "name", "price", "created_at"]);
  const safeSortBy = allowedSort.has(sortBy) ? sortBy : "created_at";
  const safeSortDir = sortDir === "asc" ? "ASC" : "DESC";

  const where = [];
  const params = [];

  if (search) {
    where.push("name LIKE ?");
    params.push(`%${search}%`);
  }
  if (category) {
    where.push("category = ?");
    params.push(category);
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const offset = (page - 1) * limit;

  const [rows] = await db.execute(
    `SELECT id, name, description, price, stock, category, created_at
     FROM products
     ${whereClause}
     ORDER BY ${safeSortBy} ${safeSortDir}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [countRows] = await db.execute(
    `SELECT COUNT(*) AS total FROM products ${whereClause}`,
    params
  );

  return {
    rows,
    total: countRows[0].total,
    page,
    limit,
  };
};

const updateById = async (id, payload) => {
  const [result] = await db.execute(
    `UPDATE products
     SET name = ?, description = ?, price = ?, stock = ?, category = ?
     WHERE id = ?`,
    [payload.name, payload.description || null, payload.price, payload.stock, payload.category || null, id]
  );
  return result.affectedRows;
};

const removeById = async (id) => {
  const [result] = await db.execute("DELETE FROM products WHERE id = ?", [id]);
  return result.affectedRows;
};

module.exports = { create, findById, list, updateById, removeById };
