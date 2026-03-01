import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export type E2EConfig = {
  userWebBaseUrl: string
  adminWebBaseUrl: string
  authBaseUrl: string
  userChildrenBaseUrl: string
  adminIdentifier: string
  adminPassword: string
}

let loadedFromDotenv = false

function loadDotenvIfNeeded() {
  if (loadedFromDotenv) return
  loadedFromDotenv = true

  const __dirname = dirname(fileURLToPath(import.meta.url))
  const candidates = [
    resolve(__dirname, '../.env'),
    resolve(__dirname, '../.env.e2e')
  ]

  for (const filePath of candidates) {
    if (!existsSync(filePath)) continue
    const content = readFileSync(filePath, 'utf8')
    for (const rawLine of content.split('\n')) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const eqIndex = line.indexOf('=')
      if (eqIndex <= 0) continue
      const key = line.slice(0, eqIndex).trim()
      let value = line.slice(eqIndex + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (process.env[key] === undefined) {
        process.env[key] = value
      }
    }
  }
}

export function getConfig(): E2EConfig {
  loadDotenvIfNeeded()

  return {
    userWebBaseUrl: process.env.E2E_USER_WEB_URL || 'http://localhost:3000',
    adminWebBaseUrl: process.env.E2E_ADMIN_WEB_URL || 'http://localhost:3001',
    authBaseUrl: process.env.E2E_AUTH_URL || 'http://127.0.0.1:8000',
    userChildrenBaseUrl: process.env.E2E_USER_CHILDREN_URL || 'http://127.0.0.1:8001',
    adminIdentifier: process.env.E2E_ADMIN_IDENTIFIER || 'admin_e2e@example.com',
    adminPassword: process.env.E2E_ADMIN_PASSWORD || 'Password123!'
  }
}
