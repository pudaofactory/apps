import { Prisma, Credit, UsageEvent } from '@prisma/client'
import { prisma } from './prisma'

export class InsufficientCreditsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InsufficientCreditsError'
  }
}

export type ConsumeResult = {
  credits: Credit
  usage: UsageEvent
}

export async function consumeCredit(
  userId: string,
  product: 'clip' | 'l10n',
  units = 1
): Promise<ConsumeResult> {
  if (!userId) {
    throw new Error('MISSING_USER_ID')
  }

  if (!['clip', 'l10n'].includes(product)) {
    throw new Error('INVALID_PRODUCT')
  }

  const amount = Number(units)
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('INVALID_UNITS')
  }

  return prisma.$transaction(async tx => {
    const credit = await tx.credit.findUnique({ where: { userId } })

    if (!credit) {
      throw new InsufficientCreditsError('NO_CREDITS')
    }

    if ((credit as Credit)[product] < amount) {
      throw new InsufficientCreditsError('INSUFFICIENT_CREDITS')
    }

    const updated = await tx.credit.update({
      where: { userId },
      data: {
        [product]: { decrement: amount }
      }
    })

    const usage = await tx.usageEvent.create({
      data: {
        userId,
        product,
        tokens: 0,
        costUsd: new Prisma.Decimal(0),
        provider: 'mock'
      }
    })

    return { credits: updated, usage }
  })
}
