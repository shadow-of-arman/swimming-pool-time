# Handoff

## Current state

The project foundation, fixed weekly schedule model, Tehran date primitives, and 39-unit rotation engine are now present on `main`. The application still shows a temporary Persian placeholder page, but the domain layer can now resolve any Tehran week into a complete seven-day schedule with public periods, cleaning periods, and one private period for every unit.

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
- Domain identifiers remain English, while exported user-facing labels are Persian.
- Calendar arithmetic uses Gregorian date-only values represented at UTC midnight, preventing the browser's local timezone from changing week calculations.
- Fixed schedule definitions remain immutable; resolved schedules add unit numbers without mutating public or cleaning periods.

## Current architecture

- `index.html`: Persian metadata, RTL document direction, page title, theme metadata, and font loading.
- `src/main.tsx`: guarded React root setup and strict-mode rendering.
- `src/App.tsx`: temporary Persian placeholder screen.
- `src/index.css`: global RTL layout, responsive placeholder styling, and numeric direction-isolation utility.
- `src/domain/schedule.ts`: strongly typed fixed schedule model, Persian weekday/time labels, Saturday-first ordering, sequential private-slot indexes, and runtime validation that exactly 39 private periods exist.
- `src/domain/schedule.test.ts`: structural tests for day ordering, period counts, private-slot indexes, cleaning placement, public-period alternation, and time-range ordering.
- `src/domain/tehranTime.ts`: Tehran Gregorian date extraction through `Intl.DateTimeFormat`, Saturday-first weekday mapping, UTC-safe date-only helpers, latest-Saturday calculation, and whole-week offsets from `2026-07-11`.
- `src/domain/tehranTime.test.ts`: tests for Tehran midnight rollover, latest-Saturday selection, anchor offsets, month-boundary arithmetic, and anchor validation.
- `src/domain/resolvedSchedule.ts`: positive-modulo unit rotation, private-slot-to-unit resolution, complete resolved weekly schedules, date-based schedule resolution, and private-unit sequence extraction.
- `src/domain/resolvedSchedule.test.ts`: tests for modulo wrapping, screenshot anchor sequences, unit uniqueness across varied offsets, non-private-slot preservation, date-based resolution, and invalid inputs.
- `package.json`: Vite, React, TypeScript, ESLint, and Vitest scripts and dependencies.
- `tsconfig*.json`: strict application and tooling TypeScript configurations.
- `eslint.config.js`: flat ESLint configuration for TypeScript and React hooks.
- `vite.config.ts`: minimal React-enabled Vite configuration.

## Fixed schedule model

- Each day contains eight periods: 08:00-09:30 through 22:00-23:30.
- The first two periods are public periods.
- Saturday starts with بانوان then آقایان; the order alternates each day.
- Saturday, Monday, Wednesday, and Friday contain six private periods.
- Sunday, Tuesday, and Thursday contain five private periods followed by cleaning.
- Private periods receive stable indexes from 0 through 38 across the Saturday-first week.

## Tehran date behavior

- `getTehranDateParts(date)` extracts Gregorian year, month, and day in `Asia/Tehran` and returns the corresponding Saturday-first weekday and index.
- Saturday has weekday index 0 and Friday has weekday index 6.
- `getLatestSaturdayInTehran(date)` returns a Gregorian date-only object for the start of the active Tehran week.
- `getWeekOffsetFromAnchor(date)` returns negative, zero, or positive whole-week offsets from Saturday `2026-07-11`.
- Tehran midnight on 2026-07-18 occurs at `2026-07-17T20:30:00Z`; the implemented rollover behavior was verified at that boundary.

## Unit rotation behavior

- The unit formula is `positiveModulo(privateSlotIndex - weekOffset - 1, 39) + 1`.
- At offset `0`, the private sequence is unit 39 followed by units 1 through 38.
- At offset `1`, the private sequence is units 38, 39, then 1 through 37.
- At offset `-1`, the private sequence begins with unit 1 and continues through unit 39.
- Every integer week offset produces each unit from 1 through 39 exactly once.
- `resolveWeeklyScheduleForDate(date)` combines the Tehran week offset with the unit rotation.

## Anchor data inferred from screenshots

- Week starting 1405/04/20: private slots begin with unit 39, then units 1 through 38.
- Week starting 1405/04/27: private slots begin with unit 38, then unit 39, then units 1 through 37.
- Both complete private-unit sequences are now covered by tests.

## Documentation protocol

Each implementation run must read:

- `README.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/HANDOFF.md`
- `docs/RUN_LOG.md`

After implementation, each run must update the README status, append to the run log, and replace this handoff with the latest state.

## Verification performed

- `src/domain/resolvedSchedule.ts` compiled successfully with TypeScript 5.8.3 under strict settings against compatible schedule and Tehran-time modules.
- The new test source compiled under strict settings using a temporary minimal Vitest type declaration.
- Node.js 22 runtime assertions confirmed the full offset-0 and offset-1 screenshot sequences.
- Runtime assertions confirmed all units appear exactly once at offsets `-80`, `-39`, `-1`, `0`, `1`, `39`, and `80`.
- Date-based resolution at `2026-07-18T12:00:00Z` produced week offset `1` and the expected sequence.
- The actual repository Vitest suite, dependency installation, linting, and Vite production build have not yet run because the GitHub connector does not provide a repository shell.

## Known uncertainties and issues

- Two screenshots establish the rotation pattern but cannot prove whether management occasionally changes the schedule manually. The implementation must include configuration-based overrides.
- Full repository dependency installation, linting, Vitest execution, and Vite production build remain pending.
- No lockfile exists yet. A future CI or shell-enabled run should generate and commit it if appropriate.

## Exact next recommended task

Add a focused Persian formatting module. Implement Persian-digit conversion and Jalali date formatting using built-in `Intl.DateTimeFormat` with the Persian calendar. It should format Gregorian `CalendarDate` values without local-timezone drift, provide concise and full Persian date labels, and format week ranges from Saturday through Friday. Add tests for the documented anchor Saturdays `2026-07-11` and `2026-07-18`, Persian digits, and month/year boundaries. Keep formatting separate from React components and do not begin the full interface until these labels are verified.
