# Deployment

## One-time GitHub configuration

1. Create a GitHub repository named `amic-pugh`.
2. Add this project as its `main` branch and push it to GitHub.
3. In **Settings → Pages**, set **Source** to **GitHub Actions**.
4. In `vite.config.js`, keep `base` as `/amic-pugh/`. If the GitHub repository has a different name, update this value to `/<repository-name>/` before releasing.
5. If using a custom domain, set a repository variable named `VITE_BASE_PATH` to `/` and configure the domain in GitHub Pages.

The workflow at `.github/workflows/deploy.yml` runs on every push to `main`. It installs dependencies from `package-lock.json`, runs tests and linting, builds `dist/`, then deploys the artifact to GitHub Pages. A one-time `npm install` fallback supports the first push before the lockfile exists; commit the generated lockfile immediately afterwards. GitHub does not require a committed `gh-pages` branch with this deployment method.

## Release process

1. Work on a focused branch and run `npm run test`, `npm run lint`, and `npm run build` locally.
2. Open a pull request into `main` and review the changed behaviour.
3. Merge the pull request. The Pages workflow will publish the application.
4. Open `https://<organisation>.github.io/amic-pugh/` after the workflow succeeds and perform a smoke test: upload the sample CSV, confirm ranking, and test exports.
5. Update the SharePoint button to this URL. Use a new browser tab so users retain their SharePoint context.

## Rollback

Revert the faulty merge commit on `main` through a pull request. The resulting push runs the same deployment workflow and restores the prior behaviour. Do not edit generated site files directly in GitHub Pages.

## Troubleshooting

- **Blank page or missing assets:** check the Vite `base` path matches the repository name.
- **Workflow fails at `npm ci`:** commit the generated `package-lock.json` after running `npm install`.
- **Workflow cannot deploy:** confirm Pages is set to GitHub Actions and that the repository Actions permissions allow GitHub Pages writes.
- **Images do not appear:** a browser cannot open arbitrary local paths from a CSV. Upload the corresponding image files in the app or use accessible HTTPS URLs.
