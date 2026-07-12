# 🧠 Codebuff Skills — Web Absensi Pesantren

> Skill files reusable yang mengajarkan Codebuff cara bekerja dengan domain absensi pesantren dan pola pengembangan web.

## Cara Kerja Skills

1. File skill `.md` ada di `.claude/skills/`
2. Codebuff membaca skill ini saat startup untuk belajar domain-specific knowledge
3. Setiap skill mencakup satu area teknologi atau pola
4. Skill bisa saling referensi

## Skill yang Tersedia

| File | Mencakup |
|------|----------|
| `backend-conventions.md` | API design, error handling, middleware — auto-detect stack |
| `frontend-conventions.md` | Komponen, routing, state management, styling — auto-detect |
| `database.md` | ORM, schema, migrasi, query patterns — auto-detect |
| `api-integration.md` | Data fetching, caching, error handling — auto-detect |
| `ui-components.md` | Komponen UI, design system, komposisi — absensi pesantren |
| `testing.md` | Test runner, struktur, mocking — auto-detect |
| `git-conventions.md` | Git workflow, commit messages, branching |
| `accessibility.md` | a11y best practices, ARIA, keyboard nav |

## ⚠️ Penting

**Stack teknologi tidak ditetapkan di skill files.** AI agent harus menganalisis source code yang ada untuk mendeteksi stack aktual (framework, ORM, database, dll).
