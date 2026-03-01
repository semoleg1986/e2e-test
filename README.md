# e2e

Playwright e2e для рабочего контура:
- `user-web`
- `admin-web`
- `auth-service`
- `user-children-service`

## Конфиг env
Используется автозагрузка из:
1. `/Users/olegsemenov/Programming/monitoring/e2e/.env`
2. fallback: `/Users/olegsemenov/Programming/monitoring/e2e/.env.e2e`

Рекомендуемый старт:
```bash
cd /Users/olegsemenov/Programming/monitoring/e2e
cp .env.e2e.example .env
pnpm install
pnpm exec playwright install
```

## Порядок запуска перед e2e
1. `auth-service` (`:8000`)
2. `user-children-service` (`:8001`)
3. `user-web` (`:3000`)
4. `admin-web` (`:3001`)

## Запуск тестов
```bash
pnpm e2e
pnpm e2e:smoke
pnpm e2e:debug
```

## CI (schedule/release)
Workflow: `/Users/olegsemenov/Programming/monitoring/e2e/.github/workflows/smoke.yml`

Required GitHub variables:
- `E2E_USER_WEB_URL`
- `E2E_ADMIN_WEB_URL`
- `E2E_AUTH_URL`
- `E2E_USER_CHILDREN_URL`

Required GitHub secrets:
- `E2E_ADMIN_IDENTIFIER`
- `E2E_ADMIN_PASSWORD`

## Smoke покрытие
- `user-flow`: register -> profile -> child
- `admin-flow`: admin login -> users -> user children
- `access-control`: user не имеет admin доступа
- `token-lifecycle`: login -> refresh -> logout -> refresh denied
- `audit-flow`: действия пользователя видны в аудите

## Текущий результат
Ожидаемый baseline: `5/5 passed`.

Отчет:
```bash
pnpm exec playwright show-report
```
