# Handoff

## Current state

The project foundation, Tehran-aware schedule engine, 39-unit rotation, Persian formatting, responsive schedule interface, live period status, week navigation, persisted unit lookup, and repository CI workflow are present on `main`. Every displayed week is generated directly from the anchor rotation. Manual schedule overrides remain explicitly out of scope.

## Confirmed decisions

- The website is Persian-first and fully RTL.
- Weeks begin on Saturday and use `Asia/Tehran` rather than the visitor's timezone.
- The MVP remains a static React, TypeScript, and Vite application with no backend.
- The visual design remains simple, readable, responsive, and modest.
- Public-facing UI text is Persian; domain identifiers remain English.
- Calendar arithmetic uses Gregorian date-only values represented at UTC midnight.
- Jalali conversion uses the built-in `Intl.DateTimeFormat` Persian calendar.
- Resolved schedules are generated solely from the fixed anchor rotation.
- Manual schedule overrides are explicitly out of scope.
- A selected unit is stored as a canonical integer string under `swimming-pool:selected-unit`; storage failure is non-fatal.
- Browsed weeks use an integer offset relative to the live Tehran week.
- CI currently uses `npm install` because the repository does not yet contain a lockfile.

## Current architecture

- `index.html`: Persian metadata, RTL direction, title, theme metadata, and font loading.
- `src/main.tsx`: guarded React root and global/navigation/unit-lookup style imports.
- `src/App.tsx`: live clock, week navigation, selected-unit persistence, schedule rendering, status summaries, unit lookup, and responsive tables/cards.
- `src/index.css`, `src/navigation.css`, `src/unitLookup.css`: modest responsive RTL presentation and state highlighting.
- `src/domain/schedule.ts`: fixed weekdays, time ranges, public/private/cleaning structure, and invariants.
- `src/domain/tehranTime.ts`: Tehran date/time extraction and UTC-safe date arithmetic.
- `src/domain/resolvedSchedule.ts`: authoritative anchor-based unit rotation and resolved weekly schedules.
- `src/domain/persianFormatting.ts`: Persian digits and Jalali labels.
- `src/domain/scheduleStatus.ts`: current day, active period, and next period.
- `src/domain/weekNavigation.ts`: displayed-week calculations and Persian relative labels.
- `src/domain/unitLookup.ts`: local-storage helpers and selected-unit schedule lookup.
- Matching `*.test.ts` files cover the domain modules, including both screenshot weeks.
- `.github/workflows/ci.yml`: push and pull-request verification using Node.js 22.16.0, dependency installation, linting, type checking, Vitest, and the Vite production build.
- `package.json`, `tsconfig*.json`, `eslint.config.js`, and `vite.config.ts`: project tooling.

## Interface behavior

- The current Tehran week is calculated automatically and updates while the page remains open.
- Users can browse previous and later weeks, with dates and all 39 unit assignments recalculated.
- Today, active-period, and next-period states appear only for the live week.
- Users can select a unit from 1 through 39, persist it locally, view its date/time summary, and see it highlighted in either responsive layout.
- Every displayed schedule comes directly from the same fixed rotation formula; no exception or override configuration is applied.

## CI behavior

- The workflow runs on pushes to `main` and on pull requests.
- It checks out the repository and uses Node.js `22.16.0`.
- It runs `npm install --no-audit --no-fund` because no lockfile exists yet.
- It then runs `npm run lint`, `npm run typecheck`, `npm run test:run`, and `npm run build` as separate steps.
- Concurrency cancels an older in-progress run for the same ref when a newer commit is pushed.
- Workflow permissions are limited to read-only repository contents.

## Documentation protocol

Each implementation run must read `README.md`, `docs/IMPLEMENTATION_PLAN.md`, `docs/HANDOFF.md`, and the complete `docs/RUN_LOG.md`. After implementation, update README status, append to the run log without removing history, and replace this handoff with the latest state.

## Verification performed

- The committed workflow was fetched from `main` and reviewed against the scripts defined in `package.json`.
- A local YAML parse confirmed the workflow has the expected checkout, Node setup, install, lint, type-check, test, and build steps.
- The workflow uses a Node version compatible with the existing Vite toolchain.
- The GitHub connector available in this run could not list push-triggered workflow runs, so the first Actions result has not been confirmed here.
- A lockfile could not be generated because the available local environment could not reach the npm registry and the GitHub connector does not provide a repository shell.

## Known uncertainties and issues

- The rotation rule is inferred from two screenshots and is assumed to continue indefinitely, as requested.
- No lockfile exists yet, so CI uses `npm install` rather than `npm ci`.
- The first GitHub Actions result still needs confirmation in the Actions interface or through a later connector capability.
- Browser rendering has not yet been inspected through a deployed preview.
- Week navigation remains intentionally unbounded.
- When local storage is blocked, unit selection cannot persist across page reloads.

## Exact next recommended task

Add static deployment configuration as a focused delivery task. Prefer GitHub Pages only when it is available for this private repository; otherwise add a host-neutral production-build artifact workflow and document the remaining hosting setup. Keep the application static, do not add secrets, a backend, an admin dashboard, or manual schedule overrides. Also inspect the first CI result if it becomes accessible and fix any reported failure before marking automated verification complete.
