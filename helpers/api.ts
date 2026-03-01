import { expect, type APIRequestContext, request } from '@playwright/test'
import { randomUUID } from 'node:crypto'

export function uniqueEmail(prefix = 'e2e'): string {
  return `${prefix}_${randomUUID().slice(0, 8)}@example.com`
}

export async function newSession(baseURL: string): Promise<APIRequestContext> {
  return request.newContext({ baseURL })
}

export async function postJson(
  ctx: APIRequestContext,
  path: string,
  body: Record<string, unknown>,
  expectedStatus: number
) {
  const response = await ctx.post(path, { data: body })
  expect(response.status(), `POST ${path}`).toBe(expectedStatus)
  return response
}

export async function getJson(
  ctx: APIRequestContext,
  path: string,
  expectedStatus: number,
  params?: Record<string, string>
) {
  const response = await ctx.get(path, {
    params
  })
  expect(response.status(), `GET ${path}`).toBe(expectedStatus)
  return response
}
