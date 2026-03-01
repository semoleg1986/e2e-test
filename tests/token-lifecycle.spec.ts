import { expect, test } from '@playwright/test'
import { getConfig } from '../helpers/env'
import { newSession, postJson, uniqueEmail } from '../helpers/api'

test.describe('Token lifecycle', () => {
  test('@smoke login -> refresh -> logout -> refresh denied', async () => {
    const cfg = getConfig()
    const userCtx = await newSession(cfg.userWebBaseUrl)
    const email = uniqueEmail('token')
    const password = 'Password123!'

    await postJson(userCtx, '/api/auth/register', { email, password }, 200)
    await postJson(userCtx, '/api/auth/login', { identifier: email, password }, 200)

    const refreshOk = await userCtx.post('/api/auth/refresh')
    expect(refreshOk.status()).toBe(200)

    const logout = await userCtx.post('/api/auth/logout')
    expect(logout.status()).toBe(200)

    const refreshDenied = await userCtx.post('/api/auth/refresh')
    expect(refreshDenied.status()).toBe(401)

    await userCtx.dispose()
  })
})
