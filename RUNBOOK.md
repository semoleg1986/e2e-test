# RUNBOOK

## Baseline
- Release baseline tag: `v0.2.0`
- Working repos: `auth-service`, `user-children-service`, `assessment-service`, `user-web`, `admin-web`, `e2e`
- Latest validated smoke result: `6 passed`

## Public Stand
- `auth-service`: `http://89.168.77.132:8000`
- `user-children-service`: `http://89.168.77.132:8001`
- `assessment-service`: `http://89.168.77.132:8003`
- `user-web`: `http://89.168.77.132:3000`
- `admin-web`: `http://89.168.77.132:3001`

## Runtime Order
1. `auth-service`
2. `user-children-service`
3. `assessment-service`
4. `user-web`
5. `admin-web`

## Server Deploy (Image Mode)
```bash
# auth-service
cd /opt/monitoring/deploy/auth-service && docker-compose pull && docker-compose up -d

# user-children-service
cd /opt/monitoring/deploy/user-children-service && docker-compose pull && docker-compose up -d

# user-web
cd /opt/monitoring/deploy/user-web && docker-compose pull && docker-compose up -d

# admin-web
cd /opt/monitoring/deploy/admin-web && docker-compose pull && docker-compose up -d

# assessment-service
cd /opt/monitoring/deploy/assessment-service && docker-compose pull && docker-compose up -d
```

## Health Check
```bash
curl -i http://89.168.77.132:8000/healthz
curl -i http://89.168.77.132:8001/healthz
curl -i http://89.168.77.132:8003/healthz
curl -I http://89.168.77.132:3000
curl -I http://89.168.77.132:3001
```

## CI Variables (Repo `e2e-test`)
Variables:
- `E2E_USER_WEB_URL=http://89.168.77.132:3000`
- `E2E_ADMIN_WEB_URL=http://89.168.77.132:3001`
- `E2E_AUTH_URL=http://89.168.77.132:8000`
- `E2E_USER_CHILDREN_URL=http://89.168.77.132:8001`
- `E2E_ASSESSMENT_URL=http://89.168.77.132:8003`

Secrets:
- `E2E_ADMIN_IDENTIFIER`
- `E2E_ADMIN_PASSWORD`

## Smoke Check
```bash
cd /Users/olegsemenov/Programming/monitoring/e2e
pnpm e2e:smoke
```

Expected result: `6 passed`.

## HTML Report
```bash
cd /Users/olegsemenov/Programming/monitoring/e2e
pnpm exec playwright show-report
```
