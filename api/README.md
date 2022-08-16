# Sample Dashboard API
## Preparation
### .env
Add a `.env` file based on `.env.sample`

- `PG_URL` for storing dashboard configurations
- `SERVER_PORT` for setting the port number for the api server. Defaults to `31200`
- `CORS_ALLOW_ORIGIN` for configuring cors. separate multiple origins by `;`. Defaults to `http://localhost`
- `SECRET_KEY` for encrypting and decrypting passwords used in datasource configurations.
- `ENABLE_AUTH` Whether to add authentication and authorization to routes. 0 = disabled, 1 = enabled 
- `SUPER_ADMIN_PASSWORD` The password which will be configured for the superadmin account during migration. Must be configured before migration is run. If value is not set, password will be 'secret';
- `DEFAULT_RESET_PASSWORD` password that will be used when resetting an account password. Defaults to 123456

### up and running
1. `yarn install`
2. `yarn migration:run` will setup necessary database tables. Uses `PG_URL`
3. `yarn dev`