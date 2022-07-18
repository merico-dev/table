# Sample Dashboard API
## Preparation
### .env
Add a `.env` file based on `.env.sample`

- `PG_URL` for storing dashboard configurations
- `SERVER_PORT` for setting the port number for the api server. Defaults to `31200`
- `CORS_ALLOW_ORIGIN` for configuring cors. separate multiple origins by `;`. Defaults to `http://localhost`
- `SECRET_KEY` for encrypting and decrypting passwords used in datasource configurations. The frontend needs a matching key to decrypt the password for display. Uses [CryptoJS](https://github.com/brix/crypto-js) AES encryption/decryption

### up and running
1. `yarn install`
2. `yarn migration:run` will setup necessary database tables. Uses `PG_URL`
3. `yarn dev`