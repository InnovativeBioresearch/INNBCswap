# INNBCswap Web Interface by Innovative Bioresearch

This is, all around, the best refactoring of the UniswapV4 interface you can find. We fixed many UI issues, reduced unnecessary setup complexity, and reworked the repo so it is now more self-contained and easier to run. 

Warning: do not run `bun install` or the installation may fail. Use only `bun install --ignore-scripts`. The project is already prepared for this install flow.

Run `bun web dev` to start the app locally in development.

Run `bun web preview` to preview the production build locally.

Main commands:

- `bun install --ignore-scripts`
- `bun web dev`
- `bun web build:production`
- `bun web preview`

This streamlined setup is the supported way to install and run the project.

## Production Proxy Routing

The production build is intentionally configured to use same-origin route overrides instead of calling the upstream Uniswap services directly from the browser.

Current `apps/web/.env.production` routes these services through local paths that should be handled by a reverse proxy such as nginx:

- `/graphql`
- `/config`
- `/trading-api`
- `/liquidity`
- `/jupiter`
- `/entry-gateway`
- `/data-api`
- `/screen`
- `/gas-fee`
- `/routing-api`

This means the production build is expected to run behind a proxy server that forwards those paths to the correct upstream services.

Relevant nginx-related change markers include:
- `ALPHA CHANGE 160`
- `ALPHA CHANGE 161`
- `ALPHA CHANGE 174`
- `ALPHA CHANGE 175`
- `ALPHA CHANGE 176`
- `ALPHA CHANGE 177`
- `ALPHA CHANGE 178`

## Runtime Trading API Key

The web app no longer depends on a build-time `REACT_APP_TRADING_API_KEY` value for production.

Instead, the Trading API key is expected to be provided at runtime from an external server-served file:

- URL loaded by the app: `/runtime-config.js`
- recommended server file location: `/app/env/runtime-config.js`

Expected file contents:

```js
window.__APP_RUNTIME_CONFIG__ = {
  tradingApiKey: 'YOUR_TRADING_API_KEY_HERE',
}

Get your API key at https://developers.uniswap.org/dashboard/welcome

Important notes:

- `bun web dev` does not reproduce the production proxy layout and will work out of the box 
- `bun web preview` serves the production build locally, but it does not provide the nginx proxy layer by itself.
- If the production build is opened without the matching proxy configuration, requests such as `/graphql`, `/data-api/...`, `/trading-api/...`, and `/screen` may fail.
- In our deployment, nginx is also used to normalize selected upstream headers for compatibility with the target services.

In short:

- use `bun web dev` for local development
- use `bun web preview` only to inspect the built assets locally
- use the production build behind the matching nginx proxy configuration for real production behavior





