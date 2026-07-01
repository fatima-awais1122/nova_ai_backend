const { chatWithAI } = require("../services/chat.service");

const chat = async (req, res) => {
  try {
    const { conversationId, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const response = await chatWithAI({
      conversationId,
      userId: req.user.id,
      message: message.trim(),
    });

    return res.status(200).json({
      success: true,
      message: "Chat completed successfully.",
      data: response,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  chat,
};