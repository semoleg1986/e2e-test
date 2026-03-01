import { expect, test } from '@playwright/test'
import { getConfig } from '../helpers/env'
import { newSession, postJson, uniqueEmail } from '../helpers/api'

test.describe('Access control', () => {
  test('@smoke regular user cannot access admin-web admin endpoints', async () => {
    const cfg = getConfig()
    const userCtx = await newSession(cfg.userWebBaseUrl)
    const email = uniqueEmail('access')
    const password = 'Password123!'

    await postJson(userCtx, '/api/auth/register', { email, password }, 200)
    await postJson(userCtx, '/api/auth/login', { identifier: email, password }, 200)

    // copy cookies to admin-web context to simulate a non-admin token calling admin api
    const cookieHeader = (await userCtx.storageState()).cookies
      .map((c) => `${c.name}=${c.value}`)
      .join('; ')

    const response = await fetch(`${cfg.adminWebBaseUrl}/api/admin/users`, {
      headers: { Cookie: cookieHeader }
    })
    expect(response.status).toBe(403)

    await userCtx.dispose()
  })
})
