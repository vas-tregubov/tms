# Contributing

## Git workflow

* `main` — stable releases;
* `develop` — current development version;
* `feature/*` — new functionality;
* `fix/*` — bug fixes;
* `chore/*` — configuration and maintenance;
* `docs/*` — documentation.

Changes are added to `develop` through pull requests.

## AI-assisted development

`.ai/` contains canonical AI instructions and skills. Provider-specific adapters
reference `.ai/` without duplicating project-wide rules. Coding agents may inspect
and modify code within the approved scope and run relevant checks.

Commits, pushes, merges, and branch deletion are performed manually by a developer.
Agents provide proposed commit messages and exact Git commands instead.
Husky and lint-staged remain part of the manual commit workflow.

## Project setup

From the repository root, install dependencies and configure Git hooks:

```bash
npm run setup
```

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

### Stacked branches

If a task depends on a feature branch that has not yet merged into `develop`,
create the dependent local branch from that feature branch instead of `develop`.
You may work, stage changes with `git add`, and create local commits there.
`git add` and `git commit` operate locally; only `git push` sends changes to the
remote repository. By default, do not push the dependent branch or open its pull
request into `develop` until the base feature branch has merged.

After the base branch merges:

```bash
git fetch --prune
git switch <dependent-branch>
git rebase origin/develop
```

Resolve any conflicts and rerun the standard project checks. Only after the
checks pass, push the branch and open a pull request into `develop`.

Keep stacks short: the recommended maximum depth is 2–3 dependent feature
branches. If further work requires a deeper stack, prefer an independent task.

The existing Git policy still applies: the developer performs commits, pushes,
and merges manually; coding agents do not execute them. Destructive Git
operations and force pushes require an explicit request.

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
