export interface AnalyticsEvent {
  event: string;
  userId?: string;
  properties?: Record<string, unknown>;
  timestamp?: string;
}

export interface AnalyticsProvider {
  identify(userId: string, traits?: Record<string, unknown>): void;
  track(event: string, properties?: Record<string, unknown>): void;
  page(name?: string, properties?: Record<string, unknown>): void;
  reset(): void;
}
