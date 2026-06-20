export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'INTERNAL_ERROR',
    public readonly statusCode: number = 500,
  ) {
    super(message)
    this.name = 'ServiceError'
  }
}

export function handleServiceError(error: unknown, context: string): never {
  if (error instanceof ServiceError) throw error
  const message = error instanceof Error ? error.message : 'Unknown error'
  console.error(`[${context}] ${message}`, error)
  throw new ServiceError(`Service error: ${context}`, 'SERVICE_ERROR', 500)
}

export function prismaErrorHandler(error: unknown, context: string): void {
  const message = error instanceof Error ? error.message : 'Unknown error'
  console.error(`[Prisma:${context}] ${message}`, error)
}

export function createServiceMethod<Args extends unknown[], T>(
  fn: (...args: Args) => Promise<T>,
  context: string,
): (...args: Args) => Promise<T> {
  return async (...args: Args): Promise<T> => {
    try {
      return await fn(...args)
    } catch (error) {
      prismaErrorHandler(error, context)
      throw new ServiceError(`Service error: ${context}`, 'SERVICE_ERROR', 500)
    }
  }
}
