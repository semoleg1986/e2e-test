# Релизный baseline

Дата фиксации: 2026-03-08  
Версия baseline: `v0.1.2`

## Репозитории baseline

| Репозиторий | Ветка | Tag | Commit |
| --- | --- | --- | --- |
| `auth-service` | `main` | `v0.1.2` | `14211f494178` |
| `user-children-service` | `main` | `v0.1.2` | `ea56dddbbabb` |
| `user-web` | `main` | `v0.1.2` | `bd0886daa4b4` |
| `admin-web` | `main` | `v0.1.2` | `2cae2bfe3abe` |
| `e2e` | `main` | `v0.1.2` | `2419d2ae02b6` |

## Что подтверждено

- Публичный стенд:
  - `http://89.168.77.132:8000/healthz`
  - `http://89.168.77.132:8001/healthz`
  - `http://89.168.77.132:3000`
  - `http://89.168.77.132:3001`
- E2E smoke: `5/5 passed`.

## Публикация тегов

В каждом репозитории:

```bash
git push origin v0.1.2
```
