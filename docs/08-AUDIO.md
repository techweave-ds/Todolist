# Audio Engine — Complete Reference

## Architecture

The audio system uses **procedural audio synthesis** (no audio files, no pre-recorded samples). All sounds are generated in real-time using the Web Audio API with oscillator nodes, noise buffers, and filter networks.

### 6-Bus Routing

```
AudioContext → Master Gain (0.8)
                ├── Music Gain (0.7)
                ├── SFX Gain (0.8)     ← Sound effects
                ├── Ambient Gain (0.5)  ← Background ambients
                ├── Voice Gain (0.8)    ← TTS / AI voice
                └── UI Gain (0.6)       ← UI interaction sounds
```

Each bus has an independent `GainNode` with smooth `linearRampToValueAtTime` transitions (50ms fade) to prevent clicks/pops.

---

## Sound Effects (12 total)

All effects are synthesized using `OscillatorNode` with scheduled start/stop times and envelope shapes.

| Sound Name | Waveform | Frequencies | Bus | Duration | Description |
|-----------|----------|-------------|-----|----------|-------------|
| `mission_complete` | sine | C5→E5→G5 (ascending triad) | sfx | 0.4s | Major triad arpeggio |
| `level_up` | sine | A4→C#5→E5→A5 (ascending fanfare) | sfx | 0.6s | 4-note fanfare |
| `achievement` | sine | C5→E5→G5→C6 (triumph) | sfx | 0.5s | Triumphant ascent |
| `xp_gain` | sine | A4→C#5→E5 (quick 3-note) | sfx | 0.25s | Quick blip |
| `focus_start` | triangle | E4→A3 (descending) | sfx | 1.5s | Slow downward sweep |
| `focus_end` | triangle | A3→E4→A4 (ascending) | sfx | 0.8s | Gentle rise |
| `capsule_open` | sine | G4→C5→E5→G5→C6 (5-note rise) | sfx | 0.5s | Reward reveal |
| `streak_updated` | sine | A4→C#5→E5 (3-note) | sfx | 0.35s | Streak chime |
| `campaign_complete` | sine | C4→E4→G4→C5→E5→G5→C6 (7-note scale) | sfx | 0.56s | Full scale ascension |
| `daily_briefing` | sine | C5→E5→G5 (3-note) | sfx | 0.3s | Briefing chime |
| `workspace_upgrade` | sawtooth | F4→F5→C6 (3-note) | sfx | 0.2s | Mechanical upgrade |
| `notification` | sine | G5→C6 (double tap) | ui | 0.2s | Quick double beep |

### Sound Profile System

Four profiles that could adjust timing, pitch, or volume of effects:
- **Default**: Standard parameters
- **Subtle**: Reduced volume, softer waveforms
- **Intense**: Slightly higher volume, more harmonics
- **Premium**: Studio-quality settings (locked, requires purchase)

---

## Ambient Environments (8 total)

Ambients use a combination of:
- **Noise buffer** (brown/white noise generated from `AudioContext.createBuffer`)
- **Filter** (lowpass/bandpass/highpass `BiquadFilterNode`)
- **LFO** (low-frequency `OscillatorNode` modulating gain or filter frequency)
- **Periodic random events** (setInterval-based chirps, clatter, pops)
- **Drone oscillators** (sustained sine tones for specific environments)

| Environment | Noise Type | Filter | Special Effects | Premium? | Mood |
|-------------|-----------|--------|----------------|----------|------|
| `focus_deep` | Brown noise | Lowpass 300Hz | +432Hz sine drone (focus frequency) | No | Deep concentration |
| `focus_light` | White noise | Bandpass 800Hz | +528Hz sine drone (transformation frequency) | No | Light focus |
| `rain` | White noise | Highpass 2kHz | LFO 0.3Hz modulation (rain pattern) | No | Soothing rain |
| `forest` | White noise | Bandpass 500Hz | Random chirps every 4s (bird sounds) | No | Nature walk |
| `ocean` | White noise | Lowpass 600Hz | LFO 0.08Hz modulation (wave swell) | Yes | Calming waves |
| `cafe` | White noise | Bandpass 1.5kHz | Random clatter 30% chance every 3s | Yes | Coffee shop buzz |
| `bubble_pop` | White noise | Bandpass 2kHz | Random pops every 1-3s | No | Gentle ASMR |
| `lo_fi` | Brown noise | Lowpass 400Hz | +60BPM beat pulse via LFO | No | Lo-fi study beats |

---

## Event → Sound Mapping

| Event | Sound Played |
|-------|-------------|
| `MISSION_CREATED` | `notification` |
| `MISSION_COMPLETED` | `mission_complete` |
| `MISSION_DELETED` | `notification` |
| `CAMPAIGN_CREATED` | `notification` |
| `CAMPAIGN_COMPLETED` | `campaign_complete` |
| `XP_GAINED` | `xp_gain` |
| `LEVEL_UP` | `level_up` |
| `ACHIEVEMENT_UNLOCKED` | `achievement` |
| `STREAK_UPDATED` | `streak_updated` |
| `FOCUS_STARTED` | `focus_start` |
| `FOCUS_ENDED` | `focus_end` |
| `REWARD_CAPSULE_OPENED` | `capsule_open` |

---

## Audio Engine Class API

```typescript
class AudioEngineImpl {
  // Lifecycle
  async init(): Promise<void>          // Create AudioContext + 6 gain buses
  destroy(): void                      // Close context, clean up
  async resumeContext(): Promise<void>  // Resume suspended context (browser policy)

  // Volume Control
  setBusVolume(bus: BusType, volume: number): void  // Smooth ramp (50ms)
  getBusVolumes(): Record<BusType, number>           // Current bus volumes
  setEnabled(enabled: boolean): void                 // Mute/unmute all

  // Sound Effects
  async playEffect(name: SoundName): Promise<void>   // Schedule oscillator nodes

  // Ambient
  async startAmbient(type: AmbientType): Promise<void>  // Start noise + filters + LFOs
  stopAmbient(): void                                    // Stop all ambient nodes
  getCurrentAmbient(): AmbientType | null               // Currently playing ambient

  // Reactivity
  getAnalyser(): AnalyserNode | null  // For visualization

  // Event Wiring
  setupEventSubscriptions(): void      // Subscribe to 12 EventBus events
}
```

---

## Audio Reactivity Hook

**File**: `src/audio/hooks/use-audio-reactivity.ts`

```typescript
function useAudioReactivity(): {
  amplitude: number  // 0-255 overall amplitude
  bass: number       // 0-255 low frequencies
  mid: number        // 0-255 mid frequencies
  treble: number     // 0-255 high frequencies
}
```

Uses `AnalyserNode` with `requestAnimationFrame` loop (60fps). Can be connected to visualizations (workspace object pulsation, UI elements).

---

## Integration Points

### In App Layout (`src/app/(app)/layout.tsx`)
```typescript
useEffect(() => {
  audioEngine.init()
  setupAudioEventSubscriptions()  // Wire EventBus → sound effects
  // Resume AudioContext on first click/keypress (browser autoplay policy)
  document.addEventListener('click', resume, { once: true })
  document.addEventListener('keydown', resume, { once: true })
}, [])
```

### In Settings Page
- **Volume sliders**: Call `audioStore.setBusVolume(bus, value)` → `audioEngine.setBusVolume(bus, value)`
- **Sound profile selector**: Updates `audioStore.activeProfile`
- **Ambient selector**: Calls `audioStore.playAmbient(id)` / `stopAmbient()`
- **Sound preview**: Calls `audioStore.playEffect(name)`
- **Persistence**: `loadPreferences()` on mount, `savePreferences()` on change → `/api/audio-prefs` API

### In Focus Page
- Deep focus mode auto-starts `focus_deep` ambient
- Ambient dropdown selector to change environment mid-session
- Timer events trigger `focus_start` / `focus_end` sounds

---

## Design Decisions

1. **Procedural over pre-recorded**: No audio file loading, instant playback, infinite variety, smaller bundle size
2. **6-bus routing**: Independent volume control for different audio categories (music, sfx, ambient, voice, UI)
3. **Singleton pattern**: Single `AudioContext` per session (browsers limit number of contexts)
4. **Event-driven**: Engine subscribes to EventBus, never called directly from domain logic
5. **Smooth transitions**: All volume changes use `linearRampToValueAtTime` (50ms) to avoid clicks
6. **Browser policy handling**: AudioContext starts suspended; resumed on first user interaction (click/keydown)
