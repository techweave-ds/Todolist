'use client'

import { useState } from 'react'
import { Plus, Check } from 'lucide-react'
import { toggleSubtask, createSubtask } from '@/app/actions'

interface Subtask {
  id: string
  title: string
  completed: boolean
}

interface SubtaskListProps {
  missionId: string
  subtasks?: Subtask[]
  onUpdate: () => void
}

export function SubtaskList({ missionId, subtasks = [], onUpdate }: SubtaskListProps) {
  const [newTitle, setNewTitle] = useState('')

  async function handleToggle(id: string, completed: boolean) {
    try {
      await toggleSubtask(id)
      onUpdate()
    } catch {}
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    try {
      await createSubtask(missionId, newTitle.trim())
      setNewTitle('')
      onUpdate()
    } catch {}
  }

  if (subtasks.length === 0 && !newTitle) return null

  return (
    <div className="mt-3 space-y-1 pl-1">
      {subtasks.map((st) => (
        <button
          key={st.id}
          onClick={() => handleToggle(st.id, st.completed)}
          className="flex items-center gap-2 w-full text-left py-1 px-2 rounded hover:bg-muted/30 transition-colors group"
        >
          <div
            className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
              st.completed
                ? 'bg-primary border-primary text-primary-foreground'
                : 'border-muted-foreground group-hover:border-primary'
            }`}
          >
            {st.completed && <Check className="w-2.5 h-2.5" />}
          </div>
          <span
            className={`text-xs ${
              st.completed ? 'line-through text-muted-foreground/50' : 'text-muted-foreground'
            }`}
          >
            {st.title}
          </span>
        </button>
      ))}

      <form onSubmit={handleAdd} className="flex items-center gap-2 py-1 px-2">
        <button
          type="submit"
          disabled={!newTitle.trim()}
          className="w-3.5 h-3.5 rounded border border-dashed border-muted-foreground/40 flex items-center justify-center shrink-0 hover:border-primary transition-colors disabled:opacity-30"
        >
          <Plus className="w-2 h-2 text-muted-foreground" />
        </button>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add subtask..."
          className="flex-1 bg-transparent text-xs text-muted-foreground placeholder:text-muted-foreground/30 outline-none"
        />
      </form>
    </div>
  )
}
