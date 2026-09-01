# Contributing

## Git workflow

* `main` — stable releases;
* `develop` — current development version;
* `feature/*` — new functionality;
* `fix/*` — bug fixes;
* `chore/*` — configuration and maintenance;
* `docs/*` — documentation.

Changes are added to `develop` through pull requests.

## Project setup

Install dependencies in each workspace and in the repository root:

```bash
npm install
npm install --prefix frontend
npm install --prefix backend
```

The root `npm install` runs `husky` and enables the Git hooks. Do this once
after cloning and after every `npm install` that changes the root
`package.json`.

## Code style and pre-commit hook

Formatting and linting are enforced by a `pre-commit` hook (husky +
lint-staged). On every commit, staged files are checked per workspace:

* `frontend` — `eslint --fix` and `prettier --write`;
* `backend` — `eslint --fix` and `prettier --write` (Prettier runs through
  `eslint-plugin-prettier`).

Auto-fixable issues are fixed and re-staged automatically. A commit is
blocked if a remaining lint error is found — fix it and commit again.

Run the checks manually:

```bash
npm run lint                 # lint both workspaces
npm run lint:fix --prefix frontend
npm run format --prefix frontend
npm run lint --prefix backend
npm run format --prefix backend
```

To bypass the hook in an emergency, use `git commit --no-verify` (avoid it
for normal work).

## Starting a new task

Switch to `develop` and download the latest changes:

```bash
git switch develop
git pull --ff-only origin develop
```

Create a branch for the task:

```bash
git switch -c <type>/<short-task-name>
```

Example:

```bash
git switch -c feature/routes-api
```

## Rebase and merge

### Rebase

Use `rebase` when `develop` has changed while you are working in your branch.

Update remote branch information:

```bash
git fetch origin
```

Rebase your branch onto the latest `develop`:

```bash
git rebase origin/develop
```

If the branch was already pushed to GitHub:

```bash
git push --force-with-lease
```

Use rebase only in your own working branch. Do not rebase `main`, `develop`, or another developer’s branch.

### Merge

When the task is complete, create a pull request:

```text
working branch → develop
```

On GitHub, use:

```text
Create a merge commit
```

Do not merge `develop` into your working branch locally. Use rebase to update the working branch and a pull request to merge the completed work into `develop`.

## After merging a pull request

Switch to `develop`:

```bash
git switch develop
```

Download the merged changes:

```bash
git pull --ff-only origin develop
```

Remove outdated remote branch references:

```bash
git fetch --prune
```

Delete the local working branch:

```bash
git branch -d <branch-name>
```

## When to use `git pull`

Run:

```bash
git pull --ff-only origin develop
```

* before creating a new working branch;
* after a pull request has been merged;
* when you need the latest version of `develop`.

Do not run `git pull` randomly inside a working branch. Use `git fetch` and `git rebase origin/develop` to update it.