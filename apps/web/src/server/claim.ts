import * as crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me'

type ClaimPayload = {
  email: string
  plan: 'PRO' | 'YEAR'
  iat: number
  exp: number
}

/**
 * Generate a claim token for a customer who purchased before signup
 */
export function makeClaimToken(email: string, plan: 'PRO' | 'YEAR'): string {
  const payload: ClaimPayload = {
    email,
    plan,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  }

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url')

  return `${header}.${body}.${signature}`
}

/**
 * Verify and decode a claim token
 */
export function verifyClaimToken(token: string): ClaimPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [header, body, signature] = parts

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url')

    if (signature !== expectedSignature) return null

    // Decode payload
    const payload: ClaimPayload = JSON.parse(Buffer.from(body, 'base64url').toString())

    // Check expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) return null

    return payload
  } catch {
    return null
  }
}
