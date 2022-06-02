# Sample Dashboard API
## Preparation
### .env
Add a `.env` file based on `.env.sample`

- `PG_URL` for storing dashboard configurations
- `SERVER_PORT` for setting the port number for the api server. Defaults to `31200`
- `CORS_ALLOW_ORIGIN` for configuring cors. separate multiple origins by `;`. Defaults to `http://localhost`

Postgres datasource configuration. Each datasource configuration is separated by `;`.
- `PG_DATA_SOURCE_KEY` for giving each pg source a unique key. Will give warning for duplicate keys
- `PG_DATA_SOURCE_HOST` datasource hostname
- `PG_DATA_SOURCE_PORT` datasource port
- `PG_DATA_SOURCE_USERNAME` datasource username
- `PG_DATA_SOURCE_PASSWORD` datasource password
- `PG_DATA_SOURCE_DATABASE` datasource database

### up and running
1. `yarn install`
2. `yarn migration:run` will setup necessary database tables. Uses `PG_URL`
3. `yarn dev`