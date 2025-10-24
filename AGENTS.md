# Repository Guidelines

## Project Structure & Module Organization
This Backstage monorepo is driven by Yarn workspaces and Turborepo. `packages/app` ships the production frontend; `packages/app-next` hosts the module-federated preview; `packages/backend` wires backend services. Shared helpers live in `packages/plugin-utils`. Feature plugins reside in `plugins/*`, with built artifacts under `dynamic-plugins*/` and generated types in `dist-types/`. Ops assets are grouped in `docker/`, `manifests/`, and `scripts/`; MkDocs content sits in `docs/`, while `e2e-tests/` holds Playwright suites.

## Build, Test, and Development Commands
Run `yarn install` to bootstrap, `yarn dev` to launch backend and frontend together, and `yarn start` for backend-only work. `yarn build` and `yarn tsc` produce distributable bundles and type declarations, while `yarn test` orchestrates `backstage-cli package test --coverage` across workspaces. Quality gates include `yarn lint:check`, `yarn lint:fix`, `yarn prettier:check`, `yarn prettier:fix`, and `yarn clean` to reset build outputs. For Playwright smoke runs execute `cd e2e-tests && yarn showcase`.

## Coding Style & Naming Conventions
Source is TypeScript; Prettier enforces two-space indentation and double quotes, so avoid manual formatting. React components use PascalCase filenames, functions and variables stay camelCase, and workspace folders remain kebab-case (`plugins/dynamic-plugins-info`). Rely on the lint scripts that wrap `backstage-cli package lint` before publishing changes.

## Testing Guidelines
Co-locate Jest tests as `*.test.ts[x]` or under `__tests__/`. Keep `yarn test` green and prevent coverage regressions in the generated `coverage/` folders. Playwright projects in `e2e-tests/` exercise showcase scenarios; run `yarn showcase` for smoke checks and targeted commands such as `yarn showcase-rbac` when validating RBAC flows.

## Commit & Pull Request Guidelines
Follow Conventional Commits (`feat:`, `fix:`, `docs:`) per `CONTRIBUTING.md`; keep subjects concise and imperative, then squash noise before review. Pull requests need a clear summary, linked Jira or GitHub issues, and notes on config or schema changes. Include screenshots for UI updates. Confirm lint, unit, and relevant Playwright jobs succeed before requesting review.

## Configuration Tips
Use `app-config.local.yaml` for local overrides and keep secrets out of git. When adding internal plugins, update `docker/Dockerfile` and `.rhdh/docker/Dockerfile` copy blocks and regenerate metadata via the appropriate `scripts/update-*.sh` or by running `yarn build`.
