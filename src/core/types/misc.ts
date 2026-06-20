export interface WorkspaceProgression {
  id: string;
  userId: string;
  tier: number;
  style: string;
  theme: string;
  unlocks: Record<string, unknown> | null;
}

export interface AudioPreferences {
  id: string;
  userId: string;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  ambientVolume: number;
  voiceVolume: number;
  currentEnvironment: string;
  focusPlaylist: string[];
}
