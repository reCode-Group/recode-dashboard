## Encoding Safety (mandatory)

- Files containing Cyrillic text must be edited with `apply_patch` whenever possible.
- Do not rewrite such files with `Set-Content` / `Out-File` unless `-Encoding UTF8` is explicitly provided.
- If shell rewriting is unavoidable, always use explicit UTF-8 output encoding.
- After editing Cyrillic strings, verify there is no mojibake in touched files (examples: `Р`, `С`, `Ð`, `Ñ` inside Russian text).
- Do not run broad repo-wide encoding rewrites unless the user explicitly asks.
