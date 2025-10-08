import { randomUUID } from 'crypto'
import { cookies } from 'next/headers'
import type { Plan, Subscription, User, Credit } from '@prisma/client'
import { prisma } from './prisma'
import { ensureCredits } from './credits'

export type SessionSnapshot = {
  uid: string
  user: User
  subscription: Subscription | null
  plan: Plan
  credits: {
    clip: number
    l10n: number
  }
  creditsRecord: Credit | null
}

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

/**
 * Ensure a uid cookie exists and that the anonymous user has FREE credits.
 */
export async function getOrCreateUid(): Promise<SessionSnapshot> {
  const cookieStore = cookies()
  let uid = cookieStore.get('uid')?.value

  if (!uid) {
    uid = randomUUID()
    cookieStore.set({
      name: 'uid',
      value: uid,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: ONE_YEAR_SECONDS
    })
  }

  const email = `anon_${uid}@example.local`

  const user = await prisma.user.upsert({
    where: { id: uid },
    update: {},
    create: {
      id: uid,
      email
    }
  })

  await ensureCredits(uid, 'FREE')

  const [subscription, creditsRecord] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId: uid } }),
    prisma.credit.findUnique({ where: { userId: uid } })
  ])

  const plan = (subscription?.plan ?? 'FREE') as Plan

  return {
    uid,
    user,
    subscription,
    plan,
    credits: {
      clip: creditsRecord?.clip ?? 0,
      l10n: creditsRecord?.l10n ?? 0
    },
    creditsRecord
  }
}

export async function getSessionSnapshot(): Promise<SessionSnapshot> {
  return getOrCreateUid()
}
