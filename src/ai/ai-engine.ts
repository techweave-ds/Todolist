import { prisma } from "@/lib/prisma";
import { OpenAIProvider } from "./providers/openai-provider";
import { AnthropicProvider } from "./providers/anthropic-provider";
import { GeminiProvider } from "./providers/gemini-provider";
import { GroqProvider } from "./providers/groq-provider";
import type { AiGenerationRequest, AiGenerationResponse, AiProvider, AiBreakdownResult, AiBreakdownMission, AiPlanResult } from "@/core/types/ai";
import { prismaErrorHandler } from "@/lib/service-error";

export class AIEngine {
  private providers: Map<string, AiProvider> = new Map();
  private defaultProvider: string = "groq";
  private providerFallbackOrder: string[] = ["groq", "openai", "anthropic", "gemini"];

  constructor() {
    this.registerProvider(new GroqProvider());
    this.registerProvider(new OpenAIProvider());
    this.registerProvider(new AnthropicProvider());
    this.registerProvider(new GeminiProvider());
  }

  registerProvider(provider: AiProvider): void {
    this.providers.set(provider.name, provider);
  }

  setDefaultProvider(name: string): void {
    if (this.providers.has(name)) {
      this.defaultProvider = name;
    }
  }

  getProvider(name?: string): AiProvider {
    const providerName = name ?? this.defaultProvider;
    const provider = this.providers.get(providerName);
    if (!provider) throw new Error(`AI provider "${providerName}" not found`);
    return provider;
  }

  async generate(request: AiGenerationRequest, userId: string, generationType: string = 'coaching'): Promise<AiGenerationResponse> {
    const preferredProvider = request.model?.split("/")[0];
    const order = preferredProvider
      ? [preferredProvider, ...this.providerFallbackOrder.filter(p => p !== preferredProvider)]
      : this.providerFallbackOrder;

    let lastError: string | undefined;
    for (const name of order) {
      const provider = this.providers.get(name);
      if (!provider) continue;
      const response = await provider.generate(request);
      if (!response.error && response.content) {
        await this.logGeneration(response, request, userId, generationType).catch(() => {});
        return response;
      }
      lastError = response.error;
    }

    return {
      content: "",
      model: "none",
      provider: "none",
      tokens: 0,
      duration: 0,
      error: lastError || "No AI provider available",
    };
  }

  private async logGeneration(response: AiGenerationResponse, request: AiGenerationRequest, userId: string, generationType: string): Promise<void> {
    try {
      await prisma.aIGeneration.create({
        data: {
          userId,
          type: generationType,
          model: response.model,
          prompt: request.prompt || '',
          response: response.content,
          tokens: response.tokens,
        },
      });
    } catch (error) {
      prismaErrorHandler(error, 'aiEngine.generate');
    }
  }

  async breakDownGoal(goal: string, userId: string): Promise<AiBreakdownResult> {
    const systemPrompt = `You are an expert productivity AI. Break down goals into actionable missions.
Return JSON format only:
{
  "missions": [{ "title": "string", "description": "string", "difficulty": "EASY|MEDIUM|HARD|LEGENDARY" }],
  "estimatedTime": number (minutes),
  "summary": "string"
}`;

    const response = await this.generate(
      {
        prompt: `Break down this goal into missions: "${goal}"`,
        systemPrompt,
        temperature: 0.7,
        maxTokens: 2000,
      },
      userId,
      'goal_breakdown'
    );

    try {
      const parsed = JSON.parse(response.content) as AiBreakdownResult;
      return parsed;
    } catch {
      return {
        missions: [{ title: goal, difficulty: "MEDIUM" }],
        estimatedTime: 60,
        summary: "Could not analyze goal automatically.",
      };
    }
  }

  async generateMissionsFromContext(context: string, userId: string): Promise<AiBreakdownMission[]> {
    const systemPrompt = `You are a mission planning AI. Based on the given context, generate actionable missions.
Return a JSON array only:
[{ "title": "string", "description": "string", "difficulty": "EASY|MEDIUM|HARD|LEGENDARY", "priority": "low|medium|high|critical" }]`;

    const response = await this.generate(
      {
        prompt: `Generate missions based on: "${context}"`,
        systemPrompt,
        temperature: 0.6,
        maxTokens: 2000,
      },
      userId,
      'mission_gen'
    );

    try {
      return JSON.parse(response.content);
    } catch {
      return [{
        title: `Task: ${context.substring(0, 80)}`,
        description: context,
        difficulty: "MEDIUM" as const,
        priority: "medium" as const,
      }];
    }
  }

  async generateWeeklyPlan(userId: string): Promise<AiPlanResult> {
    let missions: Awaited<ReturnType<typeof prisma.mission.findMany>> = [];
    let campaigns: Awaited<ReturnType<typeof prisma.campaign.findMany>> = [];

    try {
      missions = await prisma.mission.findMany({
        where: { userId, status: { in: ["pending", "active"] } },
        take: 20,
        orderBy: [{ priority: "desc" }, { deadline: "asc" }],
      });
    } catch (error) {
      prismaErrorHandler(error, 'aiEngine.generateWeeklyPlan.missions');
    }

    try {
      campaigns = await prisma.campaign.findMany({
        where: { userId, status: "active" },
      });
    } catch (error) {
      prismaErrorHandler(error, 'aiEngine.generateWeeklyPlan.campaigns');
    }

    const missionContext = missions.map((m) => `- ${m.title} (${m.difficulty}, ${m.priority})`).join("\n");
    const campaignContext = campaigns.map((c) => `- ${c.title}`).join("\n");

    const systemPrompt = `You are a strategic productivity planner. Analyze pending work and create an optimal weekly plan.
Return JSON format:
{
  "campaigns": [{ "title": "string", "description": "string" }],
  "missions": [{ "title": "string", "campaignTitle": "string|optional", "difficulty": "EASY|MEDIUM|HARD|LEGENDARY" }],
  "weeklyGoals": ["string"]
}`;

    const response = await this.generate(
      {
        prompt: `Current missions:\n${missionContext}\n\nCurrent campaigns:\n${campaignContext}\n\nCreate an optimized weekly plan.`,
        systemPrompt,
        temperature: 0.5,
        maxTokens: 3000,
      },
      userId,
      'weekly_plan'
    );

    try {
      return JSON.parse(response.content) as AiPlanResult;
    } catch {
      return {
        campaigns: [],
        missions: [],
        weeklyGoals: ["Focus on completing existing tasks"],
      };
    }
  }

  async generateDailyBriefing(userId: string): Promise<string> {
    let todayMissions: Awaited<ReturnType<typeof prisma.mission.findMany>> = [];
    let pendingCount: number = 0;
    let streak: Awaited<ReturnType<typeof prisma.streak.findUnique>> = null;
    let progress: Awaited<ReturnType<typeof prisma.userProgress.findUnique>> = null;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      todayMissions = await prisma.mission.findMany({
        where: {
          userId,
          status: { in: ["pending", "active"] },
          deadline: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
        orderBy: [{ priority: "desc" }, { deadline: "asc" }],
      });
    } catch (error) {
      prismaErrorHandler(error, 'aiEngine.generateDailyBriefing.missions');
    }

    try {
      pendingCount = await prisma.mission.count({
        where: { userId, status: "pending" },
      });
    } catch (error) {
      prismaErrorHandler(error, 'aiEngine.generateDailyBriefing.pendingCount');
    }

    try {
      streak = await prisma.streak.findUnique({ where: { userId_streakType: { userId, streakType: 'daily' } } });
    } catch (error) {
      prismaErrorHandler(error, 'aiEngine.generateDailyBriefing.streak');
    }

    try {
      progress = await prisma.userProgress.findUnique({ where: { userId } });
    } catch (error) {
      prismaErrorHandler(error, 'aiEngine.generateDailyBriefing.progress');
    }

    const prompt = `Generate an inspiring daily briefing for a user with:
- ${todayMissions.length} missions due today
- ${pendingCount} total pending missions
- Level ${progress?.level ?? 1} with ${progress?.totalXP ?? 0} total XP
- ${streak?.currentStreak ?? 0} day streak
- Longest streak: ${streak?.longestStreak ?? 0} days

Keep it concise, motivational, and actionable (max 3 paragraphs).`;

    const response = await this.generate(
      {
        prompt,
        systemPrompt: "You are an inspiring productivity coach. Generate brief daily briefings.",
        temperature: 0.8,
        maxTokens: 500,
      },
      userId,
      'daily_plan'
    );

    return response.content;
  }

  async getProductivityCoaching(userId: string, question?: string): Promise<string> {
    let stats: Awaited<ReturnType<typeof prisma.focusStatistic.findUnique>> = null;
    let recentMissions: Awaited<ReturnType<typeof prisma.mission.findMany>> = [];

    try {
      stats = await prisma.focusStatistic.findUnique({ where: { userId } });
    } catch (error) {
      prismaErrorHandler(error, 'aiEngine.getProductivityCoaching.stats');
    }

    try {
      recentMissions = await prisma.mission.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
      });
    } catch (error) {
      prismaErrorHandler(error, 'aiEngine.getProductivityCoaching.recentMissions');
    }

    const completedRate = recentMissions.length > 0
      ? Math.round((recentMissions.filter((m) => m.status === "completed").length / recentMissions.length) * 100)
      : 0;

    const userQuery = question
      ? `\n\nThe user asks: "${question}"\n\nRespond to their specific question with advice.`
      : "\n\nProvide concise, actionable productivity advice based on their stats.";

    const prompt = `User productivity stats:
- Focus sessions: ${stats?.totalSessions ?? 0}
- Total focus minutes: ${stats?.totalMinutes ?? 0}
- Average focus score: ${stats?.averageScore ?? 0}%
- Recent mission completion rate (last 10): ${completedRate}%${userQuery}`;

    const response = await this.generate(
      {
        prompt,
        systemPrompt: "You are a productivity coach. Provide brief, actionable advice based on user data. Be encouraging and specific.",
        temperature: 0.7,
        maxTokens: 600,
      },
      userId,
      'coaching'
    );

    return response.content;
  }

  async getMotivation(userId: string, context?: string): Promise<string> {
    let streak: Awaited<ReturnType<typeof prisma.streak.findUnique>> = null;
    let progress: Awaited<ReturnType<typeof prisma.userProgress.findUnique>> = null;

    try {
      streak = await prisma.streak.findUnique({ where: { userId_streakType: { userId, streakType: 'daily' } } });
    } catch (error) {
      prismaErrorHandler(error, 'aiEngine.getMotivation.streak');
    }

    try {
      progress = await prisma.userProgress.findUnique({ where: { userId } });
    } catch (error) {
      prismaErrorHandler(error, 'aiEngine.getMotivation.progress');
    }

    const contextStr = context
      ? `\nRecent context: ${context}`
      : '';

    const prompt = `Generate a short, energetic motivational message for a user who is:
- Level ${progress?.level ?? 1}
- On a ${streak?.currentStreak ?? 0} day streak
- Has completed ${progress?.totalMissionsCompleted ?? 0} missions total${contextStr}

Keep it under 3 sentences. Be inspiring and specific to their achievements.`;

    const response = await this.generate(
      {
        prompt,
        systemPrompt: "You are an energetic motivation speaker for a productivity app. Be brief and impactful.",
        temperature: 0.9,
        maxTokens: 200,
      },
      userId,
      'motivation'
    );

    return response.content;
  }

  async checkProviderHealth(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    this.providers.forEach((_, name) => {
      const key = `${name.toUpperCase()}_API_KEY` as string;
      results[name] = !!process.env[key];
    });
    return results;
  }
}

export const aiEngine = new AIEngine();
