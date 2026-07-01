'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAIStore } from '@/store/ai-store'
import { useAppStore } from '@/store/app-store'
import { useAudioStore } from '@/store/audio-store'
import { Brain, Send, Volume2, VolumeX, X } from 'lucide-react'

const quickQuestions = [
  'How can I improve my focus?',
  'Help me prioritize my tasks',
  'How do I overcome procrastination?',
  'Tips for better time management',
]

type Props = {
  open: boolean
  onClose: () => void
}

export function AICoach({ open, onClose }: Props) {
  const { userId } = useAppStore()
  const { coachMessages, coachLoading, askCoach } = useAIStore()
  const { speak, stopSpeaking } = useAudioStore()
  const [input, setInput] = useState('')
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [coachMessages])

  useEffect(() => {
    if (open && coachMessages.length === 0) {
      if (userId) askCoach(userId)
    }
  }, [open, userId])

  useEffect(() => {
    const lastMsg = coachMessages[coachMessages.length - 1]
    if (voiceEnabled && lastMsg?.role === 'coach') {
      speak(lastMsg.content)
    }
    return () => stopSpeaking()
  }, [coachMessages, voiceEnabled]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = () => {
    if (!input.trim() || coachLoading) return
    if (!userId) return
    askCoach(userId, input.trim())
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-lg h-[600px] glass-strong rounded-2xl shadow-2xl flex flex-col"
          >
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-sm">AI Coach</h2>
              <p className="text-[10px] text-muted-foreground">Your personal productivity coach</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setVoiceEnabled(!voiceEnabled); if (voiceEnabled) stopSpeaking() }}
              className={`p-1.5 rounded-md transition-colors ${voiceEnabled ? 'text-primary bg-primary/10' : 'hover:bg-muted/50'}`}
              title={voiceEnabled ? 'Mute voice' : 'Enable voice'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="p-1 rounded-md hover:bg-muted/50">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {coachMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'glass'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}

          {coachMessages.length === 1 && !coachLoading && (
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => userId && askCoach(userId, q)}
                  className="text-xs px-3 py-1.5 rounded-full glass hover:bg-muted/50 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {coachLoading && (
            <div className="flex justify-start">
              <div className="glass rounded-xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="p-4 border-t shrink-0">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for advice..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-muted/50 border outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || coachLoading}
              className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
    </AnimatePresence>
  )
}
