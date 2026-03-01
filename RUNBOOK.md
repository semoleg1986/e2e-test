# RUNBOOK

## Baseline
- Release baseline tag: `v0.1.0`
- Working repos: `auth-service`, `user-children-service`, `user-web`, `admin-web`, `e2e`

## Start order
1. `auth-service` (port `8000`)
2. `user-children-service` (port `8001`)
3. `user-web` (port `3000`)
4. `admin-web` (port `3001`)

## Local start commands
```bash
# terminal 1
cd /Users/olegsemenov/Programming/monitoring/auth-service && make run

# terminal 2
cd /Users/olegsemenov/Programming/monitoring/user-children-service && make run

# terminal 3
cd /Users/olegsemenov/Programming/monitoring/user-web && pnpm dev --port 3000

# terminal 4
cd /Users/olegsemenov/Programming/monitoring/admin-web && pnpm dev --port 3001
```

## Smoke check
```bash
cd /Users/olegsemenov/Programming/monitoring/e2e
pnpm e2e:smoke
```

Expected result: `5 passed`.

## HTML report
```bash
cd /Users/olegsemenov/Programming/monitoring/e2e
pnpm exec playwright show-report
```
