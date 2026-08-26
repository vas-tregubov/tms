# Contributing

## Git workflow

* `main` — stable releases;
* `develop` — current development version;
* `feature/*` — new functionality;
* `fix/*` — bug fixes;
* `chore/*` — configuration and maintenance;
* `docs/*` — documentation.

Changes are added to `develop` through pull requests.

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