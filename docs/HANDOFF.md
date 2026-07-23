# Handoff

## Current state

The project foundation is now present on `main`. The repository contains a minimal React, TypeScript, and Vite application with Persian document metadata, global RTL styling, and a simple responsive placeholder page. The schedule engine has not yet been implemented.

## Confirmed decisions

- The website is Persian-first and fully RTL.
- Weeks begin on Saturday.
- Schedule calculations use `Asia/Tehran` rather than the visitor's local timezone.
- The MVP is a static React and TypeScript application built with Vite.
- The weekly schedule is generated from an anchor week and a 39-unit rotation.
- The visual design should be simple, readable, responsive, and slightly polished.
- Public-facing UI text must be Persian.
- A backend and admin dashboard are out of scope for the MVP.
- Package management and local commands currently use npm.
- Vazirmatn is loaded from Google Fonts with Tahoma and Arial fallbacks.

## Current architecture

- `index.html`: Persian metadata, RTL document direction, page title, theme metadata, and font loading.
- `src/main.tsx`: guarded React root setup and strict-mode rendering.
- `src/App.tsx`: temporary Persian placeholder screen.
- `src/index.css`: global RTL layout, responsive placeholder styling, and numeric direction-isolation utility.
- `package.json`: Vite, React, TypeScript, ESLint, and Vitest scripts and dependencies.
- `tsconfig*.json`: strict application and tooling TypeScript configurations.
- `eslint.config.js`: flat ESLint configuration for TypeScript and React hooks.
- `vite.config.ts`: minimal React-enabled Vite configuration.

## Anchor data inferred from screenshots

- Week starting 1405/04/20: private slots begin with unit 39, then units 1 through 38.
- Week starting 1405/04/27: private slots begin with unit 38, then unit 39, then units 1 through 37.
- This indicates a one-slot weekly rotation.

## Documentation protocol

Each implementation run must read:

- `README.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/HANDOFF.md`
- `docs/RUN_LOG.md`

After implementation, each run must update the README status, append to the run log, and replace this handoff with the latest state.

## Known uncertainties and issues

- Two screenshots establish the rotation pattern but cannot prove whether management occasionally changes the schedule manually. The implementation must include configuration-based overrides.
- Package installation and command execution were not available through the GitHub connector during this run. The file structure and configuration were reviewed statically, but `npm install`, linting, type checking, tests, and production build have not yet been executed.
- No lockfile exists yet. A future run with command execution or CI should generate and commit it if appropriate.

## Exact next recommended task

Define strongly typed schedule configuration under `src/domain/` or `src/config/`: the seven Saturday-first weekdays, eight daily time ranges, fixed morning بانوان/آقایان assignments, private-slot positions, and Sunday/Tuesday/Thursday cleaning slots. Keep this task data-focused and add initial unit tests for structural invariants if practical. Do not implement date rotation until the fixed model is clear.
