# Релизный baseline

Дата фиксации: 2026-03-08  
Версия baseline: `v0.2.0`

## Репозитории baseline

| Репозиторий | Ветка | Tag | Commit |
| --- | --- | --- | --- |
| `auth-service` | `main` | `v0.2.0` | `14211f494178` |
| `user-children-service` | `main` | `v0.2.0` | `f33a2c5ce9c5` |
| `assessment-service` | `main` | `v0.2.0` | `d714b2a37fc6` |
| `user-web` | `main` | `v0.2.0` | `a4d94dd8203c` |
| `admin-web` | `main` | `v0.2.0` | `b5f4f431623c` |
| `e2e` | `main` | `v0.2.0` | `см. tag v0.2.0` |

## Что подтверждено

- Публичный стенд:
  - `http://89.168.77.132:8000/healthz`
  - `http://89.168.77.132:8001/healthz`
  - `http://89.168.77.132:8003/healthz`
  - `http://89.168.77.132:3000`
  - `http://89.168.77.132:3001`
- E2E smoke: `6/6 passed`.

## Публикация тегов

В каждом репозитории:

```bash
git push origin v0.2.0
```
