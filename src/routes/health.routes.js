const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Nova AI Backend is Running 🚀",
  });
});

module.exports = router;