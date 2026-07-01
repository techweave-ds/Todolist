'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useFocusStore } from '@/store/focus-store'
import { useAudioStore } from '@/store/audio-store'
import { useAppStore } from '@/store/app-store'
import { Play, Pause, Square, Coffee, Brain, Timer, Radio, Loader2 } from 'lucide-react'
import { FOCUS } from '@/core/constants'

type FocusMode = 'pomodoro' | 'short_break' | 'long_break' | 'custom'

export default function FocusPage() {
  const { isActive, timeRemaining, currentSession, statistics, weeklyData, startSession, endSession, fetchStats, fetchWeeklyData, setTimeRemaining } = useFocusStore()
  const { currentAmbient, playAmbient, stopAmbient, getAmbientEnvironments } = useAudioStore()
  const { userId } = useAppStore()
  const [mode, setMode] = useState<FocusMode>('pomodoro')
  const [minutes, setMinutes] = useState<number>(FOCUS.POMODORO_DURATION)
  const [seconds, setSeconds] = useState<number>(0)
  const [customMinutes, setCustomMinutes] = useState(30)
  const [distractions, setDistractions] = useState(0)
  const [ambientOpen, setAmbientOpen] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [starting, setStarting] = useState(false)
  const [ending, setEnding] = useState(false)
  const endedRef = useRef(false)

  const getDuration = useCallback((m: FocusMode) => {
    switch (m) {
      case 'pomodoro': return FOCUS.POMODORO_DURATION
      case 'short_break': return FOCUS.SHORT_BREAK
      case 'long_break': return FOCUS.LONG_BREAK
      case 'custom': return customMinutes
    }
  }, [customMinutes])

  useEffect(() => {
    if (!userId) return
    fetchStats(userId)
    fetchWeeklyData(userId)
  }, [userId, fetchStats, fetchWeeklyData])

  useEffect(() => {
    if (!isActive) {
      endedRef.current = false
      const duration = getDuration(mode)
      setMinutes(Math.floor(duration))
      setSeconds(0)
    }
  }, [mode, isActive, getDuration])

  useEffect(() => {
    if (!isActive || isPaused) return

    const interval = setInterval(() => {
      setTimeRemaining(timeRemaining - 1)
      setMinutes(Math.floor((timeRemaining - 1) / 60))
      setSeconds((timeRemaining - 1) % 60)
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, isPaused, timeRemaining, setTimeRemaining])

  useEffect(() => {
    if (!isActive || timeRemaining > 0 || !currentSession || endedRef.current || !userId) return
    endedRef.current = true
    endSession(currentSession.id, userId, getDuration(mode), true, distractions)
  }, [isActive, timeRemaining, currentSession, mode, getDuration, endSession, distractions, userId])

  const handleStart = async () => {
    if (!userId || starting) return
    setStarting(true)
    const duration = getDuration(mode)
    const sessionType = mode === 'pomodoro' ? 'pomodoro' : mode === 'custom' ? 'custom' : 'deep_focus'
    await startSession({ type: sessionType, duration: mode === 'custom' ? customMinutes : duration }, userId)
    setTimeRemaining(duration * 60)
    if (sessionType === 'deep_focus' && !currentAmbient) {
      await playAmbient('focus_deep')
    }
    setStarting(false)
  }

  const handlePause = () => {
    setIsPaused(p => !p)
  }

  const handleStop = async () => {
    if (!userId || !currentSession || ending) return
    setEnding(true)
    const elapsed = getDuration(mode) * 60 - timeRemaining
    const actualMinutes = Math.ceil(elapsed / 60)
    await endSession(currentSession.id, userId, actualMinutes, false, distractions)
    if (currentAmbient) {
      stopAmbient()
    }
    setEnding(false)
  }

  const minutesDisplay = String(minutes).padStart(2, '0')
  const secondsDisplay = String(seconds >= 0 ? seconds : 0).padStart(2, '0')

  if (!userId) return null

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Focus</h1>
          <p className="text-sm text-muted-foreground">Deep work sessions</p>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="glass rounded-2xl p-8 max-w-md w-full">
          <div className="flex justify-center gap-2 mb-4">
            {(['pomodoro', 'short_break', 'long_break', 'custom'] as FocusMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  mode === m ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {m === 'pomodoro' ? 'Focus' : m === 'custom' ? 'Custom' : m === 'short_break' ? 'Short' : 'Long'}
              </button>
            ))}
          </div>

          {!isActive && (
            <div className="relative flex justify-center mb-4">
              <button
                onClick={() => setAmbientOpen(!ambientOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                  currentAmbient ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                {currentAmbient ? getAmbientEnvironments().find(e => e.id === currentAmbient)?.name : 'Ambient'}
              </button>
              {ambientOpen && (
                <div className="absolute top-full mt-1 z-10 glass rounded-xl p-2 w-48 grid gap-1">
                  {getAmbientEnvironments().map((env) => (
                    <button
                      key={env.id}
                      onClick={() => {
                        if (currentAmbient === env.id) { stopAmbient(); setAmbientOpen(false); return }
                        playAmbient(env.id)
                        setAmbientOpen(false)
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                        currentAmbient === env.id ? 'bg-primary/20 text-primary' : 'hover:bg-muted/50'
                      }`}
                    >
                      <span>{env.icon}</span>
                      <span>{env.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {mode === 'custom' && !isActive && (
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={customMinutes}
                  onChange={e => setCustomMinutes(Number(e.target.value))}
                  className="w-20 px-3 py-2 rounded-lg bg-muted/50 border outline-none text-center text-lg font-mono"
                  min={1}
                  max={180}
                />
                <span className="text-muted-foreground">min</span>
              </div>
            </div>
          )}

          <div className="text-center mb-8">
            <div className="text-7xl font-mono font-bold tracking-wider tabular-nums">
              {minutesDisplay}:{secondsDisplay}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {mode === 'pomodoro' ? 'Focus Time' : mode === 'short_break' ? 'Short Break' : mode === 'long_break' ? 'Long Break' : 'Custom Session'}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            {!isActive ? (
              <button onClick={handleStart} disabled={starting} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                {starting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                {starting ? 'Starting...' : 'Start'}
              </button>
            ) : (
              <>
                <button onClick={handlePause} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-500 text-white font-medium hover:opacity-90 transition-opacity">
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
                <button onClick={handleStop} disabled={ending} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                  {ending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Square className="w-5 h-5" />}
                  {ending ? 'Ending...' : 'End'}
                </button>
              </>
            )}
          </div>

          {isActive && (
            <div className="mt-6">
              <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
                <Brain className="w-4 h-4" />
                <button onClick={() => setDistractions(d => d + 1)} className="hover:text-foreground transition-colors">
                  Distractions: {distractions}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Timer className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Total Sessions</span>
          </div>
          <p className="text-2xl font-bold">{statistics?.totalSessions || 0}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Coffee className="w-4 h-4 text-orange-500" />
            <span className="text-xs text-muted-foreground">Total Minutes</span>
          </div>
          <p className="text-2xl font-bold">{statistics?.totalMinutes || 0}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-4 h-4 text-green-500" />
            <span className="text-xs text-muted-foreground">Avg Score</span>
          </div>
          <p className="text-2xl font-bold">{Math.round(statistics?.averageScore || 0)}</p>
        </div>
      </div>

      {weeklyData.length > 0 && (
        <div className="glass rounded-xl p-4">
          <h2 className="text-sm font-medium mb-3">This Week</h2>
          <div className="flex items-end gap-2 h-24">
            {weeklyData.map((day: any) => {
              const maxMinutes = Math.max(...weeklyData.map((d: any) => d.minutes), 1)
              const height = (day.minutes / maxMinutes) * 100
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">{day.minutes}m</span>
                  <div className="w-full rounded-lg bg-gradient-to-t from-primary to-accent transition-all" style={{ height: `${Math.max(height, 4)}%` }} />
                  <span className="text-[10px] text-muted-foreground">{new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
