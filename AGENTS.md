## Encoding Safety (mandatory)

- Any file that contains Cyrillic must stay UTF-8 and must not get mojibake.
- Prefer `apply_patch` for edits in files with Cyrillic.
- Never use PowerShell `Set-Content` / `Out-File` for Cyrillic files unless `-Encoding UTF8` is explicitly set.
- If shell rewrite is unavoidable, force UTF-8 output encoding and preserve existing line endings.
- After every edit that touches Russian text, run a mojibake check in touched files (look for broken patterns like `Р`, `С`, `Ð`, `Ñ` inside words).
- If mojibake is detected, stop and fix encoding before any further changes.
- Before final response, re-check all touched Cyrillic files for encoding integrity.
- Do not run broad repo-wide encoding rewrites unless the user explicitly asks.
