# Handoff

## Current state

The Persian-first swimming-pool schedule for برج ارغوان is live on GitHub Pages at `https://shadow-of-arman.github.io/swimming-pool-time/`. The fixed Tehran rotation, responsive schedules, live period status, persisted unit selection, independent calendar and unit-lookup week controls, verified lockfile, CI, portable artifact, Pages deployment, web-app manifest, and supplied pool icon pipeline are present on `main`. Manual schedule overrides remain explicitly out of scope.

## Confirmed decisions

- The public building identity is برج ارغوان; the main heading remains برنامه هفتگی استخر.
- The website is Persian-first, fully RTL, static, and calculated in `Asia/Tehran`.
- Calendar browsing and unit-lookup browsing use separate relative week offsets.
- Calendar controls continue to support previous, current, and next weeks.
- Unit lookup defaults to the current week and switches only between the current and next week.
- A selected unit is stored under `swimming-pool:selected-unit`; storage failure is non-fatal.
- The supplied pool artwork is used for the browser favicon, Apple Home Screen icon, and installed web-app icon.
- The icon source is stored as verified Base64 parts and assembled into a PNG before development and production builds.
- The fixed 39-unit rotation is authoritative; there is no backend, admin dashboard, authentication, or manual override layer.

## Current architecture

- `index.html`: Persian RTL metadata, Arghavan Tower title, favicon, Apple web-app metadata, and manifest link.
- `assets/pool-icon-512.part1` through `part4`: verified text-safe source data for the supplied pool icon.
- `scripts/generate-pwa-icons.mjs`: assembles the source parts into `public/pool-icon-512.png`.
- `public/site.webmanifest`: standalone Persian web-app metadata scoped with relative URLs for GitHub Pages.
- `src/App.tsx`: separate calendar and unit-lookup week state, Tehran live status, persisted unit selection, and responsive schedule rendering.
- `src/unitLookup.css`: unit lookup and independent week-button styling.
- `src/domain/*`: fixed schedule, Tehran time, rotation, Persian formatting, live status, week selection, and unit lookup helpers.
- `package.json`: runs icon generation before development and production builds.
- `package-lock.json`: verified dependency lockfile.
- `.github/workflows/ci.yml`: lint, type-check, tests, and production build.
- `.github/workflows/static-site.yml`: portable static artifact.
- `.github/workflows/pages.yml`: standard GitHub Pages deployment with read-only content access.
- `docs/DELIVERY.md`: release, responsive verification, installation, maintenance, and rollback guidance.

## Interface behavior

- The calendar week controls affect only the main schedule, week summary, and live calendar status.
- The unit lookup starts on the current Tehran week regardless of the calendar's browsed week.
- In the unit section, `هفته بعد` changes only the unit result to next week; while next week is displayed, the button becomes `هفته جاری`.
- Selecting a unit still highlights that unit in the currently displayed calendar schedule.
- Today, active-period, and next-period states remain tied to the displayed calendar week and appear only for the live week.
- Add to Home Screen uses the Persian app identity `استخر ارغوان`, standalone display mode, and the supplied pool icon.

## Automated workflow behavior

- `Repository checks` runs on pushes to `main` and pull requests and executes linting, type checking, Vitest, and the production build.
- `Static site artifact` builds and uploads the portable `dist/` directory.
- `Deploy GitHub Pages` publishes the production build to the live URL.
- `npm run build` automatically generates the pool PNG before TypeScript and Vite run.

## Documentation protocol

Each implementation run must read `README.md` and every file under `docs/`. After implementation, update README status, append to the run log without removing history, and replace this handoff with the latest state.

## Verification performed

- Read the current README and every file under `docs/` before implementation and inspected the latest repository state.
- Verified each of the four committed icon source parts against its expected Git blob SHA before using them in the generator.
- Confirmed their concatenated source decodes locally into a valid optimized 512-by-512 PNG based on the supplied image.
- Restored the standard Pages workflow after removing the unsuccessful temporary bootstrap workflow.
- Fetched the updated application structure and confirmed the calendar and unit lookup now resolve schedules from separate state variables.
- Confirmed the manifest and icon links use relative paths suitable for `/swimming-pool-time/` on GitHub Pages.
- Actual push-triggered workflow results and live browser behavior still require confirmation after deployment because the available connector does not expose those runs or render the site.

## Known uncertainties and issues

- The rotation rule remains inferred from the two supplied screenshots and is assumed to continue indefinitely.
- The latest workflows and Pages deployment must be checked after this update.
- Browser icon caches may require a hard refresh; an existing Home Screen shortcut may need to be removed and added again.
- The live layout and independent controls still need final mobile and desktop inspection.
- Week navigation remains intentionally unbounded for the main calendar.
- When local storage is blocked, unit selection cannot persist across page reloads.

## Exact next recommended task

Confirm `Repository checks`, `Static site artifact`, and `Deploy GitHub Pages` are green for the latest commit. On the live site, verify the favicon, remove and re-add the site to the phone Home Screen to confirm the pool icon and standalone launch, verify calendar navigation does not change the unit result, and verify the unit section switches independently between `هفته جاری` and `هفته بعد`. Repeat the layout checks around 390 and 1440 pixels, then mark the MVP complete if all checks pass.
