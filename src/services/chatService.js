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

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Stable model, avoids v1beta 404[web:51][web:53]

async function getChatbotReply(userMessage) {
  try {
    console.log("[ChatService] Fetching hotels & events...");

    // Fetch hotels & events
    const [hotelsRes, eventsRes] = await Promise.all([
      axios.get(HOTELS_API),
      axios.get(EVENTS_API),
    ]);

    const hotels = hotelsRes.data.hotels || hotelsRes.data || [];
    const events = eventsRes.data.events || eventsRes.data || [];

    console.log(
      `[ChatService] ${hotels.length} hotels, ${events.length} events fetched`,
    );

    // Build the prompt
    let prompt = `You are a helpful assistant for tourists in Sri Lanka.\n\n`;
    prompt += `Hotels:\n${hotels
      .map(
        (h) =>
          `- ${h.name} at ${h.location?.city || "Unknown"}, contact: ${h.phone || "N/A"}`,
      )
      .join("\n")}\n\n`;
    prompt += `Events:\n${events
      .map(
        (e) =>
          `- ${e.title} on ${e.date} at ${e.location?.venue || "Unknown"}, price: ${e.price || "Free"}`,
      )
      .join("\n")}\n\n`;
    prompt += `User: ${userMessage}\nAssistant:`;

    console.log("[ChatService] Sending prompt to Gemini API...");

    // Generate content
    const result = await model.generateContent(prompt);
    const reply = await result.response.text();

    console.log("[ChatService] Reply received:", reply);

    return reply;
  } catch (err) {
    console.error("[ChatService] Error:", err);
    // Fallback models if needed
    return "Sorry, I couldn't get a response right now. Try 'gemini-pro' or check API key access.";
  }
}

module.exports = { getChatbotReply };
