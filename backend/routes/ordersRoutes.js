const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const salesController = require("../controllers/salesController");

router.post("/", authMiddleware, salesController.createOrder);
router.get("/my", authMiddleware, salesController.getMyOrders);
router.get("/", authMiddleware, salesController.getAllOrders);

module.exports = router;