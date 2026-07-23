# Implementation Plan

## Goal

Build a small, reliable Persian-first web application that calculates and displays the apartment swimming-pool schedule automatically. The site should be responsive, RTL-correct, easy to maintain, and modestly attractive without unnecessary complexity.

## Technical direction

- React
- TypeScript
- Vite
- Plain CSS or CSS Modules
- Tehran-time calculations
- Jalali date formatting
- Vitest
- Static hosting

No backend is required for the MVP. The schedule must be calculated at runtime from a known anchor week and a fixed rotation rule.

## Core schedule model

- Weeks begin on Saturday.
- There are 39 apartment units.
- Each unit receives exactly one private slot per week.
- Unit assignments rotate by one available private slot each Saturday.
- Morning public slots alternate between بانوان and آقایان by day.
- Sunday, Tuesday, and Thursday have cleaning in the final time slot.
- The generated rotation is authoritative; manual schedule overrides are out of scope.

## Ordered tasks

### Phase 1: Project foundation

1. Initialize Vite with React and TypeScript.
2. Add basic linting, formatting, and test scripts.
3. Set `<html lang="fa" dir="rtl">`.
4. Add a Persian-friendly font and global RTL styling.

### Phase 2: Schedule engine

5. Define schedule types and fixed daily time slots.
6. Implement Tehran current-date handling.
7. Calculate the latest Saturday in Tehran time.
8. Calculate week offsets from the anchor Saturday.
9. Implement positive-modulo unit rotation for units 1 through 39.
10. Generate all seven days and verify every unit appears once.
11. Add Jalali date conversion and Persian digit formatting.

### Phase 3: Interface

12. Build the page shell and current-week header.
13. Build a mobile-first daily card view.
14. Build a desktop weekly schedule grid.
15. Highlight today and the current active time slot.
16. Show the next upcoming slot.
17. Add previous, current, and next week navigation.
18. Add unit lookup and save the selected unit in local storage.

### Phase 4: Verification

19. Add tests matching the supplied week beginning 1405/04/20.
20. Add tests matching the supplied week beginning 1405/04/27.
21. Test Saturday rollover in Asia/Tehran.
22. Test Jalali month and year boundaries.
23. Test RTL layout on mobile and desktop widths.
24. Confirm build, tests, linting, and type checking pass.

### Phase 5: Delivery

25. Add a GitHub Actions workflow for tests and build.
26. Add static-host deployment configuration.
27. Finish setup and maintenance instructions.
28. Perform a final repository review and mark the MVP complete.

## Constraints for scheduled runs

- Complete one coherent task or a small tightly related group per run.
- Prefer working software over architectural sophistication.
- Do not add a backend, authentication, database, admin dashboard, or manual override layer.
- Do not redesign working parts merely for visual novelty.
- Do not remove prior documentation or run history.
- Keep public UI text entirely Persian.
- Record uncertainties instead of silently guessing.