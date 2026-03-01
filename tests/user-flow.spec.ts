import { expect, test } from '@playwright/test'
import { getConfig } from '../helpers/env'
import { getJson, newSession, postJson, uniqueEmail } from '../helpers/api'

test.describe('User flow', () => {
  test('@smoke register -> profile -> child', async () => {
    const cfg = getConfig()
    const userCtx = await newSession(cfg.userWebBaseUrl)
    const email = uniqueEmail('user_flow')
    const password = 'Password123!'

    await postJson(userCtx, '/api/auth/register', { email, password }, 200)
    await postJson(userCtx, '/api/auth/login', { identifier: email, password }, 200)

    const meBefore = await getJson(userCtx, '/api/me', 200)
    const meBeforeJson = await meBefore.json()
    expect(meBeforeJson.needs_profile).toBe(true)

    const profile = await postJson(userCtx, '/api/user/create', { name: 'Parent E2E' }, 200)
    const profileJson = await profile.json()
    expect(profileJson.status).toBe('active')

    await postJson(
      userCtx,
      '/api/children',
      { name: 'Kid One', birthdate: '2020-05-15' },
      200
    )

    const meAfter = await getJson(userCtx, '/api/me', 200)
    const meAfterJson = await meAfter.json()
    expect(meAfterJson.needs_profile).toBe(false)
    expect(Array.isArray(meAfterJson.children)).toBe(true)
    expect(meAfterJson.children.length).toBeGreaterThanOrEqual(1)

    await userCtx.dispose()
  })
})
