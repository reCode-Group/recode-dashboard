## Scope-First Workflow

- The project must be handled module-first to keep context small.
- For any task, first identify the owning route, page, feature, or service and read only that area.
- Expand context only to direct dependencies that are necessary to complete the task safely.
- Do not read or summarize the entire repository for a local change in one small module.
- Use `ARCHITECTURE.md` as the routing map for choosing the minimal relevant context.

## Module Boundaries

- Routing and navigation issues: start in `src/app/router` and the matching layout in `src/layouts`.
- Public site tasks: start in `src/views/Main`.
- Auth tasks: start in `src/views/Auth` and `src/services/auth.js`.
- Dashboard tasks: start in the exact subfolder under `src/views/Dashboard`.
- Constructor tasks: stay inside `src/features/constructor` unless a direct shared dependency is involved.
- API contract or request bugs: read the matching file in `src/services`.
- Shared UI bugs used across screens: read only the specific component in `src/components`.
- Global style or theme issues: read `src/theme`, `src/styles`, and only the affected components/pages.

## Context Budget Rules

- Prefer the smallest useful file set.
- Do not load sibling modules unless the behavior is shared or the call chain crosses into them.
- Do not inspect asset directories unless the task is explicitly about images, SVGs, or branding.
- When changing one page, avoid unrelated dashboard pages, marketing pages, and old experiments.

## Ignore Transient Files

- Always ignore dependency, build, cache, and temporary folders unless the task is specifically about tooling or build output.
- Ignore `node_modules`.
- Ignore `build`.
- Ignore `.git`.
- Ignore package manager caches, temporary exports, logs, and generated artifacts.
- Do not spend context on transient files when solving application tasks.

## Encoding Safety (mandatory)

- Any file that contains Cyrillic must stay UTF-8 and must not get mojibake.
- Prefer `apply_patch` for edits in files with Cyrillic.
- Never use PowerShell `Set-Content` / `Out-File` for Cyrillic files unless `-Encoding UTF8` is explicitly set.
- If shell rewrite is unavoidable, force UTF-8 output encoding and preserve existing line endings.
- After every edit that touches Russian text, run a mojibake check in touched files (look for broken patterns like `Р`, `С`, `Ð`, `Ñ` inside words).
- If mojibake is detected, stop and fix encoding before any further changes.
- Do not replace readable Cyrillic text with Unicode escape sequences like `\u0438`; keep Russian text in normal Cyrillic unless the user explicitly asks otherwise.
- Before final response, re-check all touched Cyrillic files for encoding integrity.
- Do not run broad repo-wide encoding rewrites unless the user explicitly asks.
