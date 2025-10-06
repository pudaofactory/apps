import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'

const COOKIE_NAME = 'uid'

export function getUserId() {
  const store = cookies()
  let id = store.get(COOKIE_NAME)?.value

  if (!id) {
    id = randomUUID()
    store.set(COOKIE_NAME, id, {
      httpOnly: true,
      sameSite: 'lax'
    })
  }

  return id
}
