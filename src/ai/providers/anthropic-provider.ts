import { AiGenerationRequest, AiGenerationResponse, AiProvider } from "@/core/types/ai";

export class AnthropicProvider implements AiProvider {
  name = "anthropic";

  async generate(request: AiGenerationRequest): Promise<AiGenerationResponse> {
    const startTime = Date.now();

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: request.model ?? "claude-3-5-sonnet-20241022",
          max_tokens: request.maxTokens ?? 2000,
          system: request.systemPrompt,
          messages: [{ role: "user", content: request.prompt }],
        }),
      });

      const data = await response.json();

      return {
        content: data.content?.[0]?.text ?? "",
        model: request.model ?? "claude-3-5-sonnet-20241022",
        provider: this.name,
        tokens: (data.usage?.input_tokens ?? 0) + (data.usage?.output_tokens ?? 0),
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        content: "",
        model: request.model ?? "claude-3-5-sonnet-20241022",
        provider: this.name,
        tokens: 0,
        duration: Date.now() - startTime,
        error: (error as Error).message,
      };
    }
  }
}
