export interface AiGenerationRequest {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AiGenerationResponse {
  content: string;
  model: string;
  provider: string;
  tokens: number;
  duration: number;
  error?: string;
}

export interface AiProvider {
  name: string;
  generate(request: AiGenerationRequest): Promise<AiGenerationResponse>;
}

export interface AiBreakdownMission {
  title: string;
  description?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "LEGENDARY";
  priority?: "low" | "medium" | "high" | "critical";
}

export interface AiBreakdownResult {
  missions: AiBreakdownMission[];
  estimatedTime: number;
  summary: string;
}

export interface AiPlanResult {
  campaigns: { title: string; description: string }[];
  missions: { title: string; campaignTitle?: string; difficulty: string }[];
  weeklyGoals: string[];
}
