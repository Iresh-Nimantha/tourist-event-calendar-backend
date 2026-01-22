require("dotenv").config();
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Your Gemini API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

// Public APIs - Use environment variable or default to localhost for development
// For production: Set BASE_URL or API_BASE_URL in your deployment platform's environment variables
// Example: BASE_URL=https://your-backend.onrender.com
const BASE_URL = process.env.BASE_URL || process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
const HOTELS_API = `${BASE_URL}/api/hotels`;
const EVENTS_API = `${BASE_URL}/api/events`;

// Global conversation history (simple array for context)
let conversationHistory = [];

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

async function getChatbotReply(userMessage) {
  try {
    console.log("[ChatService] Fetching hotels & events...");

    const [hotelsRes, eventsRes] = await Promise.all([
      axios.get(HOTELS_API),
      axios.get(EVENTS_API),
    ]);

    const hotels = hotelsRes.data.hotels || hotelsRes.data || [];
    const events = eventsRes.data.events || eventsRes.data || [];

    console.log(
      `[ChatService] ${hotels.length} hotels, ${events.length} events fetched`,
    );

    // Detailed data strings for context
    const hotelsDetails = hotels
      .map(
        (h) =>
          `Hotel: ${h.name}, Location: ${h.location?.city || "N/A"}, ${h.location?.address || ""}, Phone: ${h.phone || "N/A"}, Price: ${h.price || "Check availability"}`,
      )
      .join("\n");

    const eventsDetails = events
      .map(
        (e) =>
          `Event: ${e.title}, Date: ${e.date}, Venue: ${e.location?.venue || "TBD"}, Price: ${e.price || "Free"}, Description: ${e.description || "Exciting event!"}}`,
      )
      .join("\n");

    // Build system prompt with full context + conversation history
    let systemPrompt = `You are Gamage Tours, an expert Sri Lanka travel assistant. Use ONLY the provided hotels and events data.

Available Hotels:
${hotelsDetails}

Available Events:
${eventsDetails}

Keep responses concise, helpful, and conversational. Suggest combinations (hotel near event). Reference specific names/dates/prices.`;

    // Conversation context (last 6 exchanges max)
    const recentHistory = conversationHistory.slice(-6);
    const historyContext = recentHistory
      .map((msg) => `User: ${msg.user}\nAssistant: ${msg.assistant}`)
      .join("\n");

    const fullPrompt = `${systemPrompt}

Previous conversation:
${historyContext || "None"}

User: ${userMessage}
Assistant:`;

    console.log("[ChatService] Generating reply...");

    const result = await model.generateContent(fullPrompt);
    const reply = await result.response.text();

    console.log("[ChatService] AI Reply:", reply);

    // Update history
    conversationHistory.push({ user: userMessage, assistant: reply });
    // Keep only last 10 exchanges
    if (conversationHistory.length > 10) {
      conversationHistory = conversationHistory.slice(-10);
    }

    return reply.trim();
  } catch (err) {
    console.error("[ChatService] Error:", err);

    // Smart fallback using data
    return `Hi! I see ${hotels.length} hotel(s) and ${events.length} event(s) available. 
Try asking about "${hotels[0]?.name || "hotels"}" or "${events[0]?.title || "events"}". Service temporarily down.`;
  }
}

// Optional: Reset conversation (call if needed)
function resetConversation() {
  conversationHistory = [];
}

module.exports = { getChatbotReply, resetConversation };
