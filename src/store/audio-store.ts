import { create } from 'zustand'
import { audioEngine } from '@/services/audio'
import type { BusType, AmbientType, SoundName } from '@/audio/engine/audio-engine'

type SoundProfile = {
  id: string
  name: string
  description: string
  icon: string
  preset: 'default' | 'subtle' | 'intense' | 'premium'
}

const SOUND_PROFILES: SoundProfile[] = [
  { id: 'default', name: 'Default', description: 'Balanced sound effects', icon: '🎵', preset: 'default' },
  { id: 'subtle', name: 'Subtle', description: 'Gentle, minimal sounds', icon: '🌙', preset: 'subtle' },
  { id: 'intense', name: 'Intense', description: 'Bold, epic feedback', icon: '⚡', preset: 'intense' },
  { id: 'premium', name: 'Premium', description: 'Studio-quality soundscape', icon: '✨', preset: 'premium' },
]

const AMBIENT_ENVIRONMENTS: { id: AmbientType; name: string; description: string; icon: string; premium: boolean }[] = [
  { id: 'focus_deep', name: 'Deep Focus', description: 'Brown noise + 432Hz drone', icon: '🧘', premium: false },
  { id: 'focus_light', name: 'Light Focus', description: 'Soft bandpass + 528Hz drone', icon: '🌱', premium: false },
  { id: 'rain', name: 'Rain', description: 'Soothing rain ambience', icon: '🌧️', premium: false },
  { id: 'forest', name: 'Forest', description: 'Birds and rustling leaves', icon: '🌲', premium: false },
  { id: 'ocean', name: 'Ocean Waves', description: 'Gentle waves crashing', icon: '🌊', premium: true },
  { id: 'cafe', name: 'Café', description: 'Warm coffee shop buzz', icon: '☕', premium: true },
  { id: 'bubble_pop', name: 'Bubble Pop', description: 'Gentle popping bubbles — calm ASMR', icon: '🫧', premium: false },
  { id: 'lo_fi', name: 'Lo-Fi', description: 'Soft vinyl crackle + mellow beat', icon: '🎧', premium: false },
]

interface AudioState {
  isEnabled: boolean
  volumes: Record<BusType, number>
  currentAmbient: AmbientType | null
  activeProfile: string
  premiumUnlocked: boolean
  setEnabled: (enabled: boolean) => void
  setBusVolume: (bus: BusType, volume: number) => void
  setActiveProfile: (profileId: string) => void
  playEffect: (name: SoundName) => Promise<void>
  playAmbient: (environment: AmbientType) => Promise<void>
  stopAmbient: () => void
  speak: (text: string) => void
  stopSpeaking: () => void
  loadPreferences: (userId: string) => Promise<void>
  savePreferences: (userId: string) => Promise<void>
  getSoundProfiles: () => SoundProfile[]
  getAmbientEnvironments: () => typeof AMBIENT_ENVIRONMENTS
}

export const useAudioStore = create<AudioState>((set, get) => ({
  isEnabled: audioEngine.getEnabled(),
  volumes: audioEngine.getBusVolumes(),
  currentAmbient: null,
  activeProfile: 'default',
  premiumUnlocked: false,

  setEnabled: (enabled) => {
    audioEngine.setEnabled(enabled)
    set({ isEnabled: enabled })
  },

  setBusVolume: (bus, volume) => {
    audioEngine.setBusVolume(bus, volume)
    set((state) => ({ volumes: { ...state.volumes, [bus]: volume } }))
  },

  setActiveProfile: (profileId) => {
    set({ activeProfile: profileId })
  },

  playEffect: async (name) => {
    await audioEngine.playEffect(name)
  },

  playAmbient: async (environment) => {
    await audioEngine.startAmbient(environment)
    set({ currentAmbient: environment })
  },

  stopAmbient: () => {
    audioEngine.stopAmbient()
    set({ currentAmbient: null })
  },

  speak: (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = get().volumes.voice
      window.speechSynthesis.speak(utterance)
    }
  },

  stopSpeaking: () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  },

  loadPreferences: async (userId: string) => {
    try {
      const res = await fetch('/api/audio-prefs')
      if (!res.ok) return
      const prefs = await res.json()
      if (prefs && prefs.masterVolume !== undefined) {
        const volumes = {
          master: prefs.masterVolume,
          music: prefs.musicVolume,
          sfx: prefs.sfxVolume,
          ambient: prefs.ambientVolume,
          voice: prefs.voiceVolume,
          ui: prefs.uiVolume,
        }
        Object.entries(volumes).forEach(([bus, vol]) => {
          audioEngine.setBusVolume(bus as BusType, vol)
        })
        set({
          volumes,
          activeProfile: prefs.activeProfile || 'default',
          premiumUnlocked: (prefs.premiumPacks?.length ?? 0) > 0,
        })
      }
    } catch {
      // silent
    }
  },

  savePreferences: async (userId: string) => {
    try {
      const state = get()
      await fetch('/api/audio-prefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterVolume: state.volumes.master,
          musicVolume: state.volumes.music,
          sfxVolume: state.volumes.sfx,
          ambientVolume: state.volumes.ambient,
          voiceVolume: state.volumes.voice,
          uiVolume: state.volumes.ui,
          activeProfile: state.activeProfile,
          premiumPacks: state.premiumUnlocked ? ['premium'] : [],
        }),
      })
    } catch {
      // silent
    }
  },

  getSoundProfiles: () => SOUND_PROFILES,
  getAmbientEnvironments: () => AMBIENT_ENVIRONMENTS,
}))
