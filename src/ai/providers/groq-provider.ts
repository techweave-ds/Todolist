import { AiGenerationRequest, AiGenerationResponse, AiProvider } from "@/core/types/ai";

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.1-8b-instant";

export class GroqProvider implements AiProvider {
  name = "groq";

  private get apiKey(): string | undefined {
    return process.env.GROQ_API_KEY;
  }

  async generate(request: AiGenerationRequest): Promise<AiGenerationResponse> {
    const startTime = Date.now();

    if (!this.apiKey) {
      return {
        content: "",
        model: DEFAULT_MODEL,
        provider: this.name,
        tokens: 0,
        duration: Date.now() - startTime,
        error: "GROQ_API_KEY not configured",
      };
    }

    try {
      const res = await fetch(GROQ_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: request.model ?? DEFAULT_MODEL,
          messages: [
            ...(request.systemPrompt ? [{ role: "system", content: request.systemPrompt }] : []),
            { role: "user", content: request.prompt },
          ],
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 2000,
        }),
      });

      if (!res.ok) {
        return {
          content: "",
          model: DEFAULT_MODEL,
          provider: this.name,
          tokens: 0,
          duration: Date.now() - startTime,
          error: `Groq API error: ${res.status} ${res.statusText}`,
        };
      }

      const data = await res.json();
      return {
        content: data.choices?.[0]?.message?.content ?? "",
        model: data.model ?? DEFAULT_MODEL,
        provider: this.name,
        tokens: data.usage?.total_tokens ?? 0,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        content: "",
        model: DEFAULT_MODEL,
        provider: this.name,
        tokens: 0,
        duration: Date.now() - startTime,
        error: (error as Error).message,
      };
    }
  }
}
