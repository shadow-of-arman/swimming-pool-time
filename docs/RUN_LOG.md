# Scheduled Implementation Run Log

Do not rewrite or delete previous entries. Append one entry after every implementation run.

## 2026-07-23 - Initial setup

### Steps taken

- Confirmed repository access and that `main` was empty.
- Added `README.md` with product requirements, schedule assumptions, progress checklist, and the scheduled-run protocol.
- Added `docs/IMPLEMENTATION_PLAN.md` with an ordered, incremental implementation plan.
- Added `docs/HANDOFF.md` with current decisions, uncertainties, and the exact next task.
- Added this chronological run log.

### Verification

- All documentation files were committed directly to `main`.
- The inferred rotation was documented against both supplied screenshot weeks.

### Decisions

- Use a static React, TypeScript, and Vite implementation.
- Use Tehran time and Saturday as the start of the week.
- Keep the design functional, responsive, RTL-correct, and only lightly styled.
- Avoid a backend for the MVP.

### Steps left

- Initialize the application.
- Implement the schedule engine and date utilities.
- Build the Persian responsive interface.
- Add unit lookup, week navigation, overrides, and tests.
- Add CI, deployment configuration, and final maintenance documentation.

### Next recommended task

Initialize the Vite React TypeScript project with Persian document metadata and a minimal RTL placeholder screen.

## 2026-07-23 - Run 1: Project foundation

### Steps taken

- Read the README and all existing files under `docs/` before implementation.
- Inspected the latest documentation commit and confirmed the expected next task.
- Added `package.json` with React, TypeScript, Vite, ESLint, and Vitest dependencies and scripts.
- Added strict application and tooling TypeScript configurations.
- Added Vite and flat ESLint configuration files.
- Added `.gitignore` for dependencies, build output, local environment files, logs, and editor artifacts.
- Added a Persian `index.html` using `lang="fa"`, `dir="rtl"`, Persian metadata, and Vazirmatn font loading.
- Added the React entry point with a guarded root lookup.
- Added a simple Persian placeholder page and responsive global RTL styling.
- Added a numeric direction-isolation CSS utility for future dates and time ranges.
- Updated the README status and handoff documentation.

### Verification

- Confirmed all required foundation files were created on `main`.
- Statically reviewed imports, scripts, TypeScript references, Persian document metadata, RTL direction, and responsive CSS structure.
- Confirmed all visible placeholder text is Persian.
- Could not execute `npm install`, linting, type checking, tests, or a production build because the available GitHub connector does not provide a repository shell. This limitation is recorded in the handoff.

### Decisions

- Use npm scripts for local development and future CI.
- Keep the initial screen intentionally modest and temporary.
- Load Vazirmatn from Google Fonts with common Persian-capable fallbacks.
- Keep schedule logic out of UI components and implement it as typed domain/configuration modules next.

### Steps left

- Define the fixed Saturday-first schedule model and structural invariants.
- Implement Tehran-time Saturday and week-offset calculations.
- Implement the 39-unit weekly rotation.
- Add Jalali and Persian-number formatting.
- Replace the placeholder with the complete responsive schedule UI.
- Add navigation, unit lookup, overrides, tests, CI, and deployment.

### Next recommended task

Define the seven weekdays, eight daily time ranges, fixed بانوان/آقایان periods, private unit-slot positions, and cleaning periods as strongly typed configuration. Verify that the model contains exactly 39 private slots per week before adding date calculations.

## 2026-07-23 - Run 2: Fixed schedule model

### Steps taken

- Read the current README, implementation plan, handoff, and complete run log before making changes.
- Inspected the latest repository commit and confirmed the fixed schedule model as the next task.
- Added `src/domain/schedule.ts` with typed weekday, audience, time-range, day, and slot definitions.
- Defined the seven weekdays in Saturday-first order with Persian display labels.
- Defined all eight daily time ranges with minute values and Persian display labels.
- Encoded alternating بانوان and آقایان morning periods.
- Encoded six private periods on Saturday, Monday, Wednesday, and Friday.
- Encoded five private periods followed by cleaning on Sunday, Tuesday, and Thursday.
- Assigned stable private-slot indexes from 0 through 38 and added a runtime guard requiring exactly 39 private periods.
- Added `src/domain/schedule.test.ts` with structural invariant tests.
- Updated the README and handoff documentation.

### Verification

- Fetched and reviewed both new domain files from `main` after committing them.
- Compiled the extracted schedule module successfully with TypeScript 5.8.3 under strict settings.
- Ran a local runtime invariant check that confirmed seven days, eight time ranges, 39 private periods, and cleaning only at Sunday, Tuesday, and Thursday period index 7.
- Statically reviewed the Vitest tests. Full repository dependency installation and Vitest execution remain unavailable through the GitHub connector.

### Decisions

- Keep fixed schedule data and schedule-generation logic in the domain layer rather than React components.
- Give every private period a stable zero-based index so the weekly unit rotation can be implemented with simple modulo arithmetic later.
- Keep Persian text only in exported display labels while maintaining English code identifiers.
- Use minute values for time comparisons and Persian strings only for display.

### Steps left

- Implement Tehran date extraction and Saturday-first date calculations.
- Calculate whole-week offsets from the anchor Saturday.
- Implement the 39-unit rotation and full weekly schedule generation.
- Add Jalali and Persian-number formatting.
- Build the responsive schedule UI, navigation, unit lookup, and current-period behavior.
- Add overrides, screenshot-anchor tests, CI, deployment, and final documentation.

### Next recommended task

Implement Tehran-time primitives using `Intl.DateTimeFormat` and UTC-safe date arithmetic: obtain Tehran date parts, determine the latest Saturday, and calculate week offsets from Gregorian anchor Saturday `2026-07-11`. Add rollover tests before implementing unit rotation.

## 2026-07-23 - Run 3: Tehran week calculations

### Steps taken

- Read the current README, implementation plan, handoff, and complete run log before making changes.
- Inspected the latest run commit and confirmed Tehran date primitives as the next coherent task.
- Added `src/domain/tehranTime.ts` with the `Asia/Tehran` timezone constant and Gregorian date-only types.
- Added Tehran Gregorian year, month, and day extraction using `Intl.DateTimeFormat.formatToParts` with Latin digits.
- Added Saturday-first weekday mapping where Saturday is index 0 and Friday is index 6.
- Added validated UTC-midnight conversion helpers and integer day arithmetic to avoid visitor-local timezone effects.
- Added latest-Saturday calculation for the active Tehran week.
- Added whole-week offset calculation from the documented anchor Saturday `2026-07-11`.
- Added `src/domain/tehranTime.test.ts` covering Tehran midnight rollover, latest-Saturday selection, anchor offsets, month-boundary arithmetic, and anchor weekday validation.
- Updated the README and handoff documentation.

### Verification

- Compiled the Tehran-time module successfully with TypeScript 5.8.3 under strict settings.
- Compiled the test source under strict settings using a temporary minimal Vitest declaration.
- Ran Node.js 22 runtime checks at `2026-07-17T20:29:59Z` and `2026-07-17T20:30:00Z`, confirming the Tehran date changes from Friday 2026-07-17 to Saturday 2026-07-18 exactly at Tehran midnight.
- Confirmed latest-Saturday results of 2026-07-11 before rollover and 2026-07-18 at rollover.
- Confirmed week offsets `-1`, `0`, and `1` before, at, and after the anchor week.
- Confirmed UTC-safe day arithmetic across month and year boundaries.
- The actual repository Vitest suite, dependency installation, linting, and Vite production build remain pending because the GitHub connector does not provide a repository shell.

### Decisions

- Keep timezone conversion limited to obtaining Tehran's current Gregorian calendar date; perform all later day and week arithmetic on date-only UTC values.
- Derive the weekday from the extracted Gregorian date instead of parsing localized weekday text.
- Keep the anchor as a typed Gregorian date-only value rather than a timestamp with an implied timezone.
- Reject invalid dates and non-integer day offsets instead of allowing JavaScript date normalization to hide configuration errors.

### Steps left

- Implement positive-modulo unit rotation and map all 39 private periods to units.
- Generate a resolved weekly schedule while preserving public and cleaning periods.
- Verify complete unit sequences against both supplied screenshot weeks.
- Add Jalali and Persian-number formatting.
- Build the responsive schedule UI, navigation, unit lookup, and current-period behavior.
- Add overrides, CI, deployment, and final documentation.

### Next recommended task

Implement a resolved schedule domain module. Private slot index 0 must map to unit 39 in anchor week offset 0 and unit 38 in offset 1, with all other assignments wrapping through units 1 to 39 by positive modulo. Add tests proving every unit appears exactly once and the anchor-week sequences match both screenshots before beginning the UI.

## 2026-07-23 - Run 4: Unit rotation and resolved schedules

### Steps taken

- Read the current README, implementation plan, handoff, and complete run log before making changes.
- Inspected the latest run commit and the current fixed-schedule and Tehran-time modules.
- Added `src/domain/resolvedSchedule.ts` with validated positive-modulo arithmetic.
- Added private-slot-to-unit mapping using `positiveModulo(privateSlotIndex - weekOffset - 1, 39) + 1`.
- Added complete weekly schedule resolution while preserving the existing public and cleaning slot objects.
- Added date-based schedule resolution through the previously verified Tehran week-offset function.
- Added private-unit sequence extraction for testing and later lookup features.
- Added `src/domain/resolvedSchedule.test.ts` covering modulo wrapping, anchor mappings, both complete screenshot sequences, positive and negative offsets, preservation of fixed slots, date-based resolution, and invalid inputs.
- Updated the README and handoff documentation.

### Verification

- Fetched and reviewed the new resolved-schedule module from `main` after committing it.
- Compiled the module successfully with TypeScript 5.8.3 under strict settings against compatible schedule and Tehran-time modules.
- Compiled the test source under strict settings using a temporary minimal Vitest type declaration.
- Ran Node.js 22 assertions confirming offset `0` produces `[39, 1, 2, ..., 38]` and offset `1` produces `[38, 39, 1, ..., 37]`.
- Confirmed every unit appears exactly once at offsets `-80`, `-39`, `-1`, `0`, `1`, `39`, and `80`.
- Confirmed date-based resolution for `2026-07-18T12:00:00Z` uses offset `1` and the second screenshot sequence.
- The actual repository Vitest suite, dependency installation, linting, and Vite production build remain pending because the GitHub connector does not provide a repository shell.

### Decisions

- Keep unit rotation as a pure domain function independent of React and display formatting.
- Validate all modulo values, divisors, private indexes, and week offsets instead of silently accepting fractional or out-of-range values.
- Preserve public and cleaning objects by reference and create new objects only for private periods that receive unit numbers.
- Expose a date-based resolver so the future UI does not need to reproduce timezone or rotation logic.

### Steps left

- Add Jalali date and Persian-digit formatting.
- Build the responsive Persian schedule interface and week header.
- Add current-period and next-period behavior.
- Add previous/current/next week navigation and unit lookup.
- Add manual overrides, CI, deployment, and final documentation.

### Next recommended task

Implement a separate Persian formatting module using the built-in Persian calendar in `Intl.DateTimeFormat`. Add Persian-digit conversion, concise and full Jalali date labels, and Saturday-to-Friday week-range labels for Gregorian `CalendarDate` values. Verify the two documented anchor Saturdays and month/year boundaries before beginning the full React schedule interface.

## 2026-07-23 - Run 5: Persian date and number formatting

### Steps taken

- Read the current README, implementation plan, handoff, and complete run log before making changes.
- Inspected the latest run commit and confirmed Persian formatting as the next coherent task.
- Added `src/domain/persianFormatting.ts` using `Intl.DateTimeFormat` with the Persian calendar and UTC date-only conversion.
- Added conversion from Latin and Arabic-Indic numerals to Persian digits.
- Added structured Jalali date-part extraction with Persian month and weekday labels.
- Added zero-padded numeric, concise, and full Persian date labels.
- Added compact Saturday-to-Friday range labels for same-month, cross-month, and cross-year weeks.
- Added validation that a weekly range begins on Saturday.
- Added `src/domain/persianFormatting.test.ts` covering digit conversion, both documented anchor Saturdays, date labels, week ranges, month/year boundaries, and invalid week starts.
- Updated the README and handoff documentation.

### Verification

- Fetched and reviewed the new formatting module from `main` after committing it.
- Compiled the module successfully with TypeScript 5.8.3 under strict settings against compatible schedule and Tehran-time modules.
- Compiled the test source under strict settings using a temporary minimal Vitest type declaration.
- Ran Node.js 22 checks confirming `2026-07-11` formats as `۱۴۰۵/۰۴/۲۰` and `2026-07-18` as `۱۴۰۵/۰۴/۲۷`.
- Confirmed concise and full labels such as `۲۰ تیر ۱۴۰۵` and `شنبه ۲۰ تیر ۱۴۰۵`.
- Confirmed the two week ranges are `۲۰ تا ۲۶ تیر ۱۴۰۵` and `۲۷ تیر تا ۲ مرداد ۱۴۰۵`.
- Confirmed Tir-to-Mordad and 1404-to-1405 boundaries without visitor-local timezone drift.
- The actual repository Vitest suite, dependency installation, linting, and Vite production build remain pending because the GitHub connector does not provide a repository shell.

### Decisions

- Use the platform Persian calendar through `Intl` instead of adding a Jalali dependency.
- Convert date-only Gregorian values at UTC midnight and explicitly format in UTC.
- Assemble labels from structured parts to avoid locale-dependent punctuation and ordering.
- Keep formatting utilities independent of React so they can be reused by the schedule header, daily cards, grid, and unit lookup.

### Steps left

- Replace the placeholder with the responsive current-week schedule interface.
- Add current-period and next-period behavior.
- Add previous/current/next week navigation and unit lookup.
- Add manual overrides, CI, deployment, and final documentation.

### Next recommended task

Build a read-only current-week interface using the verified domain modules. Show a Persian week-range header, Persian date for each day, mobile day cards, and a desktop schedule grid. Keep navigation, unit lookup, active-period highlighting, and overrides for later runs.

## 2026-07-23 - Run 6: Responsive current-week interface

### Steps taken

- Read the current README, implementation plan, handoff, and complete run log before making changes.
- Inspected the latest application and domain files and confirmed the read-only current-week interface as the next task.
- Replaced the temporary placeholder in `src/App.tsx` with runtime current-week schedule rendering.
- Used the Tehran latest-Saturday and anchor-offset helpers to resolve the correct unit assignments for the active week.
- Added a Persian week-range header, Tehran-time explanation, and schedule legend.
- Added Persian date labels for all seven days.
- Added mobile day cards containing all eight daily periods.
- Added a desktop weekly table containing every day and time range.
- Added restrained, distinct presentation for public, private-unit, and cleaning periods.
- Reworked `src/index.css` for responsive RTL layout, accessible table/card presentation, and the 900px mobile/desktop breakpoint.
- Updated the README and handoff documentation.

### Verification

- Fetched and reviewed the committed `src/App.tsx` and `src/index.css` from `main`.
- Confirmed the interface uses the verified Tehran week, resolved schedule, and Persian formatting APIs rather than duplicating domain logic.
- Confirmed all visible interface text is Persian.
- Confirmed all seven days and all eight periods are rendered in both responsive presentations.
- Confirmed semantic table headings, scope attributes, a screen-reader caption, labelled sections, and RTL-safe time content are present.
- Full repository dependency installation, linting, Vitest execution, browser rendering, and Vite production build remain pending because the GitHub connector does not provide a repository shell or deployed preview.

### Decisions

- Keep the first complete interface read-only and avoid mixing navigation, lookup, or active-period logic into this run.
- Render mobile cards and a desktop table from the same resolved schedule data.
- Use a 900px breakpoint so tablets and phones receive the more readable card layout.
- Preserve a modest visual treatment with neutral backgrounds and limited accent colors.

### Issues

- A repository shell is still unavailable, so the full Vite application has not been compiled or rendered in a browser.
- The current interface calculates its data once when React renders; future active-period behavior should introduce an appropriate clock refresh interval.

### Steps left

- Add current-period and next-period behavior with today highlighting.
- Add previous/current/next week navigation.
- Add unit lookup with local persistence.
- Add manual schedule overrides.
- Add CI, deployment, browser verification, and final maintenance documentation.

### Next recommended task

Add pure helpers for Tehran time-of-day, active-period detection, and the next upcoming period. Cover before-opening, between-period, active-period, after-closing, Friday-to-Saturday rollover, and cleaning periods with tests. Then highlight today and the active period and show a concise Persian next-period card in both responsive layouts. Keep navigation and unit lookup for later runs.

## 2026-07-23 - Run 7: Current and next period status

### Steps taken

- Read the current README, implementation plan, handoff, and complete run log before making changes.
- Inspected the latest commits and the current application, schedule, Tehran-time, and resolved-schedule modules.
- Extended `src/domain/tehranTime.ts` with validated Tehran hour, minute, second, and minutes-since-midnight extraction.
- Added `src/domain/scheduleStatus.ts` with displayed-week validation, current-day detection, active-period detection, next-period search across later periods and days, and reusable position matching.
- Added tests for before-opening, active periods, gaps between periods, after-closing rollover to the next day, cleaning periods, the final Friday period, dates outside the displayed week, and invalid week starts.
- Added a 30-second React clock refresh so the page updates period states and Saturday rollover while left open.
- Added Persian current-period and next-period summary cards.
- Highlighted today, the active period, and the next period in both mobile cards and the desktop table.
- Expanded the schedule legend and added accessible `aria-current` and live-region status markup.
- Updated responsive styling for the new status cards and highlighted states.
- Updated the README and handoff documentation.

### Verification

- Compiled the new Tehran time-of-day and schedule-status modules with TypeScript 5.8.3 under strict settings against compatible domain modules.
- Ran Node.js 22 runtime checks for before-opening, active, between-period, after-closing, cleaning, and final-Friday cases; all expected positions matched.
- Confirmed `2026-07-18T04:30:45Z` extracts as 08:00:45 in Tehran with 480 minutes since midnight.
- Performed a strict JSX type-check of the updated application with compatible React and domain declarations.
- Fetched and reviewed the committed domain, application, and CSS files after implementation.
- Confirmed all new user-facing text is Persian and current/next time ranges remain RTL-safe.
- Actual repository dependency installation, Vitest execution, linting, Vite production build, and browser rendering remain pending because the GitHub connector does not provide a repository shell or deployed preview.

### Decisions

- Keep active and next-period calculations in a pure domain module so future week navigation can reuse the outside-week behavior.
- Treat a period as active from its start minute up to, but not including, its end minute.
- Treat gaps between periods as inactive and select the next period by its future start time.
- Search for the next period only within the displayed Saturday-to-Friday week; after Friday closing, direct the user to the next week.
- Refresh the clock every 30 seconds instead of every render or every second.
- Keep current and next states visually distinct but restrained.

### Issues

- A repository shell and deployed preview remain unavailable, so the complete project has not yet been installed, built, or visually inspected in a browser.
- The CSS and JSX were statically checked, but final responsive spacing should be confirmed after deployment.

### Steps left

- Add previous/current/next week navigation.
- Add unit lookup with local persistence.
- Add manual schedule overrides.
- Add CI, deployment, browser verification, and final maintenance documentation.

### Next recommended task

Add previous/current/next week navigation. Store the displayed-week offset relative to the live Tehran week, calculate the displayed Saturday and unit rotation from that offset, and keep today/current/next highlighting visible only for the live week. Keep unit lookup and manual overrides for later runs.

## 2026-07-23 - Run 8: Week navigation

### Steps taken

- Read the current README, implementation plan, handoff, and complete run log before making changes.
- Inspected the latest application, live-status helpers, schedule resolution, and recent commits.
- Added `src/domain/weekNavigation.ts` to derive a displayed Saturday, anchor rotation offset, current-week flag, and Persian relative-week label from an integer offset relative to the live Tehran week.
- Added `src/domain/weekNavigation.test.ts` covering the live week, previous and next weeks, Gregorian month and year boundaries, Persian labels for larger offsets, and invalid fractional offsets.
- Added React state for the displayed relative week while preserving the existing 30-second live clock refresh.
- Added Persian controls for the previous week, return to the current week, and the next week.
- Recalculated Jalali dates and all 39 unit assignments for the selected week.
- Limited current-day, active-period, and next-period summaries and highlights to the actual live week.
- Added a Persian information panel while browsing non-live weeks.
- Added `src/navigation.css` with modest responsive button and information-panel styling and loaded it from `src/main.tsx`.
- Updated the README and handoff documentation.

### Verification

- Compiled the exact week-navigation helper with TypeScript 5.8.3 under strict settings against compatible dependency declarations.
- Ran Node.js 22 assertions confirming previous/next Saturdays, matching anchor rotation offsets, Gregorian year crossings, and Persian labels such as `۳ هفته قبل` and `۴ هفته بعد`.
- Fetched and reviewed the committed navigation helper, tests, application, stylesheet, and main entry point.
- Confirmed the displayed schedule uses `liveWeekOffset + relativeWeekOffset` and dates begin from the selected Saturday.
- Confirmed the existing outside-week status behavior removes today, active-period, and next-period positions while browsing another week.
- Full repository dependency installation, actual Vitest execution, linting, Vite production build, and browser rendering remain pending because the GitHub connector does not provide a repository shell or deployed preview.

### Decisions

- Store navigation as an unbounded integer offset relative to the live Tehran week rather than as a separate date string.
- Keep the return-to-current-week control disabled while already viewing the live week.
- Hide live status cards and live-only legend entries when browsing other weeks to avoid misleading messages.
- Keep navigation styling in a small separate stylesheet instead of expanding the existing large schedule stylesheet.

### Issues

- A deployed browser preview is still unavailable, so final button spacing and visual behavior have only been reviewed statically.
- Distant week calculations assume the inferred weekly rotation continues indefinitely unless a later override changes it.

### Steps left

- Add unit lookup with local persistence.
- Add manual schedule overrides.
- Add CI, deployment, browser verification, and final maintenance documentation.

### Next recommended task

Add a unit selector for units 1 through 39, persist a valid selection in `localStorage`, locate that unit's private period in the displayed week, show a concise Persian date/time summary, and highlight the selected unit in both responsive schedule views. Keep manual overrides for a later run.
