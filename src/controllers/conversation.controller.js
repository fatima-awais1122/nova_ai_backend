const prisma = require("../lib/prisma");

// ===============================
// Create Conversation
// ===============================
const createConversation = async (req, res) => {
  try {
    const { title } = req.body;

    const conversation = await prisma.conversation.create({
      data: {
        title: title || "New Chat",
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Conversation created successfully.",
      conversation,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

// ===============================
// Get User Conversations
// ===============================
const getUserConversations = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const total = await prisma.conversation.count({
      where: {
        userId: req.user.id,
      },
    });

    const conversations =
      await prisma.conversation.findMany({
        where: {
          userId: req.user.id,
        },
        orderBy: {
          updatedAt: "desc",
        },
        skip,
        take: limit,
      });

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      conversations,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

// ===============================
// Get Single Conversation
// ===============================
const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;

    const conversation =
      await prisma.conversation.findFirst({
        where: {
          id,
          userId: req.user.id,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

// ===============================
// Rename Conversation
// ===============================
const renameConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required.",
      });
    }

    const conversation =
      await prisma.conversation.findFirst({
        where: {
          id,
          userId: req.user.id,
        },
      });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    const updated =
      await prisma.conversation.update({
        where: {
          id,
        },
        data: {
          title: title.trim(),
        },
      });

    return res.status(200).json({
      success: true,
      message: "Conversation renamed successfully.",
      conversation: updated,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

// ===============================
// Delete Conversation
// ===============================
const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;

    const conversation =
      await prisma.conversation.findFirst({
        where: {
          id,
          userId: req.user.id,
        },
      });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    await prisma.conversation.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

module.exports = {
  createConversation,
  getUserConversations,
  getConversationById,
  renameConversation,
  deleteConversation,
};