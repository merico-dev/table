# Sample Dashboard API
## Preparation
### .env
Add a `.env` file base on `.env.sample`

- `DATA_SOURCE_PG_URL` for running data queries
- `PG_URL` for storing dashboard configurations. Can be the same as `DATA_SOURCE_PG_URL`
- `SERVER_PORT` for setting the port number for the api server. Defaults to `31200`
- `CORS_ORIGIN` for configuring cors. separate multiple origins by `;`. Defaults to `http://localhost`

### up and running
1. `yarn install`
2. `yarn migration:run` will setup necessary database tables. Uses `PG_URL`
3. `yarn dev`