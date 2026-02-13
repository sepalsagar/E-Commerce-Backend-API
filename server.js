require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(helmet());
app.use(
	cors({
		origin: process.env.CORS_ORIGIN || "*",
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000,
		max: 300,
		standardHeaders: true,
		legacyHeaders: false,
	})
);

app.get("/", (req, res) => {
	res.json({
		message: "E-Commerce Backend API",
		version: "1.0.0",
	});
});

app.get("/healthz", (req, res) => {
	res.status(200).json({ status: "ok" });
});

app.use("/api/auth", require("./app/routes/auth.routes"));
app.use("/api/products", require("./app/routes/product.routes"));
app.use("/api/orders", require("./app/routes/order.routes"));

app.use((req, res) => {
	res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
	res.status(500).json({
		message: err.message || "Internal server error",
	});
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
