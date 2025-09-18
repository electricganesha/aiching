import { useState } from "react";

export function useAi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function getAiResponse(hexagram: number, intention: string) {
    setLoading(true);
    setError(null);
    setResult("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hexagram, intention }),
      });

      if (!res.body) {
        setError("No response body");
        setLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiText += decoder.decode(value, { stream: true });
        setResult(aiText); // Update as stream arrives
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, result, getAiResponse };
}
