import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
export async function POST(request: Request) {
  try {
    const { hexagram, intention } = await request.json();
    if (!hexagram || !intention) {
      return new Response(
        JSON.stringify({ error: "Missing hexagram or intention" }),
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing OpenRouter API key" }),
        { status: 500 }
      );
    }

    const openrouter = createOpenRouter({ apiKey });

    const context = process.env.AI_CONTEXT;

    const prompt = `${context}
Intention: ${intention}
Hexagram: ${hexagram}
${process.env.AI_PROMPT}`;

    const response = streamText({
      model: openrouter("google/gemini-2.0-flash-exp:free"),
      prompt,
    });

    // Stream the response to the client
    return response.toTextStreamResponse();
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch from OpenRouter",
        details: String(error),
      }),
      { status: 500 }
    );
  }
}
