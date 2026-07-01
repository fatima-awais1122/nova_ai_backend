const express = require("express");

const router = express.Router();

const {
  createConversation,
  getUserConversations,
  getConversationById,
  renameConversation,
  deleteConversation,
} = require("../controllers/conversation.controller");

const { protect } = require("../middlewares/auth.middleware");

// Create Conversation
router.post("/", protect, createConversation);

// Get All Conversations (Pagination Supported)
router.get("/", protect, getUserConversations);

// Get Single Conversation
router.get("/:id", protect, getConversationById);

// Rename Conversation
router.patch("/:id", protect, renameConversation);

// Delete Conversation
router.delete("/:id", protect, deleteConversation);

module.exports = router;