const db = require("./db");

const create = async ({ name, email, passwordHash, role = "customer" }) => {
  const [result] = await db.execute(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [name, email, passwordHash, role]
  );
  return result.insertId;
};

const findByEmail = async (email) => {
  const [rows] = await db.execute("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  return rows[0] || null;
};

const findById = async (id) => {
  const [rows] = await db.execute(
    "SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null;
};

module.exports = { create, findByEmail, findById };
