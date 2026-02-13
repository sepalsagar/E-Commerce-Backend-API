const express = require("express");
const controller = require("../controllers/order.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticate, controller.create);
router.get("/my", authenticate, controller.getMyOrders);

module.exports = router;
