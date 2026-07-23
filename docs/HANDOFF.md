# Handoff

## Current state

The project foundation, Tehran-aware schedule engine, 39-unit rotation, Persian formatting, responsive schedule interface, live period status, week navigation, and persisted unit lookup are present on `main`. Every displayed week is generated directly from the anchor rotation. The previously added manual-override layer was removed after the product requirement was clarified.

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
- `package.json`, `tsconfig*.json`, `eslint.config.js`, and `vite.config.ts`: project tooling.

## Interface behavior

- The current Tehran week is calculated automatically and updates while the page remains open.
- Users can browse previous and later weeks, with dates and all 39 unit assignments recalculated.
- Today, active-period, and next-period states appear only for the live week.
- Users can select a unit from 1 through 39, persist it locally, view its date/time summary, and see it highlighted in either responsive layout.
- Every displayed schedule comes directly from the same fixed rotation formula; no exception or override configuration is applied.

## Documentation protocol

Each implementation run must read `README.md`, `docs/IMPLEMENTATION_PLAN.md`, `docs/HANDOFF.md`, and the complete `docs/RUN_LOG.md`. After implementation, update README status, append to the run log without removing history, and replace this handoff with the latest state.

## Verification performed

- `src/domain/resolvedSchedule.ts` was restored to the previously verified direct rotation implementation.
- The manual override configuration, domain module, and tests were removed.
- The remaining schedule consumers continue to call `resolveWeeklySchedule`, so live status, navigation, and unit lookup all use the authoritative generated schedule.
- Existing tests cover both supplied screenshot sequences, unit uniqueness, Tehran rollover, Persian date boundaries, week navigation, current/next status, and unit lookup.
- Full dependency installation, actual Vitest execution, linting, TypeScript project checking, Vite production build, and browser rendering remain pending because the connector does not provide a repository shell or preview.

## Known uncertainties and issues

- The rotation rule is inferred from two screenshots and is assumed to continue indefinitely, as requested.
- No lockfile exists yet.
- Full automated checks and browser verification have not yet run.
- Week navigation remains intentionally unbounded.
- When local storage is blocked, unit selection cannot persist across page reloads.

## Exact next recommended task

Add a GitHub Actions workflow that installs dependencies and runs `npm run lint`, `npm run typecheck`, `npm run test:run`, and `npm run build` on pushes and pull requests. Resolve any failures found by CI and generate a lockfile through a verified install if feasible. Keep deployment configuration for the following run.