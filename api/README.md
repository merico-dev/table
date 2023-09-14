# Sample Dashboard API

## Preparation

### .env

Add a `.env` file based on `.env.sample`

- `PG_URL` for storing dashboard configurations
- `SERVER_PORT` for setting the port number for the api server. Defaults to `31200`
- `CORS_ALLOW_ORIGIN` for configuring cors. separate multiple origins by `;`. Defaults to `http://localhost`
- `SECRET_KEY` for encrypting and decrypting passwords used in datasource configurations
- `ENABLE_AUTH` Whether to add authentication and authorization to routes. 0 = disabled, 1 = enabled
- `ENABLE_QUERY_PARSER` Whether to enable Server-Side Query parsing. 0 = disabled, 1 = enabled
- `SUPER_ADMIN_PASSWORD` The password which will be configured for the superadmin account during migration. Must be configured before migration is run. If value is not set, password will be 'secret'
- `DATABASE_CONNECTION_TIMEOUT_MS` for configuration the time after which the db connection will timeout in milliseconds. Default is 30000ms (30 seconds)
- `DATABASE_POOL_SIZE` for configuration the maximum number of clients in the pool
- `SQL_REWRITER_URL` for configurating the endpoint for the sql rewriter plugin

Variables for configuring preset ApiKeys. Separate values with ; ex: PRESET_API_KEY_NAME=name1;name2;name3

- `PRESET_API_KEY_NAME=` Pre-configured apikey name
- `PRESET_APP_ID` Pre-configured apikey app_id
- `PRESET_APP_SECRET` Pre-configured apikey app_secret
- `PRESET_ROLE_ID=` Pre-configured apikey role_id

- `PRESET_DASHBOARDS_REPO` git repository where the preset dashboards will be downloaded from

- `EXPRESS_REQUEST_MAX_SIZE` maximum request size for the express server. Default is 1mb

Test database connections

- `END_2_END_TEST_PG_URL` e2e test postgres connection URL
- `INTEGRATION_TEST_PG_URL` integration test postgres connection URL

Frontend logo and favicon configurations

- `WEBSITE_LOGO_URL_ZH` logo url Chinese
- `WEBSITE_LOGO_URL_EN` logo url English
- `WEBSITE_LOGO_JUMP_URL` logo jump url
- `WEBSITE_FAVICON_URL` favicon url

### up and running

1. `yarn install`
2. `yarn migration:run` will setup necessary database tables. Uses `PG_URL`
3. `yarn dev`
