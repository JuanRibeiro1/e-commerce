const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/auth");
const adminDashboardController = require("../controllers/adminDashboardController");

router.get("/", authMiddleware, adminDashboardController.getDashboardData);

module.exports = router;