require("dotenv").config();
const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("Set GEMINI_API_KEY in .env");
  process.exit(1);
}

async function listModels() {
  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`,
    );
    console.log("All models:");
    console.log(
      JSON.stringify(
        response.data.models.map((m) => ({
          name: m.name,
          supported: m.supportedGenerationMethods,
        })),
        null,
        2,
      ),
    );

    const genContentModels = response.data.models.filter((m) =>
      m.supportedGenerationMethods.includes("generateContent"),
    );
    console.log("\nModels for generateContent:");
    genContentModels.forEach((m) =>
      console.log(`- ${m.name} (${m.displayName})`),
    );
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

listModels();
