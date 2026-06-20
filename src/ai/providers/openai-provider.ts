import OpenAI from "openai";
import { AiGenerationRequest, AiGenerationResponse, AiProvider } from "@/core/types/ai";

export class OpenAIProvider implements AiProvider {
  name = "openai";
  private _client: OpenAI | null = null;

  private get client(): OpenAI {
    if (!this._client) {
      this._client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
    return this._client;
  }

  async generate(request: AiGenerationRequest): Promise<AiGenerationResponse> {
    const startTime = Date.now();

    try {
      const response = await this.client.chat.completions.create({
        model: request.model ?? "gpt-4o",
        messages: [
          ...(request.systemPrompt ? [{ role: "system" as const, content: request.systemPrompt }] : []),
          { role: "user" as const, content: request.prompt },
        ],
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 2000,
      });

      return {
        content: response.choices[0]?.message?.content ?? "",
        model: response.model,
        provider: this.name,
        tokens: response.usage?.total_tokens ?? 0,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        content: "",
        model: request.model ?? "gpt-4o",
        provider: this.name,
        tokens: 0,
        duration: Date.now() - startTime,
        error: (error as Error).message,
      };
    }
  }
}
