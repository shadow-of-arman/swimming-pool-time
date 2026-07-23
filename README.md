# Swimming Pool Time

A small Persian-first website for showing the apartment swimming-pool schedule. The website must be fully usable in Persian, follow RTL layout conventions, use Tehran time, and calculate the correct weekly rotation automatically every Saturday.

## Product requirements

- All visible UI text must be Persian.
- The document root must use `lang="fa"` and `dir="rtl"`.
- Numeric dates and time ranges must remain visually ordered inside RTL layouts.
- The week starts on Saturday.
- The current schedule must be calculated using `Asia/Tehran`, regardless of the visitor's device timezone.
- The website should be simple, reliable, responsive, and slightly polished, not portfolio-oriented.
- The 39 apartment units rotate by one available unit slot each week.
- Sunday, Tuesday, and Thursday end with a cleaning slot.
- Manual schedule overrides must be possible through configuration.

## Current status

**Phase:** Read-only responsive current-week interface complete; current and next period behavior is next.

### Completed

- [x] Confirmed the repository is writable.
- [x] Documented the inferred weekly schedule rotation.
- [x] Defined the implementation phases and handoff process.
- [x] Initialized React, TypeScript, and Vite.
- [x] Added development, build, lint, type-check, preview, and test scripts.
- [x] Set the document language and direction to Persian RTL.
- [x] Added Vazirmatn and responsive global RTL styling.
- [x] Added a simple Persian placeholder page.
- [x] Defined strongly typed weekdays, time ranges, public periods, private slots, and cleaning periods.
- [x] Verified the fixed model contains seven days, eight periods per day, and exactly 39 ordered private slots.
- [x] Added initial Vitest coverage for fixed-schedule invariants.
- [x] Implemented Gregorian date extraction in `Asia/Tehran` using `Intl.DateTimeFormat`.
- [x] Implemented Saturday-first weekday mapping and latest-Saturday calculation.
- [x] Implemented whole-week offsets from the Gregorian anchor Saturday `2026-07-11`.
- [x] Added rollover and UTC-safe date-arithmetic tests.
- [x] Implemented positive-modulo rotation for all 39 apartment units.
- [x] Implemented resolved weekly schedules that preserve public and cleaning periods.
- [x] Verified every unit appears exactly once for positive and negative week offsets.
- [x] Added tests matching the complete private-unit sequences in both supplied screenshots.
- [x] Added Latin and Arabic-Indic to Persian digit conversion.
- [x] Added numeric, concise, and full Jalali date labels using the built-in Persian calendar.
- [x] Added Saturday-to-Friday Jalali week-range formatting.
- [x] Added tests for both anchor Saturdays and Persian month and year boundaries.
- [x] Replaced the placeholder with the calculated current-week schedule.
- [x] Added Persian week and day date labels to the interface.
- [x] Added mobile day cards and a desktop weekly schedule grid.
- [x] Added responsive public, private-unit, and cleaning period styling.

### Remaining

- [ ] Add current-period and next-period highlighting.
- [ ] Add unit lookup with local persistence.
- [ ] Add previous/current/next week navigation.
- [ ] Add manual override configuration.
- [ ] Add GitHub Actions for build and tests.
- [ ] Add deployment configuration and final documentation.

## Local development

```bash
npm install
npm run dev
```

Available checks:

```bash
npm run lint
npm run typecheck
npm run test:run
npm run build
```

## Scheduled-run protocol

Every scheduled implementation run must:

1. Read `README.md` and every file in `docs/` before making changes.
2. Inspect the latest repository state and recent commits.
3. Select the next small, coherent unfinished task from `docs/IMPLEMENTATION_PLAN.md`.
4. Implement and verify that task directly in this repository.
5. Avoid large rewrites or unnecessary visual complexity.
6. Update this README's **Completed** and **Remaining** lists.
7. Append a dated entry to `docs/RUN_LOG.md` describing changes, verification, decisions, and remaining work.
8. Update `docs/HANDOFF.md` with the current architecture, known issues, and exact next recommended task.
9. Commit all related changes with a clear commit message.
10. Stop when the MVP is complete and verified; future runs should only fix documented defects or improve reliability.

## Schedule reference

The supplied screenshots establish these anchor weeks:

- Saturday 1405/04/20: first unit slot is unit 39, followed by units 1 through 38.
- Saturday 1405/04/27: first unit slot is unit 38, followed by unit 39, then units 1 through 37.

This implies that each Saturday all units move forward by one available unit time slot, with wrapping across units 1 through 39.

See `docs/` for the full implementation plan, schedule model, handoff state, and chronological run log.
