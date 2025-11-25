const express = require("express");
const router = express.Router();

const { salesReport, financialReport } = require("../controllers/reportsController");
const { authMiddleware, requireAdmin } = require("../middleware/auth");

router.get("/sales", authMiddleware, requireAdmin, salesReport);
router.get("/financial", authMiddleware, requireAdmin, financialReport);

module.exports = router;