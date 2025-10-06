type HeadersInit = Record<string, string>

function getAuthHeaders(): HeadersInit {
  const token = process.env.KV_TOKEN

  if (!token) {
    throw new Error('KV_TOKEN is not configured')
  }

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

function getKvBaseUrl() {
  const url = process.env.KV_URL

  if (!url) {
    throw new Error('KV_URL is not configured')
  }

  return url.replace(/\/$/, '')
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const url = `${getKvBaseUrl()}/get/${encodeURIComponent(key)}`
  const res = await fetch(url, {
    headers: getAuthHeaders()
  })

  if (!res.ok) {
    return null
  }

  return (await res.json()) as T
}

export async function kvPut(key: string, value: unknown, ttlSec = 86_400): Promise<void> {
  const url = `${getKvBaseUrl()}/set/${encodeURIComponent(key)}`
  await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ value, expiration_ttl: ttlSec })
  })
}
