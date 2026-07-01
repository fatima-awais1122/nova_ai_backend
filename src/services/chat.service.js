const prisma = require("../lib/prisma");
const { generateAIResponse } = require("./ai.service");

const chatWithAI = async ({
  conversationId,
  userId,
  message,
}) => {
  let conversation;

  // ============================
  // Existing Conversation
  // ============================
  if (conversationId) {
    conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId,
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
      throw new Error("Conversation not found.");
    }
  }

  // ============================
  // New Conversation
  // ============================
  else {
    conversation = await prisma.conversation.create({
      data: {
        userId,
        title: "New Chat",
      },
      include: {
        messages: true,
      },
    });
  }

  // ============================
  // Save User Message
  // ============================

  const userMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "user",
      content: message,
    },
  });

  // ============================
  // Prepare Chat History
  // ============================

  const history = [
    ...conversation.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    {
      role: "user",
      content: message,
    },
  ];

  // ============================
  // Gemini Response
  // ============================

  const aiReply = await generateAIResponse(history);

  // ============================
  // Save AI Message
  // ============================

  const assistantMessage =
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: aiReply,
      },
    });

  // ============================
  // Auto Conversation Title
  // ============================

  if (
    conversation.title === "New Chat"
  ) {
    const title =
      message.length > 40
        ? message.substring(0, 40) + "..."
        : message;

    await prisma.conversation.update({
      where: {
        id: conversation.id,
      },
      data: {
        title,
      },
    });

    conversation.title = title;
  }

  // ============================
  // Return Response
  // ============================

  return {
    conversationId: conversation.id,
    conversationTitle: conversation.title,

    userMessage,

    assistantMessage,
  };
};

module.exports = {
  chatWithAI,
};