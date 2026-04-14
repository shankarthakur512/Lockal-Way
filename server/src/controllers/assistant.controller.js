import { createLogger } from "../utils/logger.js";

const assistantLogger = createLogger("assistant-controller");

export const askTravelAssistant = async (req, res) => {
  try {
    const prompt = req.body.prompt?.trim();

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        success: false,
        message: "AI guide is not configured right now.",
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!response.ok || !text) {
      assistantLogger.error("Travel assistant request failed", {
        status: response.status,
        body: data,
      });

      return res.status(502).json({
        success: false,
        message: "AI guide could not generate a response.",
      });
    }

    return res.status(200).json({
      success: true,
      reply: text,
    });
  } catch (error) {
    assistantLogger.error("Travel assistant crashed", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Unable to reach the AI guide right now.",
    });
  }
};
