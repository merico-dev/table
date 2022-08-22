# Dashboard Core

```bash
# 1. install deps at dashboard root
cd devtable/dashboard && yarn

# 2. run demo
cd devtable/dashboard/packages/core && yarn build
```

see `package.json` for more scripts

use `../demo` for debugging

## Testing

Use cypress for component testing.

```shell
$ nx cypress dashboard
```

Use vitest for other types of testing.

```shell
$ nx vitest dashboard
```

Use `-c ci` to run tests in headless mode.

```shell
$ nx cypress dashboard -c ci
$ nx vitest dashboard -c ci
# run both in parallel
$ nx test dashboard -c ci
```
