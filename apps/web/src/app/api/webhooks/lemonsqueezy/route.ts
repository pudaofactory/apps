import { prisma } from '@/server/prisma'
import { ensureCredits } from '@/server/credits'
import * as crypto from 'crypto'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

const SIGNING_SECRET = process.env.LEMONSQUEEZY_SIGNING_SECRET || ''

/**
 * Verify HMAC signature from Lemon Squeezy
 */
function verifySignature(rawBody: string, signature: string): boolean {
  if (!SIGNING_SECRET) return false
  const hmac = crypto.createHmac('sha256', SIGNING_SECRET)
  hmac.update(rawBody)
  const digest = hmac.digest('hex')
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
}

/**
 * Deduce plan from variant name (case-insensitive)
 */
function deducePlan(variantName: string): 'PRO' | 'YEAR' {
  return /year/i.test(variantName) ? 'YEAR' : 'PRO'
}

/**
 * Map Lemon Squeezy subscription status to our enum
 */
function mapStatus(lsStatus: string): 'active' | 'trialing' | 'past_due' | 'canceled' {
  const normalized = lsStatus.toLowerCase()
  if (normalized === 'active' || normalized === 'on_trial') return normalized === 'on_trial' ? 'trialing' : 'active'
  if (normalized === 'past_due') return 'past_due'
  if (normalized === 'cancelled' || normalized === 'expired' || normalized === 'unpaid') return 'canceled'
  return 'active' // fallback
}

export async function POST(req: NextRequest) {
  try {
    // Read raw body
    const rawBody = await req.text()
    const signature = req.headers.get('x-signature') || ''

    // Verify HMAC
    if (!verifySignature(rawBody, signature)) {
      console.error('[LemonSqueezy Webhook] Invalid signature')
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401 })
    }

    // Parse payload
    const payload = JSON.parse(rawBody)
    const eventName = payload.meta?.event_name
    const data = payload.data

    if (!eventName || !data) {
      console.error('[LemonSqueezy Webhook] Missing event_name or data')
      return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 })
    }

    console.log(`[LemonSqueezy Webhook] Received event: ${eventName}`)

    const email = data.attributes?.user_email || data.attributes?.customer_email
    const externalId = String(data.id)

    if (!email) {
      console.error('[LemonSqueezy Webhook] No email in payload')
      return new Response(JSON.stringify({ error: 'No email' }), { status: 400 })
    }

    // Upsert user
    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      user = await prisma.user.create({ data: { email } })
      console.log(`[LemonSqueezy Webhook] Created user: ${email}`)
    }

    // Handle subscription events
    if (eventName.startsWith('subscription_')) {
      const variantName = data.attributes?.variant_name || data.attributes?.product_name || ''
      const plan = deducePlan(variantName)
      const status = mapStatus(data.attributes?.status || 'active')
      const renewsAt = data.attributes?.renews_at ? new Date(data.attributes.renews_at) : null

      // Check for duplicate event (idempotency)
      const existing = await prisma.subscription.findUnique({ where: { userId: user.id } })
      if (existing && existing.externalId === externalId && existing.status === status) {
        console.log(`[LemonSqueezy Webhook] Duplicate event for subscription ${externalId}, skipping`)
        return new Response(JSON.stringify({ ok: true, message: 'Duplicate event' }), { status: 200 })
      }

      // Upsert subscription
      await prisma.subscription.upsert({
        where: { userId: user.id },
        update: {
          plan,
          status,
          provider: 'lemon_squeezy',
          externalId,
          renewsAt,
        },
        create: {
          userId: user.id,
          plan,
          status,
          provider: 'lemon_squeezy',
          externalId,
          renewsAt,
        },
      })

      console.log(`[LemonSqueezy Webhook] Upserted subscription for ${email}: plan=${plan}, status=${status}`)

      // Ensure credits if active or trialing
      if (status === 'active' || status === 'trialing') {
        await ensureCredits(user.id, plan)
        console.log(`[LemonSqueezy Webhook] Ensured credits for ${email}: plan=${plan}`)
      }
    }

    // Handle order (first purchase)
    if (eventName === 'order_created') {
      const variantName = data.attributes?.first_order_item?.variant_name || ''
      const plan = deducePlan(variantName)
      const amountUsd = (data.attributes?.total || 0) / 100 // cents to dollars

      // Check for duplicate payment
      const existingPayment = await prisma.payment.findFirst({
        where: { externalId, provider: 'lemon_squeezy' },
      })

      if (existingPayment) {
        console.log(`[LemonSqueezy Webhook] Duplicate payment for order ${externalId}, skipping`)
        return new Response(JSON.stringify({ ok: true, message: 'Duplicate payment' }), { status: 200 })
      }

      // Insert payment record
      await prisma.payment.create({
        data: {
          email,
          userId: user.id,
          plan,
          amountUsd,
          provider: 'lemon_squeezy',
          externalId,
        },
      })

      console.log(`[LemonSqueezy Webhook] Created payment for ${email}: plan=${plan}, amount=$${amountUsd}`)

      // Also upsert subscription for one-time purchases
      const existing = await prisma.subscription.findUnique({ where: { userId: user.id } })
      if (!existing) {
        await prisma.subscription.create({
          data: {
            userId: user.id,
            plan,
            status: 'active',
            provider: 'lemon_squeezy',
            externalId,
          },
        })
        await ensureCredits(user.id, plan)
        console.log(`[LemonSqueezy Webhook] Created subscription from order for ${email}`)
      }
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (error) {
    console.error('[LemonSqueezy Webhook] Error:', error)
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 })
  }
}
