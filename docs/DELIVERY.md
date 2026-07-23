# Static Delivery and Maintenance

## Current deployment

- Host: GitHub Pages
- Production URL: `https://shadow-of-arman.github.io/swimming-pool-time/`
- Source branch: `main`
- Deployment workflow: `Deploy GitHub Pages`
- The repository owner confirmed the site was live on 2026-07-23.

## Scope

This application is a static React, TypeScript, and Vite website. It does not require a backend, database, authentication service, scheduled server task, or manual schedule overrides.

The production output is the complete `dist/` directory created by `npm run build`.

## Automated workflows

`Repository checks` runs on pushes to `main` and pull requests. It installs the verified lockfile with `npm ci`, then runs linting, type checking, Vitest, and the production build.

`Static site artifact` runs on pushes to `main` and can also be started manually. It builds the application and uploads the artifact `swimming-pool-time-static` for 14 days.

`Deploy GitHub Pages` runs on pushes to `main` and manual dispatch. It builds the application, uploads the Pages artifact, and publishes the production site.

The pool favicon and installed-app PNG are generated automatically before development and production builds from the verified source parts under `assets/`.

## Downloadable build artifact

After a successful `Static site artifact` run:

1. Open the workflow run in GitHub Actions.
2. Download the artifact named `swimming-pool-time-static`.
3. Extract the archive.
4. Upload the contents of the extracted `dist/` directory to the document root of a static host.

The artifact contains production files only and does not contain source credentials or environment secrets.

## Supported hosting shape

Vite is configured with `base: './'`, so generated JavaScript and CSS references are relative. The same artifact can therefore be hosted:

- at a root domain, such as `https://pool.example.com/`
- under a nested path, such as `https://example.com/pool/`
- on an internal static file server
- through the configured GitHub Pages deployment

The application has no client-side routes, so the host does not need SPA fallback rewriting.

## Manual local build

Use Node.js 22 or a later compatible release.

```bash
npm ci
npm run lint
npm run typecheck
npm run test:run
npm run build
```

Upload the generated `dist/` directory only after all commands succeed.

A verified `package-lock.json` is committed. Use `npm ci` for clean verification and automated builds; use `npm install` only when intentionally changing dependencies.

## Release checklist

Before replacing or approving the hosted version:

1. Confirm `Repository checks` passes.
2. Confirm `Static site artifact` passes and contains `index.html`, `site.webmanifest`, `pool-icon-512.png`, and generated assets.
3. Confirm `Deploy GitHub Pages` passes.
4. Open the live site at a phone-sized viewport around 390 pixels wide.
5. Open the live site at a desktop viewport around 1440 pixels wide.
6. Confirm the header identifies برج ارغوان.
7. Confirm the previous/current/next week buttons sit immediately above the schedule.
8. Confirm the page direction is RTL and all visible UI text is Persian.
9. Confirm dates and time ranges remain visually ordered.
10. Confirm the displayed week begins on Saturday and matches Tehran time.
11. Select at least one unit and confirm it is highlighted in the displayed calendar week.
12. Confirm changing the calendar week does not change the week shown in the unit lookup result.
13. Confirm the unit lookup defaults to `هفته جاری`, changes independently to `هفته بعد`, and offers `هفته جاری` while next week is selected.
14. Confirm the current-day and active-period states only appear for the live calendar week.
15. Confirm refreshing the page preserves a valid selected unit when browser storage is available.
16. Confirm the browser tab uses the supplied pool favicon.
17. Add the site to a phone Home Screen and confirm the supplied pool icon and standalone launch. Remove an older shortcut first if its cached icon remains.
18. Confirm there is no unexpected horizontal overflow or browser-console error.

## Schedule maintenance

The schedule is generated from the fixed anchor rotation and contains no operator-editable weekly exceptions.

The anchor behavior is covered by automated tests:

- week beginning 2026-07-11 corresponds to 1405/04/20 and begins with unit 39
- week beginning 2026-07-18 corresponds to 1405/04/27 and begins with unit 38

Do not change the anchor date, private-slot order, or rotation formula unless management confirms that the underlying permanent schedule rule has changed. Any such change should include updated tests for both supplied reference weeks and at least one future week.

## Updating dependencies

Dependency updates should be small and reviewed individually.

1. Update dependency versions in `package.json`.
2. Refresh the lockfile in an environment with npm registry access.
3. Run linting, type checking, tests, and the production build.
4. Commit `package.json` and `package-lock.json` together.
5. Confirm all automated workflows pass.

Avoid adding runtime dependencies for Jalali dates, timezone handling, or state storage unless the existing platform APIs become insufficient.

## Rollback

Every production release is a static directory. To roll back:

1. Download a previously successful `swimming-pool-time-static` artifact while it is still retained, or rebuild a known-good commit.
2. Replace the host's current files with the known-good `dist/` contents, or redeploy the known-good commit through GitHub Pages.
3. Clear any host-level cache if the provider uses one.
4. Reload the site and repeat the responsive release checks.

The selected-unit preference is stored only in each visitor's browser and does not require migration during deployment or rollback.

## Final MVP sign-off

The MVP should be marked complete only after:

- all three automated workflows pass for the latest commit
- the production GitHub Pages URL is inspected
- mobile and desktop RTL rendering is verified in a browser
- the برج ارغوان header and calendar-adjacent week navigation are verified
- independent calendar and unit-lookup week behavior is exercised successfully
- the supplied favicon and Home Screen icon are verified
- the Tehran week, current-period state, and unit persistence are exercised successfully
- the final hosting location is recorded in this document or the README
