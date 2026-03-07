import { randomUUID } from 'node:crypto'
import { expect, test } from '@playwright/test'
import { newSession, postJson, uniqueEmail } from '../helpers/api'
import { ensureAdminAccount, loginViaWebApi } from '../helpers/auth'
import { getConfig } from '../helpers/env'

type AuthLoginResponse = {
  tokens: {
    access_token: string
  }
}

type CreatedTest = {
  test_id: string
  questions: Array<{ question_id: string }>
}

type Assignment = {
  assignment_id: string
  test_id: string
  status: string
}

test.describe('Assessment flow', () => {
  test('@smoke assign -> start attempt -> submit -> result visible', async () => {
    const cfg = getConfig()
    await ensureAdminAccount(cfg.authBaseUrl, cfg.adminIdentifier, cfg.adminPassword)

    const adminLoginRes = await fetch(`${cfg.authBaseUrl}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: cfg.adminIdentifier,
        password: cfg.adminPassword
      })
    })
    expect(adminLoginRes.status).toBe(200)
    const adminLoginJson = (await adminLoginRes.json()) as AuthLoginResponse
    const adminAccessToken = adminLoginJson.tokens.access_token

    const subjectCode = `math_${randomUUID().slice(0, 8)}`
    const nodeId = `M2-${randomUUID().slice(0, 8)}`
    const adminHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminAccessToken}`
    }

    const subjectRes = await fetch(`${cfg.assessmentBaseUrl}/v1/admin/subjects`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        code: subjectCode,
        name: `Math ${subjectCode}`
      })
    })
    expect(subjectRes.status).toBe(201)

    const microSkillRes = await fetch(`${cfg.assessmentBaseUrl}/v1/admin/micro-skills`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        node_id: nodeId,
        subject_code: subjectCode,
        grade: 2,
        section_code: 'R1',
        section_name: 'Numbers',
        micro_skill_name: 'Addition without carry',
        predecessor_ids: [],
        criticality: 'medium'
      })
    })
    expect(microSkillRes.status).toBe(201)

    const testRes = await fetch(`${cfg.assessmentBaseUrl}/v1/admin/tests`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        subject_code: subjectCode,
        grade: 2,
        questions: [
          {
            node_id: nodeId,
            text: '2 + 2 = ?',
            answer_key: '4',
            max_score: 1
          }
        ]
      })
    })
    expect(testRes.status).toBe(201)
    const testJson = (await testRes.json()) as CreatedTest
    const createdTestId = testJson.test_id
    const questionId = testJson.questions[0].question_id

    const userCtx = await newSession(cfg.userWebBaseUrl)
    const email = uniqueEmail('assessment')
    const password = 'Password123!'
    await postJson(userCtx, '/api/auth/register', { email, password }, 200)
    await postJson(userCtx, '/api/auth/login', { identifier: email, password }, 200)
    await postJson(userCtx, '/api/user/create', { name: 'Assessment Parent' }, 200)
    await postJson(
      userCtx,
      '/api/children',
      { name: 'Assessment Kid', birthdate: '2020-05-15' },
      200
    )

    const me = await userCtx.get('/api/me')
    expect(me.status()).toBe(200)
    const meJson = (await me.json()) as { children: Array<{ child_id: string }> }
    expect(meJson.children.length).toBeGreaterThan(0)
    const childId = meJson.children[0].child_id

    const adminCtx = await newSession(cfg.adminWebBaseUrl)
    await loginViaWebApi(adminCtx, '/api/auth/login', cfg.adminIdentifier, cfg.adminPassword)

    const assignmentRes = await adminCtx.post('/api/admin/assignments', {
      data: {
        test_id: createdTestId,
        child_id: childId
      }
    })
    expect(assignmentRes.status()).toBe(200)
    await assignmentRes.json()
    await adminCtx.dispose()

    const assignmentsRes = await userCtx.get('/api/assignments', {
      params: { childId }
    })
    expect(assignmentsRes.status()).toBe(200)
    const assignmentsJson = (await assignmentsRes.json()) as Assignment[]
    const target = assignmentsJson.find(item => item.test_id === createdTestId)
    expect(target).toBeTruthy()

    const startRes = await userCtx.post('/api/attempts/start', {
      data: {
        assignment_id: target!.assignment_id,
        child_id: childId
      }
    })
    expect(startRes.status()).toBe(200)
    const startJson = (await startRes.json()) as { attempt_id: string }
    const attemptId = startJson.attempt_id

    const submitRes = await userCtx.post(`/api/attempts/${attemptId}/submit`, {
      data: {
        answers: [{ question_id: questionId, value: '4' }]
      }
    })
    expect(submitRes.status()).toBe(200)

    const resultRes = await userCtx.get(`/api/attempts/${attemptId}/result`)
    expect(resultRes.status()).toBe(200)
    const resultJson = (await resultRes.json()) as {
      attempt_id: string
      status: string
      score: number
    }
    expect(resultJson.attempt_id).toBe(attemptId)
    expect(resultJson.status).toBe('submitted')
    expect(resultJson.score).toBeGreaterThanOrEqual(1)

    await userCtx.dispose()
  })
})
