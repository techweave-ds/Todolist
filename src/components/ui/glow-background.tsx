'use client'

import { useEffect, useRef } from 'react'

const COLORS = [
  'rgba(120, 80, 240, 0.15)',
  'rgba(200, 100, 255, 0.1)',
  'rgba(80, 180, 255, 0.08)',
  'rgba(255, 100, 200, 0.08)',
]

export function GlowBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }
    }
    window.addEventListener('mousemove', handleMouse)

    let animId: number
    const animate = () => {
      timeRef.current += 0.003
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const cx = mouseRef.current.x * canvas.width
      const cy = mouseRef.current.y * canvas.height

      COLORS.forEach((color, i) => {
        const angle = timeRef.current + (i * Math.PI * 2) / COLORS.length
        const radius = 250 + Math.sin(timeRef.current * 0.5 + i) * 80
        const ox = cx + Math.sin(angle) * canvas.width * 0.15
        const oy = cy + Math.cos(angle) * canvas.height * 0.1

        const gradient = ctx.createRadialGradient(ox, oy, 0, ox, oy, radius)
        gradient.addColorStop(0, color)
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouse)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
