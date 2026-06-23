# AMIC Pugh Matrix

AMIC Pugh Matrix is a browser-based design concept selection tool. Upload a CSV, set each criterion's direction and weight, optionally filter concepts, then review and export the ranked result. Data and uploaded images stay in the browser; the application has no backend.

## Features

- CSV validation based on the AHEAD matrix format
- Weighted, normalised Pugh-style scoring with ties ranked consistently
- Per-criterion direction, weight, enablement, and numeric filters
- Sortable ranking table and detailed selected-design breakdown
- Optional local image upload and full-size preview
- CSV and JSON export, dark/light theme, and responsive layout

## CSV format

The first two columns are required by position; their header names may vary.

| Position | Purpose | Example |
| --- | --- | --- |
| 1 | Design name | `Concept_Alpha` |
| 2 | Image path (optional) | `images/alpha.png` |
| 3 onward | Numeric criteria | `Mass_kg`, `Cost_GBP` |

Download or upload [sample_designs.csv](public/sample_designs.csv) to test the application. [test.csv](public/test.csv) compares an incumbent electric kettle with sustainability-focused concepts across material, production, use, and end-of-life criteria. It contains illustrative values only. For local image paths, upload corresponding image files after loading the CSV. Their filenames must match the filename in the image-path column. HTTP(S) and `data:image/...` URLs are shown directly.

### Image URLs

Use a direct, publicly accessible HTTPS image URL in the second CSV column. For assets stored in this repository, place them in `public/images/` and reference the deployed Pages URL, for example:

```text
https://amic-qub.github.io/AMIC_Pugh/images/concept-alpha.svg
```

Do not use a GitHub `blob` page URL: it points to an HTML page, not image bytes. For an image in another public repository, use its `raw.githubusercontent.com` URL instead. Local Windows paths such as `C:\images\concept.png` cannot be displayed by a deployed browser; use the **Add images** control to load those files locally.

## Scoring behaviour

For each enabled criterion, the app computes a 0–1 score from the data that passes the active filters:

- Higher is better: `(value - min) / (max - min)`
- Lower is better: `(max - value) / (max - min)`
- Identical values: every design scores `1.0`
- Missing values: score `0.0`

The total is the weighted average of enabled criterion scores, rounded to three decimal places. A weight of zero excludes a criterion's contribution without disabling its display. Tied total scores receive the same rank, matching AHEAD's Python `rank(method='min')` behaviour.

## Prerequisites

- Node.js 20 LTS (see `.nvmrc`)
- npm 10 or later

## Local development

```powershell
npm install
npm run dev
```

Open the local Vite URL shown in the terminal. Before committing changes, run:

```powershell
npm run test
npm run lint
npm run build
```

`npm install` creates `package-lock.json`. Commit that lockfile with this initial project and with any dependency change; GitHub Actions then uses `npm ci` to install the exact locked dependency graph. Its temporary `npm install` fallback only supports the initial repository bootstrap.

## Git workflow

`main` is the protected, deployable branch. A push to `main` triggers the Pages workflow only after test, lint, and build steps complete.

1. Create short-lived branches from current `main`, using prefixes such as `feature/`, `fix/`, `docs/`, or `chore/`.
2. Keep each branch focused and use imperative commit messages, for example `Add JSON result export`.
3. Open a pull request to `main`; require the automated checks and one review where team policy supports it.
4. Squash merge a completed feature, then delete its remote branch.
5. Never commit generated `dist/`, `node_modules/`, secrets, or local environment files.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for GitHub Pages configuration and release steps.

## Project layout

```text
src/components/  User-interface components
src/hooks/       Focused React state and derived-data hooks
src/utils/       CSV, filtering, constants, and scoring logic
src/**/*.test.js Unit tests
.github/         Continuous deployment workflow
```
