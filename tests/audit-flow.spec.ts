import { expect, test } from '@playwright/test'
import { getConfig } from '../helpers/env'
import { getJson, newSession, postJson, uniqueEmail } from '../helpers/api'
import { ensureAdminAccount, loginViaWebApi } from '../helpers/auth'

test.describe('Audit flow', () => {
  test('@smoke user actions appear in admin audit feed', async () => {
    const cfg = getConfig()
    await ensureAdminAccount(cfg.authBaseUrl, cfg.adminIdentifier, cfg.adminPassword)

    const userCtx = await newSession(cfg.userWebBaseUrl)
    const email = uniqueEmail('audit')
    const password = 'Password123!'
    await postJson(userCtx, '/api/auth/register', { email, password }, 200)
    await postJson(userCtx, '/api/auth/login', { identifier: email, password }, 200)
    await postJson(userCtx, '/api/user/create', { name: 'Audit Parent' }, 200)
    await postJson(userCtx, '/api/children', { name: 'Audit Kid', birthdate: '2020-05-15' }, 200)
    await userCtx.dispose()

    const adminCtx = await newSession(cfg.adminWebBaseUrl)
    await loginViaWebApi(adminCtx, '/api/auth/login', cfg.adminIdentifier, cfg.adminPassword)
    const audit = await getJson(adminCtx, '/api/admin/audit/events', 200, {
      action: 'child.created'
    })
    const events = await audit.json()
    expect(Array.isArray(events)).toBe(true)
    expect(events.length).toBeGreaterThan(0)
    expect(events[0]).toHaveProperty('action', 'child.created')
    expect(events[0]).toHaveProperty('actor_id')
    expect(events[0]).toHaveProperty('target_id')

    await adminCtx.dispose()
  })
})
