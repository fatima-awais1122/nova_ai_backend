const express = require("express");

const router = express.Router();

const { chat } = require("../controllers/chat.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/", protect, chat);

module.exports = router;