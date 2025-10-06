import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json(
    { ok: true, ts: new Date().toISOString() },
    {
      headers: {
        'cache-control': 'no-store',
      },
    }
  );
}
