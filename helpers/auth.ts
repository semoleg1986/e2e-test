import { expect, type APIRequestContext } from '@playwright/test'

export async function ensureAdminAccount(
  authBaseUrl: string,
  identifier: string,
  password: string
): Promise<void> {
  const res = await fetch(`${authBaseUrl}/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: identifier, password })
  })

  // 201 - created, 409 - already exists (both acceptable for idempotent setup)
  expect([201, 409]).toContain(res.status)
}

export async function loginViaWebApi(
  ctx: APIRequestContext,
  path: string,
  identifier: string,
  password: string,
  expectedStatus = 200
) {
  const response = await ctx.post(path, {
    data: { identifier, password }
  })
  expect(response.status()).toBe(expectedStatus)
  return response
}
