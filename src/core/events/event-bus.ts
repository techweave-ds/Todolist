import { AppEvent, EventHandler } from '@/core/types'

type HandlerId = string

class EventBus {
  private handlers: Map<string, Map<HandlerId, EventHandler>> = new Map()
  private static instance: EventBus

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus()
    }
    return EventBus.instance
  }

  subscribe(eventType: string, handler: EventHandler): () => void {
    return this.on(eventType, handler)
  }

  on(eventType: string, handler: EventHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Map())
    }
    const handlerId = crypto.randomUUID?.() || Math.random().toString(36).substring(2)
    this.handlers.get(eventType)!.set(handlerId, handler)

    return () => {
      this.handlers.get(eventType)?.delete(handlerId)
    }
  }

  off(eventType: string, handler: EventHandler): void {
    const handlers = this.handlers.get(eventType)
    if (!handlers) return
    handlers.forEach((h, id) => {
      if (h === handler) handlers.delete(id)
    })
  }

  once(eventType: string, handler: EventHandler): void {
    const wrapped: EventHandler = (event: AppEvent) => {
      const result = handler(event)
      this.off(eventType, wrapped)
      return result
    }
    this.on(eventType, wrapped)
  }

  async emit(event: AppEvent): Promise<void> {
    const eventHandlers = this.handlers.get(event.type)
    if (!eventHandlers) return

    const promises: Promise<void>[] = []
    eventHandlers.forEach((handler) => {
      const result = handler(event)
      if (result instanceof Promise) {
        promises.push(result)
      }
    })

    await Promise.allSettled(promises)
  }

  clear(): void {
    this.handlers.clear()
  }
}

export const eventBus = EventBus.getInstance()
