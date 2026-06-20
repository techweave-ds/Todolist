-- Enable Row Level Security on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Campaign" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Mission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subtask" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MissionHistory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "XPTransaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserProgress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Achievement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserAchievement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Streak" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FocusSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FocusStatistic" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AudioPreference" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WorkspaceProgression" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MemoryLane" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AnalyticsEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AIGeneration" ENABLE ROW LEVEL SECURITY;

-- User policies (users can read/update their own data)
CREATE POLICY "Users can read own data" ON "User"
  FOR SELECT USING (auth.uid()::text = "id");

CREATE POLICY "Users can update own data" ON "User"
  FOR UPDATE USING (auth.uid()::text = "id");

-- Profile policies
CREATE POLICY "Users can read own profile" ON "Profile"
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own profile" ON "Profile"
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own profile" ON "Profile"
  FOR UPDATE USING (auth.uid()::text = "userId");

-- Campaign policies
CREATE POLICY "Users can read own campaigns" ON "Campaign"
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can create own campaigns" ON "Campaign"
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own campaigns" ON "Campaign"
  FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own campaigns" ON "Campaign"
  FOR DELETE USING (auth.uid()::text = "userId");

-- Mission policies
CREATE POLICY "Users can read own missions" ON "Mission"
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can create own missions" ON "Mission"
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own missions" ON "Mission"
  FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own missions" ON "Mission"
  FOR DELETE USING (auth.uid()::text = "userId");

-- Subtask policies (inherit from mission)
CREATE POLICY "Users can read subtasks" ON "Subtask"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "Mission" WHERE "Mission"."id" = "Subtask"."missionId" AND "Mission"."userId" = auth.uid()::text)
  );

CREATE POLICY "Users can manage subtasks" ON "Subtask"
  FOR ALL USING (
    EXISTS (SELECT 1 FROM "Mission" WHERE "Mission"."id" = "Subtask"."missionId" AND "Mission"."userId" = auth.uid()::text)
  );

-- Generic policy for all user-owned tables
CREATE POLICY "Users can read own data" ON "XPTransaction"
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can read own data" ON "UserProgress"
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can read own data" ON "UserAchievement"
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can read own data" ON "Streak"
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can read own data" ON "FocusSession"
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can manage own data" ON "FocusSession"
  FOR ALL USING (auth.uid()::text = "userId");

CREATE POLICY "Users can read own data" ON "FocusStatistic"
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can read own data" ON "Notification"
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can manage own data" ON "Notification"
  FOR ALL USING (auth.uid()::text = "userId");

CREATE POLICY "Users can read own data" ON "AudioPreference"
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can manage own data" ON "AudioPreference"
  FOR ALL USING (auth.uid()::text = "userId");

CREATE POLICY "Users can read own data" ON "WorkspaceProgression"
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can manage own data" ON "WorkspaceProgression"
  FOR ALL USING (auth.uid()::text = "userId");

CREATE POLICY "Users can read own data" ON "MemoryLane"
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can manage own data" ON "MemoryLane"
  FOR ALL USING (auth.uid()::text = "userId");

CREATE POLICY "Users can read own data" ON "AnalyticsEvent"
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can manage own data" ON "AnalyticsEvent"
  FOR ALL USING (auth.uid()::text = "userId");

CREATE POLICY "Users can read own data" ON "AIGeneration"
  FOR SELECT USING (auth.uid()::text = "userId");

-- Achievements are readable by all (global list)
CREATE POLICY "Achievements are readable by all" ON "Achievement"
  FOR SELECT USING (true);
