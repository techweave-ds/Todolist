-- Mission Control OS — Row Level Security Policies
-- Enable RLS and create user-scoped policies for all tables

-- Helper: verify the user owns the row
CREATE OR REPLACE FUNCTION auth.user_owns(user_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_id = auth.uid()::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Profile
-- ============================================================
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON "Profile" FOR SELECT
  USING (auth.user_owns("userId"));

CREATE POLICY "Users can create own profile"
  ON "Profile" FOR INSERT
  WITH CHECK (auth.user_owns("userId"));

CREATE POLICY "Users can update own profile"
  ON "Profile" FOR UPDATE
  USING (auth.user_owns("userId"))
  WITH CHECK (auth.user_owns("userId"));

CREATE POLICY "Users can delete own profile"
  ON "Profile" FOR DELETE
  USING (auth.user_owns("userId"));

-- ============================================================
-- Campaign
-- ============================================================
ALTER TABLE "Campaign" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own campaigns"
  ON "Campaign" FOR SELECT
  USING (auth.user_owns("userId"));

CREATE POLICY "Users can create own campaigns"
  ON "Campaign" FOR INSERT
  WITH CHECK (auth.user_owns("userId"));

CREATE POLICY "Users can update own campaigns"
  ON "Campaign" FOR UPDATE
  USING (auth.user_owns("userId"))
  WITH CHECK (auth.user_owns("userId"));

CREATE POLICY "Users can delete own campaigns"
  ON "Campaign" FOR DELETE
  USING (auth.user_owns("userId"));

-- ============================================================
-- Mission
-- ============================================================
ALTER TABLE "Mission" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own missions"
  ON "Mission" FOR SELECT
  USING (auth.user_owns("userId"));

CREATE POLICY "Users can create own missions"
  ON "Mission" FOR INSERT
  WITH CHECK (auth.user_owns("userId"));

CREATE POLICY "Users can update own missions"
  ON "Mission" FOR UPDATE
  USING (auth.user_owns("userId"))
  WITH CHECK (auth.user_owns("userId"));

CREATE POLICY "Users can delete own missions"
  ON "Mission" FOR DELETE
  USING (auth.user_owns("userId"));

-- ============================================================
-- Subtask
-- ============================================================
ALTER TABLE "Subtask" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view subtasks of own missions"
  ON "Subtask" FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM "Mission" WHERE "Mission".id = "Subtask"."missionId" AND auth.user_owns("Mission"."userId")
  ));

CREATE POLICY "Users can create subtasks on own missions"
  ON "Subtask" FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM "Mission" WHERE "Mission".id = "Subtask"."missionId" AND auth.user_owns("Mission"."userId")
  ));

CREATE POLICY "Users can update subtasks on own missions"
  ON "Subtask" FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM "Mission" WHERE "Mission".id = "Subtask"."missionId" AND auth.user_owns("Mission"."userId")
  ));

CREATE POLICY "Users can delete subtasks on own missions"
  ON "Subtask" FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM "Mission" WHERE "Mission".id = "Subtask"."missionId" AND auth.user_owns("Mission"."userId")
  ));

-- ============================================================
-- MissionHistory
-- ============================================================
ALTER TABLE "MissionHistory" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own mission history"
  ON "MissionHistory" FOR SELECT
  USING (auth.user_owns("userId"));

CREATE POLICY "Users can create own mission history"
  ON "MissionHistory" FOR INSERT
  WITH CHECK (auth.user_owns("userId"));

-- ============================================================
-- XPTransaction
-- ============================================================
ALTER TABLE "XPTransaction" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own XP transactions"
  ON "XPTransaction" FOR SELECT
  USING (auth.user_owns("userId"));

CREATE POLICY "Users can create own XP transactions"
  ON "XPTransaction" FOR INSERT
  WITH CHECK (auth.user_owns("userId"));

-- ============================================================
-- UserProgress
-- ============================================================
ALTER TABLE "UserProgress" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON "UserProgress" FOR SELECT
  USING (auth.user_owns("userId"));

CREATE POLICY "Users can create own progress"
  ON "UserProgress" FOR INSERT
  WITH CHECK (auth.user_owns("userId"));

CREATE POLICY "Users can update own progress"
  ON "UserProgress" FOR UPDATE
  USING (auth.user_owns("userId"))
  WITH CHECK (auth.user_owns("userId"));

-- ============================================================
-- Achievement
-- ============================================================
ALTER TABLE "Achievement" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view achievements"
  ON "Achievement" FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- UserAchievement
-- ============================================================
ALTER TABLE "UserAchievement" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON "UserAchievement" FOR SELECT
  USING (auth.user_owns("userId"));

CREATE POLICY "Users can create own achievements"
  ON "UserAchievement" FOR INSERT
  WITH CHECK (auth.user_owns("userId"));

CREATE POLICY "Users can update own achievements"
  ON "UserAchievement" FOR UPDATE
  USING (auth.user_owns("userId"))
  WITH CHECK (auth.user_owns("userId"));

-- ============================================================
-- Streak
-- ============================================================
ALTER TABLE "Streak" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streaks"
  ON "Streak" FOR SELECT
  USING (auth.user_owns("userId"));

CREATE POLICY "Users can create own streaks"
  ON "Streak" FOR INSERT
  WITH CHECK (auth.user_owns("userId"));

CREATE POLICY "Users can update own streaks"
  ON "Streak" FOR UPDATE
  USING (auth.user_owns("userId"))
  WITH CHECK (auth.user_owns("userId"));

-- ============================================================
-- FocusSession
-- ============================================================
ALTER TABLE "FocusSession" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own focus sessions"
  ON "FocusSession" FOR SELECT
  USING (auth.user_owns("userId"));

CREATE POLICY "Users can create own focus sessions"
  ON "FocusSession" FOR INSERT
  WITH CHECK (auth.user_owns("userId"));

CREATE POLICY "Users can update own focus sessions"
  ON "FocusSession" FOR UPDATE
  USING (auth.user_owns("userId"))
  WITH CHECK (auth.user_owns("userId"));

CREATE POLICY "Users can delete own focus sessions"
  ON "FocusSession" FOR DELETE
  USING (auth.user_owns("userId"));

-- ============================================================
-- FocusStatistic
-- ============================================================
ALTER TABLE "FocusStatistic" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own focus stats"
  ON "FocusStatistic" FOR SELECT
  USING (auth.user_owns("userId"));

CREATE POLICY "Users can create own focus stats"
  ON "FocusStatistic" FOR INSERT
  WITH CHECK (auth.user_owns("userId"));

CREATE POLICY "Users can update own focus stats"
  ON "FocusStatistic" FOR UPDATE
  USING (auth.user_owns("userId"))
  WITH CHECK (auth.user_owns("userId"));

-- ============================================================
-- Notification
-- ============================================================
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON "Notification" FOR SELECT
  USING (auth.user_owns("userId"));

CREATE POLICY "Users can create own notifications"
  ON "Notification" FOR INSERT
  WITH CHECK (auth.user_owns("userId"));

CREATE POLICY "Users can update own notifications"
  ON "Notification" FOR UPDATE
  USING (auth.user_owns("userId"))
  WITH CHECK (auth.user_owns("userId"));

CREATE POLICY "Users can delete own notifications"
  ON "Notification" FOR DELETE
  USING (auth.user_owns("userId"));

-- ============================================================
-- AudioPreference
-- ============================================================
ALTER TABLE "AudioPreference" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own audio preferences"
  ON "AudioPreference" FOR SELECT
  USING (auth.user_owns("userId"));

CREATE POLICY "Users can create own audio preferences"
  ON "AudioPreference" FOR INSERT
  WITH CHECK (auth.user_owns("userId"));

CREATE POLICY "Users can update own audio preferences"
  ON "AudioPreference" FOR UPDATE
  USING (auth.user_owns("userId"))
  WITH CHECK (auth.user_owns("userId"));

CREATE POLICY "Users can delete own audio preferences"
  ON "AudioPreference" FOR DELETE
  USING (auth.user_owns("userId"));

-- ============================================================
-- WorkspaceProgression
-- ============================================================
ALTER TABLE "WorkspaceProgression" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workspace"
  ON "WorkspaceProgression" FOR SELECT
  USING (auth.user_owns("userId"));

CREATE POLICY "Users can create own workspace"
  ON "WorkspaceProgression" FOR INSERT
  WITH CHECK (auth.user_owns("userId"));

CREATE POLICY "Users can update own workspace"
  ON "WorkspaceProgression" FOR UPDATE
  USING (auth.user_owns("userId"))
  WITH CHECK (auth.user_owns("userId"));

-- ============================================================
-- MemoryLane
-- ============================================================
ALTER TABLE "MemoryLane" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own memory lane"
  ON "MemoryLane" FOR SELECT
  USING (auth.user_owns("userId"));

CREATE POLICY "Users can create own memory lane"
  ON "MemoryLane" FOR INSERT
  WITH CHECK (auth.user_owns("userId"));

-- ============================================================
-- AnalyticsEvent
-- ============================================================
ALTER TABLE "AnalyticsEvent" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics"
  ON "AnalyticsEvent" FOR SELECT
  USING (auth.user_owns("userId"));

CREATE POLICY "Users can create own analytics"
  ON "AnalyticsEvent" FOR INSERT
  WITH CHECK (auth.user_owns("userId"));

-- ============================================================
-- AIGeneration
-- ============================================================
ALTER TABLE "AIGeneration" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI generations"
  ON "AIGeneration" FOR SELECT
  USING (auth.user_owns("userId"));

CREATE POLICY "Users can create own AI generations"
  ON "AIGeneration" FOR INSERT
  WITH CHECK (auth.user_owns("userId"));
