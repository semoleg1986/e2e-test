import { expect, test } from '@playwright/test'
import { getConfig } from '../helpers/env'
import { newSession, postJson, uniqueEmail } from '../helpers/api'
import { ensureAdminAccount, loginViaWebApi } from '../helpers/auth'

test.describe('Admin flow', () => {
  test('@smoke admin login -> users -> user children', async () => {
    const cfg = getConfig()
    await ensureAdminAccount(cfg.authBaseUrl, cfg.adminIdentifier, cfg.adminPassword)

    // prepare regular user and profile
    const authRes = await fetch(`${cfg.authBaseUrl}/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: uniqueEmail('admin_flow'), password: 'Password123!' })
    })
    expect([201, 409]).toContain(authRes.status)

    const loginRes = await fetch(`${cfg.authBaseUrl}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: cfg.adminIdentifier, password: cfg.adminPassword })
    })
    expect(loginRes.status).toBe(200)

    const adminCtx = await newSession(cfg.adminWebBaseUrl)
    await loginViaWebApi(adminCtx, '/api/auth/login', cfg.adminIdentifier, cfg.adminPassword)

    const me = await adminCtx.get('/api/me')
    expect(me.status()).toBe(200)
    expect((await me.json()).is_admin).toBe(true)

    const users = await adminCtx.get('/api/admin/users')
    expect(users.status()).toBe(200)
    const usersJson = await users.json()
    expect(Array.isArray(usersJson)).toBe(true)
    expect(usersJson.length).toBeGreaterThan(0)

    const firstUserId = usersJson[0].user_id as string
    const children = await adminCtx.get(`/api/admin/users/${firstUserId}/children`)
    expect(children.status()).toBe(200)

    await adminCtx.dispose()
  })
})
