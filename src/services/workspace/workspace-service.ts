import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { handleServiceError } from '@/lib/service-error'

export class WorkspaceService {
  async create(userId: string, theme?: string) {
    try {
      return prisma.workspaceProgression.create({
        data: { userId, theme: theme || 'neon-dreams' },
      })
    } catch (error) {
      handleServiceError(error, 'workspaceService.create')
    }
  }

  async getByUserId(userId: string) {
    try {
      return prisma.workspaceProgression.findUnique({ where: { userId } })
    } catch (error) {
      handleServiceError(error, 'workspaceService.getByUserId')
    }
  }

  async update(userId: string, data: { theme?: string; ambiance?: string; upgrades?: Prisma.InputJsonValue; decorations?: Prisma.InputJsonValue }) {
    try {
      return prisma.workspaceProgression.update({
        where: { userId },
        data,
      })
    } catch (error) {
      handleServiceError(error, 'workspaceService.update')
    }
  }

  async addUpgrade(userId: string, upgrade: string) {
    try {
      const current = await prisma.workspaceProgression.findUnique({ where: { userId } })
      const upgrades = ((current?.upgrades as string[]) || []) as string[]
      if (!upgrades.includes(upgrade)) {
        upgrades.push(upgrade)
      }
      return prisma.workspaceProgression.update({
        where: { userId },
        data: { upgrades: upgrades as Prisma.InputJsonValue },
      })
    } catch (error) {
      handleServiceError(error, 'workspaceService.addUpgrade')
    }
  }

  async addDecoration(userId: string, decoration: string) {
    try {
      const current = await prisma.workspaceProgression.findUnique({ where: { userId } })
      const decorations = ((current?.decorations as string[]) || []) as string[]
      if (!decorations.includes(decoration)) {
        decorations.push(decoration)
      }
      return prisma.workspaceProgression.update({
        where: { userId },
        data: { decorations: decorations as Prisma.InputJsonValue },
      })
    } catch (error) {
      handleServiceError(error, 'workspaceService.addDecoration')
    }
  }

  async delete(userId: string) {
    try {
      return prisma.workspaceProgression.delete({ where: { userId } })
    } catch (error) {
      handleServiceError(error, 'workspaceService.delete')
    }
  }
}

export const workspaceService = new WorkspaceService()
