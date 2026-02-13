const express = require("express");
const controller = require("../controllers/product.controller");
const { authenticate, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", controller.findAll);
router.get("/:id", controller.findOne);
router.post("/", authenticate, authorizeRoles("admin"), controller.create);
router.put("/:id", authenticate, authorizeRoles("admin"), controller.update);
router.delete("/:id", authenticate, authorizeRoles("admin"), controller.remove);

module.exports = router;
