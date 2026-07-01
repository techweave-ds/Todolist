'use client'

import { useEffect, useRef, useState } from 'react'
import { audioEngine } from '@/audio/engine/audio-engine'

export interface AudioReactivityData {
  amplitude: number
  bass: number
  mid: number
  treble: number
}

export function useAudioReactivity() {
  const [data, setData] = useState<AudioReactivityData>({ amplitude: 0, bass: 0, mid: 0, treble: 0 })
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const analyser = audioEngine.getAnalyser()
    if (!analyser) return
    analyserRef.current = analyser

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const tick = () => {
      analyser.getByteFrequencyData(dataArray)
      let sum = 0
      let bassSum = 0
      let midSum = 0
      let trebleSum = 0
      const bassEnd = Math.floor(bufferLength * 0.2)
      const midEnd = Math.floor(bufferLength * 0.5)

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i]
        sum += v
        if (i < bassEnd) bassSum += v
        else if (i < midEnd) midSum += v
        else trebleSum += v
      }

      const count = bufferLength
      const bassCount = bassEnd
      const midCount = midEnd - bassEnd
      const trebleCount = count - midEnd

      setData({
        amplitude: sum / count / 255,
        bass: bassSum / bassCount / 255,
        mid: midSum / midCount / 255,
        treble: trebleSum / trebleCount / 255,
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    tick()
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return data
}
