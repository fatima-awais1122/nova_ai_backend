const { GoogleGenAI } = require("@google/genai");
const aiConfig = require("../config/ai.config");

const ai = new GoogleGenAI({
  apiKey: aiConfig.apiKey,
});

const generateAIResponse = async (history) => {
  try {
    const contents = history.map((message) => ({
      role:
        message.role === "assistant"
          ? "model"
          : "user",
      parts: [
        {
          text: message.content,
        },
      ],
    }));

    const response =
      await ai.models.generateContent({
        model: aiConfig.model,
        contents,
      });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:");
    console.error(error);

    throw new Error("AI response failed.");
  }
};

module.exports = {
  generateAIResponse,
};