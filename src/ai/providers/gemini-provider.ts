import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiGenerationRequest, AiGenerationResponse, AiProvider } from "@/core/types/ai";

export class GeminiProvider implements AiProvider {
  name = "gemini";
  private _client: GoogleGenerativeAI | null = null;

  private get client(): GoogleGenerativeAI {
    if (!this._client) {
      this._client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
    }
    return this._client;
  }

  async generate(request: AiGenerationRequest): Promise<AiGenerationResponse> {
    const startTime = Date.now();

    try {
      const model = this.client.getGenerativeModel({
        model: request.model ?? "gemini-2.0-flash",
      });

      const contents = [];
      if (request.systemPrompt) {
        contents.push({ role: "user", parts: [{ text: request.systemPrompt }] });
        contents.push({ role: "model", parts: [{ text: "Understood. I will follow these instructions." }] });
      }
      contents.push({ role: "user", parts: [{ text: request.prompt }] });

      const result = await model.generateContent({ contents });
      const response = result.response;

      return {
        content: response.text(),
        model: request.model ?? "gemini-2.0-flash",
        provider: this.name,
        tokens: response.usageMetadata?.totalTokenCount ?? 0,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        content: "",
        model: request.model ?? "gemini-2.0-flash",
        provider: this.name,
        tokens: 0,
        duration: Date.now() - startTime,
        error: (error as Error).message,
      };
    }
  }
}
