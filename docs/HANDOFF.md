# Handoff

## Current state

The project foundation, fixed weekly schedule model, Tehran date primitives, 39-unit rotation engine, Persian formatting utilities, responsive schedule interface, and live current/next period behavior are now present on `main`. The application calculates the active Tehran week at runtime, refreshes its clock every 30 seconds, and displays all seven days in Persian using mobile cards below 900px and a desktop weekly table above that breakpoint.

## Confirmed decisions

- The website is Persian-first and fully RTL.
- Weeks begin on Saturday.
- Schedule calculations use `Asia/Tehran` rather than the visitor's local timezone.
- The MVP is a static React and TypeScript application built with Vite.
- The weekly schedule is generated from an anchor week and a 39-unit rotation.
- The visual design is simple, readable, responsive, and modestly styled.
- Public-facing UI text is Persian.
- A backend and admin dashboard are out of scope for the MVP.
- Package management and local commands currently use npm.
- Vazirmatn is loaded from Google Fonts with Tahoma and Arial fallbacks.
- Domain identifiers remain English, while user-facing labels remain Persian.
- Calendar arithmetic uses Gregorian date-only values represented at UTC midnight.
- Fixed schedule definitions remain immutable; resolved schedules add unit numbers without mutating public or cleaning periods.
- Jalali conversion uses the built-in `Intl.DateTimeFormat` Persian calendar.
- Live schedule status is calculated through pure domain helpers rather than inside React markup.
- The current interface remains read-only; week navigation, unit lookup, and manual overrides are separate tasks.

## Current architecture

- `index.html`: Persian metadata, RTL document direction, page title, theme metadata, and font loading.
- `src/main.tsx`: guarded React root setup and strict-mode rendering.
- `src/App.tsx`: live clock refresh, current-week calculation, Persian week header, current/next period summaries, schedule legend, today/period highlighting, mobile day cards, and desktop schedule table.
- `src/index.css`: complete responsive RTL styling, status cards, schedule cards, desktop table, today/active/next states, semantic period treatments, and accessibility helper styles.
- `src/domain/schedule.ts`: strongly typed fixed schedule model and runtime validation for exactly 39 private periods.
- `src/domain/schedule.test.ts`: structural schedule tests.
- `src/domain/tehranTime.ts`: Tehran Gregorian date extraction, Tehran hour/minute/second extraction, Saturday-first mapping, latest-Saturday calculation, and anchor week offsets.
- `src/domain/tehranTime.test.ts`: Tehran rollover, time-of-day extraction, and date arithmetic tests.
- `src/domain/resolvedSchedule.ts`: positive-modulo unit rotation and resolved weekly schedules.
- `src/domain/resolvedSchedule.test.ts`: screenshot sequence, uniqueness, wrapping, and date-resolution tests.
- `src/domain/persianFormatting.ts`: Persian digits, Jalali labels, and Saturday-to-Friday range formatting.
- `src/domain/persianFormatting.test.ts`: formatting and boundary tests.
- `src/domain/scheduleStatus.ts`: displayed-week validation, current-day detection, active-period detection, next-period search, and reusable position matching.
- `src/domain/scheduleStatus.test.ts`: before-opening, active, gap, after-closing, cleaning, end-of-week, outside-week, and invalid-start tests.
- `package.json`: Vite, React, TypeScript, ESLint, and Vitest scripts and dependencies.
- `tsconfig*.json`: strict application and tooling TypeScript configurations.
- `eslint.config.js`: flat ESLint configuration for TypeScript and React hooks.
- `vite.config.ts`: minimal React-enabled Vite configuration.

## Interface behavior

- The header shows the current Persian Saturday-to-Friday range and states that the schedule uses Tehran time.
- The page refreshes its current time every 30 seconds so period states and Saturday rollover update while it remains open.
- Two Persian summary cards show the active period and the next upcoming period within the displayed week.
- Today is marked in both mobile and desktop layouts.
- The active period and next period receive distinct restrained outlines/backgrounds in both layouts.
- A legend distinguishes public periods, private unit periods, cleaning periods, the active period, and the next period.
- Mobile widths render one card per day with all eight periods in a vertical list.
- Desktop widths render one row per day and one column per time range.
- Every unit number and all date/time labels are displayed with Persian digits.
- If no period is active, the page explains that the current time is between periods or before opening.
- If Friday's final period has passed, the page states that no period remains in the displayed week.

## Anchor data inferred from screenshots

- Week starting 1405/04/20: private slots begin with unit 39, then units 1 through 38.
- Week starting 1405/04/27: private slots begin with unit 38, then unit 39, then units 1 through 37.
- Both complete private-unit sequences are covered by tests.

## Documentation protocol

Each implementation run must read:

- `README.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/HANDOFF.md`
- `docs/RUN_LOG.md`

After implementation, each run must update the README status, append to the run log, and replace this handoff with the latest state.

## Verification performed

- The Tehran time-of-day and schedule-status modules compiled with TypeScript 5.8.3 under strict settings against compatible domain modules.
- Node.js 22 runtime checks confirmed before-opening, active-period, between-period, after-closing, cleaning-period, and final-Friday behavior.
- A strict JSX type-check with compatible React and domain declarations confirmed the updated `src/App.tsx` structure and imports.
- The committed UI and CSS were reviewed for Persian-only user-facing text, RTL-safe time labels, mobile/desktop state classes, semantic table headings, `aria-current`, and live-region status summaries.
- Full repository dependency installation, actual Vitest execution, linting, Vite production build, and browser rendering remain pending because the GitHub connector does not provide a repository shell or deployed preview.

## Known uncertainties and issues

- Two screenshots establish the rotation pattern but cannot prove whether management occasionally changes the schedule manually. The implementation must include configuration-based overrides.
- Full repository dependency installation, linting, Vitest execution, and Vite production build remain pending.
- No lockfile exists yet. A future CI or shell-enabled run should generate and commit it if appropriate.
- Visual browser rendering has not yet been inspected through a deployed preview.
- The next-period helper intentionally searches only within the displayed Saturday-to-Friday week. After the final Friday period, the interface directs users to the next week rather than resolving an off-screen slot.

## Exact next recommended task

Add previous/current/next week navigation as a focused UI-state task. Store a displayed-week offset relative to the live Tehran week, derive the displayed Saturday and resolved schedule from that offset, and add Persian buttons for the previous week, return to the current week, and next week. Keep current-day and live-period highlighting active only when the displayed week is the live week, using the existing `getDisplayedWeekStatus` outside-week behavior. Do not add unit lookup or manual overrides in the same run.
