# Handoff

## Current state

The project foundation, fixed weekly schedule model, Tehran date primitives, 39-unit rotation engine, Persian formatting utilities, and read-only responsive schedule interface are now present on `main`. The application calculates the active Tehran week at runtime and displays all seven days in Persian using mobile cards below 900px and a desktop weekly table above that breakpoint.

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
- The current interface is intentionally read-only. Navigation, lookup, active-period behavior, and overrides remain separate tasks.

## Current architecture

- `index.html`: Persian metadata, RTL document direction, page title, theme metadata, and font loading.
- `src/main.tsx`: guarded React root setup and strict-mode rendering.
- `src/App.tsx`: runtime current-week calculation, Persian week header, schedule legend, mobile day cards, desktop schedule table, and Persian labels for every period.
- `src/index.css`: complete responsive RTL styling, schedule cards, desktop table, semantic visual treatments for public/private/cleaning periods, and accessibility helper styles.
- `src/domain/schedule.ts`: strongly typed fixed schedule model and runtime validation for exactly 39 private periods.
- `src/domain/schedule.test.ts`: structural schedule tests.
- `src/domain/tehranTime.ts`: Tehran Gregorian date extraction, Saturday-first mapping, latest-Saturday calculation, and anchor week offsets.
- `src/domain/tehranTime.test.ts`: Tehran rollover and date arithmetic tests.
- `src/domain/resolvedSchedule.ts`: positive-modulo unit rotation and resolved weekly schedules.
- `src/domain/resolvedSchedule.test.ts`: screenshot sequence, uniqueness, wrapping, and date-resolution tests.
- `src/domain/persianFormatting.ts`: Persian digits, Jalali labels, and Saturday-to-Friday range formatting.
- `src/domain/persianFormatting.test.ts`: formatting and boundary tests.
- `package.json`: Vite, React, TypeScript, ESLint, and Vitest scripts and dependencies.
- `tsconfig*.json`: strict application and tooling TypeScript configurations.
- `eslint.config.js`: flat ESLint configuration for TypeScript and React hooks.
- `vite.config.ts`: minimal React-enabled Vite configuration.

## Interface behavior

- The header shows the current Persian Saturday-to-Friday range and states that the schedule uses Tehran time.
- A legend distinguishes public periods, private unit periods, and cleaning periods.
- Mobile widths render one card per day with all eight periods in a vertical list.
- Desktop widths render one row per day and one column per time range.
- Every unit number and all date/time labels are displayed with Persian digits.
- Public, private, and cleaning periods use distinct but restrained background treatments.
- The current interface does not yet identify today, the active period, or the next period.

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

- The committed `src/App.tsx` and `src/index.css` were fetched and statically reviewed after implementation.
- Imports and calls align with the verified domain APIs: current Tehran week start, week offset, resolved schedule, day arithmetic, Persian range labels, Persian day labels, and Persian unit numbers.
- The interface contains only Persian user-facing text.
- Mobile and desktop structures are both present, with CSS switching at 900px.
- The table and card markup use headings, table scopes, a caption, and semantic labels for accessibility.
- Full repository dependency installation, linting, Vitest execution, and Vite production build remain pending because the GitHub connector does not provide a repository shell.

## Known uncertainties and issues

- Two screenshots establish the rotation pattern but cannot prove whether management occasionally changes the schedule manually. The implementation must include configuration-based overrides.
- Full repository dependency installation, linting, Vitest execution, and Vite production build remain pending.
- No lockfile exists yet. A future CI or shell-enabled run should generate and commit it if appropriate.
- Visual browser rendering has not yet been inspected through a deployed preview.

## Exact next recommended task

Implement current-period and next-period behavior as a focused domain-plus-UI task. Add Tehran hour/minute extraction, determine whether the current Tehran date belongs to the displayed week, identify the active slot using `TIME_RANGES`, find the next upcoming slot across later periods and days, and expose this through pure tested helpers. Then highlight today and the active period in both mobile and desktop views and show a concise Persian next-period card. Do not add week navigation or unit lookup in the same run.
