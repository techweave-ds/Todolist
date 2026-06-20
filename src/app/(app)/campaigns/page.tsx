'use client'

import { useState } from 'react'
import { useCampaignStore } from '@/store/campaign-store'
import { useAppStore } from '@/store/app-store'
import { Plus, MoreHorizontal } from 'lucide-react'

export default function CampaignsPage() {
  const { campaigns, isLoading, createCampaign, deleteCampaign } = useCampaignStore()
  const { userId } = useAppStore()
  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [emoji, setEmoji] = useState('🎯')

  const emojis = ['🎯', '🚀', '🌟', '🎨', '📚', '💼', '🏠', '💪', '🧠', '🎵']

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    await createCampaign({ title, description, emoji }, userId)
    setTitle('')
    setDescription('')
    setShowCreate(false)
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-sm text-muted-foreground">Large goals and projects</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="glass rounded-xl p-4 animate-slide-up">
          <div className="space-y-3">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Campaign name..."
              className="w-full px-3 py-2 rounded-lg bg-muted/50 border outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              autoFocus
            />
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description..."
              className="w-full px-3 py-2 rounded-lg bg-muted/50 border outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none h-20"
            />
            <div className="flex gap-2">
              {emojis.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all ${
                    emoji === e ? 'bg-primary/20 ring-2 ring-primary' : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Create</button>
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground">Cancel</button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-2 text-center py-12 text-muted-foreground">Loading campaigns...</div>
        ) : campaigns.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <p className="text-muted-foreground">No campaigns yet</p>
          </div>
        ) : (
          campaigns.map((campaign: any) => (
            <div key={campaign.id} className="glass rounded-xl p-4 mission-card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{campaign.emoji}</span>
                  <div>
                    <h3 className="font-medium text-sm">{campaign.title}</h3>
                    {campaign.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{campaign.description}</p>
                    )}
                  </div>
                </div>
                <button onClick={() => userId && deleteCampaign(campaign.id, userId)} className="p-1 rounded hover:bg-muted/50">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>{campaign.completedMissions || 0}/{campaign.totalMissions || 0} missions</span>
                <span>+{campaign.totalXP || 0} XP</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                  style={{ width: `${campaign.progress || 0}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
