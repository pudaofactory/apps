import { prisma } from './prisma'
import type { $Enums } from '@prisma/client'
type Plan = $Enums.Plan

const PLAN_QUOTA = {
  FREE: { clip: 20, l10n: 10 },
  PRO: { clip: 100, l10n: 300 },
  YEAR: { clip: 150, l10n: 500 }
} as const

export async function ensureCredits(userId: string, plan: Plan) {
  const q = PLAN_QUOTA[plan]
  await prisma.credit.upsert({
    where: { userId },
    update: { clip: q.clip, l10n: q.l10n },
    create: { userId, clip: q.clip, l10n: q.l10n }
  })
}


