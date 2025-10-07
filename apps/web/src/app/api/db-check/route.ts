import { prisma } from '@/server/prisma'

export async function GET() {
  const users = await prisma.user.count()
  return Response.json({ ok: true, users })
}


