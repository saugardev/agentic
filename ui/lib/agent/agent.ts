import { OpenAI } from "openai";

const openai = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your environment
});

/**
 * Calls OpenAI's ChatCompletion to determine if the player's answer passes the level.
 * Returns an object: { passed: boolean, reason: string }
 */
export async function evaluateAnswer(levelNumber: number, levelDescription: string, playerAnswer: string) {
    const systemMessage = `
    You are a game master in a fantasy game. Evaluate the player's answer to see
    if they pass the level or fail (die). Return ONLY valid JSON in this format:
    {"passed": <true or false>, "reason": "<brief explanation>"}
  `;

    const userMessage = `
    Level #${levelNumber}: "${levelDescription}"
    Player's answer: "${playerAnswer}"

    Return a JSON object: 
    {
      "passed": true/false,
      "reason": "some short explanation"
    }
  `;

    try {
        const response = await openai.chat.completions.create({
            model: "deepseek-chat", // or any other model
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: userMessage },
            ],
        });

        const content = response.choices[0].message?.content?.trim() ?? "";
        const cleaned = content
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsed = JSON.parse(cleaned);

        // Validate minimal structure
        if (typeof parsed.passed !== "boolean" || typeof parsed.reason !== "string") {
            throw new Error("Invalid JSON format from OpenAI");
        }

        return parsed; // { passed, reason }
    } catch (error) {
        console.error("OpenAI evaluation error:", error);
        // Fallback: if there's an error, assume failure
        return {
            passed: false,
            reason: "Error in AI evaluation. The player fails by default.",
        };
    }
}
