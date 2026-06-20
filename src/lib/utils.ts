import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffTime = d.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays > 0 && diffDays <= 7) return `${diffDays} days left`
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`
  return formatDate(d)
}

export function calculateLevel(totalXP: number): { level: number; currentXP: number; xpToNextLevel: number } {
  const BASE_XP = 100
  const SCALE_FACTOR = 1.5
  
  let level = 1
  let xpRequired: number = BASE_XP
  let accumulated = 0
  
  while (totalXP >= accumulated + xpRequired) {
    accumulated += xpRequired
    level++
    xpRequired = Math.floor(BASE_XP * Math.pow(SCALE_FACTOR, level - 1))
  }
  
  return {
    level,
    currentXP: totalXP - accumulated,
    xpToNextLevel: xpRequired,
  }
}

export function generateId(): string {
  return crypto.randomUUID?.() || Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function formatXp(amount: number): string {
  return amount.toLocaleString()
}
