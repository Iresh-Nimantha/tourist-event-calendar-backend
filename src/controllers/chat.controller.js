const { getChatbotReply } = require("../services/chatService");

const chat = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    console.log("[ChatController] User:", message);
    const reply = await getChatbotReply(message);
    res.json({ reply });
  } catch (error) {
    console.error("[ChatController] Error:", error);
    next(error);
  }
};

module.exports = { chat };
