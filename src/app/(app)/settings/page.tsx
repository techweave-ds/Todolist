'use client'

import { useState, useEffect } from 'react'
import { useAudioStore } from '@/store/audio-store'
import { useAppStore } from '@/store/app-store'
import { Volume2, Music, Bell, Zap, Palette, Shield, Headphones, Mic, Radio, Sparkles, Play, Check } from 'lucide-react'
import type { BusType, SoundName } from '@/audio/engine/audio-engine'

export default function SettingsPage() {
  const { userId } = useAppStore()
  const { isEnabled, volumes, currentAmbient, activeProfile, premiumUnlocked, setEnabled, setBusVolume, setActiveProfile, playEffect, playAmbient, stopAmbient, getSoundProfiles, getAmbientEnvironments, loadPreferences, savePreferences } = useAudioStore()
  const [activeTab, setActiveTab] = useState('audio')
  const [selectedPreview, setSelectedPreview] = useState<SoundName | null>(null)
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    missionReminders: true,
    achievementAlerts: true,
    streakNotifications: true,
    dailyBriefing: true,
    focusReminders: true,
  })
  const [privacySettings, setPrivacySettings] = useState<Record<string, boolean>>({
    analyticsCollection: true,
    aiProcessing: true,
    exportData: false,
  })

  const handleThemeChange = (themeId: string) => {
    const isDark = themeId !== 'minimal'
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', themeId)
  }
  useEffect(() => {
    if (userId) loadPreferences(userId)
  }, [userId, loadPreferences])

  useEffect(() => {
    if (userId) savePreferences(userId)
  }, [volumes, activeProfile, userId, savePreferences])

  const tabs = [
    { id: 'audio', label: 'Audio', icon: Volume2 },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ]

  const busLabels: Record<string, { label: string; icon: any }> = {
    master: { label: 'Master Volume', icon: Volume2 },
    music: { label: 'Music', icon: Music },
    sfx: { label: 'Sound Effects', icon: Zap },
    ambient: { label: 'Ambient', icon: Radio },
    voice: { label: 'Voice / AI', icon: Mic },
    ui: { label: 'UI Sounds', icon: Headphones },
  }

  const soundEffects: { name: SoundName; label: string }[] = [
    { name: 'mission_complete', label: 'Mission Complete' },
    { name: 'level_up', label: 'Level Up' },
    { name: 'achievement', label: 'Achievement' },
    { name: 'xp_gain', label: 'XP Gain' },
    { name: 'focus_start', label: 'Focus Start' },
    { name: 'focus_end', label: 'Focus End' },
    { name: 'capsule_open', label: 'Capsule Open' },
    { name: 'streak_updated', label: 'Streak Updated' },
    { name: 'campaign_complete', label: 'Campaign Complete' },
    { name: 'notification', label: 'Notification' },
  ]

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Customize your experience</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'glass hover:bg-muted/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'audio' && (
        <div className="space-y-4">
          <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Sound</span>
              </div>
              <button
                onClick={() => setEnabled(!isEnabled)}
                className={`relative w-10 h-5 rounded-full transition-colors ${isEnabled ? 'bg-primary' : 'bg-muted'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <div className="space-y-4">
              {(Object.keys(busLabels) as BusType[]).map((bus) => {
                const { label, icon: Icon } = busLabels[bus]
                return (
                  <div key={bus}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{label}</span>
                      </div>
                      <span className="text-xs">{Math.round(volumes[bus] * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volumes[bus]}
                      onChange={e => setBusVolume(bus, Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Sound Profile</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {getSoundProfiles().map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => setActiveProfile(profile.id)}
                  className={`glass rounded-xl p-3 text-center transition-all ${
                    activeProfile === profile.id
                      ? 'ring-2 ring-primary bg-primary/10'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="text-2xl mb-1">{profile.icon}</div>
                  <div className="text-xs font-medium">{profile.name}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{profile.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Radio className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Ambient Environments</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {getAmbientEnvironments().map((env) => {
                const isActive = currentAmbient === env.id
                const isLocked = env.premium && !premiumUnlocked
                return (
                  <button
                    key={env.id}
                    disabled={isLocked}
                    onClick={() => isActive ? stopAmbient() : playAmbient(env.id)}
                    className={`glass rounded-xl p-3 text-center transition-all ${
                      isActive
                        ? 'ring-2 ring-primary bg-primary/10'
                        : isLocked
                          ? 'opacity-40 cursor-not-allowed'
                          : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{env.icon}</div>
                    <div className="text-xs font-medium">{env.name}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{env.description}</div>
                    {isActive && <div className="text-[10px] text-primary mt-1">Playing...</div>}
                    {isLocked && <div className="text-[10px] text-yellow-500 mt-1">Premium</div>}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Sound Preview</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {soundEffects.map((sfx) => (
                <button
                  key={sfx.name}
                  onClick={() => { playEffect(sfx.name); setSelectedPreview(sfx.name) }}
                  className="glass rounded-lg px-3 py-2 text-xs font-medium hover:bg-muted/50 transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3" />
                  {sfx.label}
                </button>
              ))}
            </div>
          </div>

          {!premiumUnlocked && (
            <div className="glass rounded-xl p-4 border border-yellow-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Premium Audio</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Unlock premium environments (Ocean, Café) and premium sound profile for an immersive experience.
              </p>
              <button
                onClick={() => alert('Premium is coming soon. Stay tuned!')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs font-medium hover:opacity-90"
              >
                Unlock Premium
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'appearance' && (
        <div className="space-y-4">
          <div className="glass rounded-xl p-4">
            <h3 className="text-sm font-medium mb-4">Theme</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'neon-dreams', name: 'Neon Dreams', gradient: 'from-purple-500 to-pink-500' },
                { id: 'deep-space', name: 'Deep Space', gradient: 'from-indigo-900 to-blue-900' },
                { id: 'midnight-ocean', name: 'Midnight Ocean', gradient: 'from-teal-900 to-blue-900' },
                { id: 'aurora', name: 'Aurora', gradient: 'from-green-500 to-blue-500' },
                { id: 'cyber', name: 'Cyber Synth', gradient: 'from-pink-500 to-yellow-500' },
                { id: 'minimal', name: 'Minimal Light', gradient: 'from-gray-100 to-white' },
              ].map(theme => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`glass rounded-xl p-3 text-center hover:scale-[1.02] transition-all`}
                >
                  <div className={`w-full h-12 rounded-lg bg-gradient-to-br ${theme.gradient} mb-2`} />
                  <span className="text-xs font-medium">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="glass rounded-xl p-4">
          <h3 className="text-sm font-medium mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            {[
              { key: 'missionReminders', label: 'Mission Reminders', desc: 'Get reminded about upcoming deadlines' },
              { key: 'achievementAlerts', label: 'Achievement Alerts', desc: 'Celebrate when you unlock achievements' },
              { key: 'streakNotifications', label: 'Streak Notifications', desc: 'Stay on top of your streaks' },
              { key: 'dailyBriefing', label: 'Daily Briefing', desc: 'Receive a daily summary every morning' },
              { key: 'focusReminders', label: 'Focus Session Reminders', desc: 'Remind you to take breaks' },
            ].map((pref) => (
              <div key={pref.key} className="flex items-center justify-between">
                <div>
                  <span className="text-sm">{pref.label}</span>
                  <p className="text-xs text-muted-foreground">{pref.desc}</p>
                </div>
                <button
                  onClick={() => setPreferences(p => ({ ...p, [pref.key]: !p[pref.key] }))}
                  className={`relative w-10 h-5 rounded-full transition-colors ${preferences[pref.key] ? 'bg-primary' : 'bg-muted'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${preferences[pref.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'privacy' && (
        <div className="glass rounded-xl p-4">
          <h3 className="text-sm font-medium mb-4">Privacy & Data</h3>
          <div className="space-y-4">
            {[
              { key: 'analyticsCollection', label: 'Analytics Collection', desc: 'Help us improve with usage data' },
              { key: 'aiProcessing', label: 'AI Processing', desc: 'Allow AI features to process your data' },
              { key: 'exportData', label: 'Export Data', desc: 'Download all your mission data' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <span className="text-sm">{item.label}</span>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <button
                  onClick={() => {
                    if (item.key === 'exportData') {
                      alert('Data export coming soon')
                      return
                    }
                    setPrivacySettings(p => ({ ...p, [item.key]: !p[item.key] }))
                  }}
                  className={`relative w-10 h-5 rounded-full transition-colors ${privacySettings[item.key] ? 'bg-primary' : 'bg-muted'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${privacySettings[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
