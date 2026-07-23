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
