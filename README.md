# Dev Table

Build your own data presentation using SQL and multiple data sources including big data. It is a natural integration with Dev Lake and Dev Analysis.

Dev Table offers a most flexible and powerful low-code data workflow loved by developers.

# Developers' Guide

## Dependency

Dependencies are managed by [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/). Just run `yarn install` at current dir.

## Dev

Add nx globally

```bash
yarn global add nx
```

Run these commands at root dir:

```bash
# build dashboard & settings-form
nx run-many --target=dev-build --all

# start api & website
nx run-many --target=dev --all
```

Then, visit http://localhost:32000/dashboard

### lint

run eslint

```bash
nx run-many --target=lint
```

### check

run tsc to do type checking

```bash
nx run-many --target=check
```

## TODO

- [ ] auto build `core` during debugging with `demo`
- [ ] commitlint with conventional-commit
