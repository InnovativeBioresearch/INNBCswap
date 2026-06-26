# INNBCswap DeFi Aggregator

**INNBCswap** is the official INNBC Chain DeFi aggregator: a high-performance swap interface, multi-chain routing engine, and curated liquidity gateway built for the INNBC ecosystem.

Live app: https://innbcswap.io

INNBCswap is designed as the DeFi engine for the current INNBC Ethereum token and the future INNBC Chain L1. It combines aggregator-based routing, local curated token metadata, secure server-side API proxying, and an official curated liquidity dashboard for project-approved INNBC pools.

---

## Core Features

### Next-Generation DeFi Aggregator

INNBCswap is built as a streamlined DeFi aggregation interface for swapping tokens through optimized liquidity routes.

The current architecture includes:

- 0x Swap API integration for EVM routing
- Jupiter/Solana swap infrastructure through the app runtime proxy model
- same-origin API proxying so private API keys are never exposed to the browser
- wallet-based transaction execution
- route display logic for aggregator-provided liquidity paths
- curated token metadata for deterministic token display

### Massively Multi-Chain Architecture

INNBCswap is configured around a broad multi-chain routing surface, including:

- Ethereum
- Abstract
- Arbitrum
- Avalanche
- Base
- Berachain
- Blast
- BNB Smart Chain
- HyperEVM
- Ink
- Linea
- Mantle
- Mode
- Monad
- Optimism
- Plasma
- Polygon
- Scroll
- Sonic
- Tempo
- Unichain
- World Chain
- Solana

### Curated Liquidity Dashboard

INNBCswap includes a dedicated curated liquidity dashboard at `/liquidity`.

This page is intentionally different from generic pool discovery. It shows only project-approved INNBC liquidity pools and exposes guided reference-range liquidity logic, helping users avoid rogue, unofficial, malicious, or incorrectly ranged pools.

Current curated liquidity features include:

- official pool registry
- guided reference-range model
- live pool state reads
- user-loaded position token IDs
- support for INNBC/WETH, INNBC/USDT, ETH/INNBC, and INNBC/USDT v4 curated pools

When INNBC Chain launches, native INNBC Chain pools can be integrated into this curated liquidity surface.

### Local Token Metadata System

INNBCswap uses an app-owned curated token metadata layer rather than relying on old dynamic token-list discovery as the core display model.

Important files:

- `packages/uniswap/src/tokenMetadata/token-list.json`
- `packages/uniswap/src/tokenMetadata/defaultTokens.ts`
- `packages/uniswap/src/tokenMetadata/registry.ts`

This system controls:

- token facts
- token symbols
- decimals
- local logo paths
- quick token selector options
- suggested token options
- broader token discovery/default-token surfaces

### API Key Security

Browser runtime config exposes only same-origin API paths:

```js
window.__APP_RUNTIME_CONFIG__ = {
  zeroExApiUrl: '/api/zero-ex',
  jupiterApiUrl: '/api/jupiter',
  solanaRpcUrl: '/api/solana-rpc',
  walletConnectProjectId: '...',
}
```

Private API keys are injected server-side:

- locally through the Vite dev proxy
- in production through Nginx reverse proxy headers

The browser should never receive the 0x, Jupiter, or Helius API keys.

---

## Production Focus

This repository has been heavily refactored and pruned for the INNBCswap web app.

The current app focuses on:

- swap
- curated liquidity
- wallet connection
- local curated metadata
- server-side API key secrecy
- production deployment through Nginx

Legacy paths removed or disabled include:

- old GraphQL/Apollo paths
- old backend-dependent Uniswap API paths
- old global search and recent-search logic
- NFT UI surfaces
- send flow
- passkey / embedded wallet flow
- one-click wallet capability flow
- legacy wallet download prompts
- legacy token-list manager
- legacy migration compatibility system
- light/auto theme selection
- testnet mode
- analytics opt-in UI and external analytics dispatch

---

## Tech Stack

- Bun
- Vite
- React
- TypeScript
- Tamagui UI
- Wagmi / Viem
- 0x Swap API
- Jupiter API
- Solana Web3
- Nx workspace

---

## Requirements

Use the versions expected by the workspace:

- Node.js `22.13.1`
- Bun `>= 1.3.1`

This repository is Bun-first.

Do not use npm or yarn for installation.

---

## Install Dependencies

Important: install dependencies with scripts disabled.

```bash
bun install --ignore-scripts
```

Do **not** run a normal install unless you know exactly what you are doing.

The original upstream workspace contains install-time scripts that are not needed for this INNBCswap web workflow and may fail or run unwanted setup steps.

---

## Local Development and API Key Security

INNBCswap uses same-origin API proxy routes so private API keys are never exposed to the browser.

The browser does not call 0x, Jupiter, or Helius with keys directly. Instead, the browser calls local app routes:

- `/api/zero-ex`
- `/api/jupiter`
- `/api/solana-rpc`

Those routes are handled by:

- the Vite dev proxy during local development
- Nginx reverse proxy in production

This gives local development and production the same request shape.

### Browser Runtime Config

The browser-visible runtime config lives at:

`apps/web/public/runtime-config.js`

This file must contain only public runtime values and same-origin API paths.

Example:

```js
window.__APP_RUNTIME_CONFIG__ = {
  zeroExApiUrl: '/api/zero-ex',
  jupiterApiUrl: '/api/jupiter',
  solanaRpcUrl: '/api/solana-rpc',
  walletConnectProjectId: 'your_walletconnect_project_id',
}
```

Do not place private API keys in this file.

This file is included in the built web app and can be viewed by browser users, so it must never contain:

- 0x API keys
- Jupiter API keys
- Helius API keys
- private RPC keys
- server credentials
- deployment secrets

### Local Development Secrets

For local development, create:

`apps/web/.env.local`

Example:

```env
ZERO_EX_API_KEY=your_0x_api_key
JUPITER_API_KEY=your_jupiter_api_key
HELIUS_API_KEY=your_helius_api_key
```

This file is read by:

`apps/web/vite.config.mts`

The Vite dev server uses these values only inside the local proxy process.

Local request flow:

```txt
browser -> http://localhost:3000/api/zero-ex -> Vite proxy injects 0x key -> 0x API
browser -> http://localhost:3000/api/jupiter -> Vite proxy injects Jupiter key -> Jupiter API
browser -> http://localhost:3000/api/solana-rpc -> Vite proxy injects Helius key -> Helius RPC
```

The keys are not served to the browser.

`apps/web/.env.local` is local-only and must never be committed, uploaded, or published.

A safe template is provided at:

`apps/web/.env.local.example`

### Run Locally

From the repo root:

```bash
bun web dev
```

The app runs on:

```txt
http://localhost:3000
```

The local Vite proxy mirrors the production Nginx setup:

- `/api/zero-ex`
- `/api/jupiter`
- `/api/solana-rpc`

This allows local testing with the same API path structure used in production.

---

## Typecheck

Recommended checks:

```bash
bun x tsgo -b packages/uniswap/tsconfig.json --pretty false
bun x tsgo -b apps/web/tsconfig.json --pretty false
```

---

## Production Build

From the repo root:

```bash
bun web build:production
```

The production output is created at:

`apps/web/build`

For deployment, upload the contents of the production build output to the web root configured by Nginx.

Example production web root:

`/app/innbcswap`

Do not upload local secret files or local development artifacts to the public source repository, including:

- `apps/web/.env.local`
- local cache folders
- `node_modules`
- `.nx`
- generated build folders
- local deployment/archive folders that are not part of the source code

---

## Production Nginx Model

INNBCswap is intended to be served as a static Vite build behind Nginx.

In production, Nginx performs the same proxy role that Vite performs locally.

Recommended Nginx config location:

`/etc/nginx/conf.d/innbcswap.conf`

Main Nginx config location:

`/etc/nginx/nginx.conf`

Example static app root:

`/app/innbcswap`

Production request flow:

```txt
browser -> https://innbcswap.io/api/zero-ex -> Nginx injects 0x key -> 0x API
browser -> https://innbcswap.io/api/jupiter -> Nginx injects Jupiter key -> Jupiter API
browser -> https://innbcswap.io/api/solana-rpc -> Nginx injects Helius key -> Helius RPC
```

Conceptual Nginx configuration:

```nginx
server {
  listen 80;
  server_name innbcswap.io www.innbcswap.io;

  root /app/innbcswap;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /api/zero-ex/ {
    proxy_pass https://api.0x.org/;
    proxy_set_header Host api.0x.org;
    proxy_set_header 0x-api-key "YOUR_ZERO_EX_API_KEY";
    proxy_set_header 0x-version "v2";
    proxy_ssl_server_name on;
    proxy_read_timeout 120;
    proxy_connect_timeout 120;
  }

  location /api/jupiter/ {
    proxy_pass https://api.jup.ag/swap/v2/;
    proxy_set_header Host api.jup.ag;
    proxy_set_header x-api-key "YOUR_JUPITER_API_KEY";
    proxy_ssl_server_name on;
    proxy_read_timeout 120;
    proxy_connect_timeout 120;
  }

  location = /api/solana-rpc {
    proxy_pass https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_API_KEY;
    proxy_set_header Host mainnet.helius-rpc.com;
    proxy_set_header Content-Type application/json;
    proxy_ssl_server_name on;
    proxy_read_timeout 120;
    proxy_connect_timeout 120;
  }
}
```

After editing the Nginx config, verify and reload Nginx:

```bash
nginx -t
systemctl reload nginx
```

For HTTPS, issue the certificate after DNS points to the server:

```bash
certbot --nginx -d innbcswap.io -d www.innbcswap.io
```

The Nginx config file contains production API secrets, so lock it down on the server.

Recommended ownership and permissions:

```txt
root:root
0600
```

The browser never receives the production API keys.

---

## App Routes

Current canonical web routes:

- `/`
- `/liquidity`

The root route `/` is the canonical swap homepage.

The `/liquidity` route is the curated liquidity dashboard.

Old routes such as `/swap`, `/send`, `/nfts`, old pool pages, token details pages, and legacy migration/liquidity routes are intentionally not part of the current public app surface.

---

## SEO

The app is configured around the canonical domain:

```txt
https://innbcswap.io
```

Primary metadata:

```txt
INNBCswap DeFi Aggregator | Swap Tokens Across Chains
```

Description:

```txt
INNBCswap is the official INNBC Chain DeFi aggregator for swapping tokens across different chains through optimized aggregator routes.
```

Current sitemap surface:

```txt
https://innbcswap.io/
https://innbcswap.io/liquidity
```

---

## Project Structure

Main web app:

```txt
apps/web
```

Public runtime config:

```txt
apps/web/public/runtime-config.js
```

Canonical swap homepage:

```txt
apps/web/src/pages/Swap
```

Curated liquidity dashboard:

```txt
apps/web/src/pages/CuratedLiquidity
```

0x API client wiring:

```txt
packages/uniswap/src/data/apiClients/zeroEx
```

Jupiter API client wiring:

```txt
packages/uniswap/src/data/apiClients/jupiter
```

App-owned curated token metadata:

```txt
packages/uniswap/src/tokenMetadata
```

App chain registry:

```txt
packages/uniswap/src/chains
```

---

## Development Notes

This repository is a focused INNBCswap web app codebase.

The current deployment path prioritizes:

- deterministic token display
- curated liquidity
- server-side API key secrecy
- local/prod parity through `/api/*` proxy paths
- minimal SEO surface
- no dependency on legacy backend services for the active app flow

---

## License and Source Availability

This repository is based in part on the upstream Uniswap Interface project:

https://github.com/Uniswap/interface

Original upstream code remains governed by its original license terms and copyright notices. Nothing in this repository, README, or `LICENSE.md` is intended to remove, replace, restrict, or override rights and obligations that apply to upstream open-source code.

In addition to the upstream code, this repository contains extensive INNBCswap-specific custom work. The INNBCswap-specific modifications, assets, configuration, documentation, deployment architecture, and integration work introduced by this project are source-visible for review, but they are not separately offered as open source unless explicitly stated otherwise.

These INNBCswap-specific additions include, but are not limited to:

- INNBCswap branding
- INNBCswap UI changes
- INNBC token and curated liquidity logic
- custom 0x API routing and aggregator integration work
- custom Solana/Jupiter integration work
- local token metadata changes
- API proxy and server-side key-security architecture
- production deployment configuration
- custom pruning, refactoring, and app-specific restructuring
- INNBC-specific assets, configuration, and documentation

This means:

- the source is visible for review
- upstream open-source code remains subject to its upstream license terms
- no additional license is granted to copy, reuse, modify, redistribute, sublicense, or commercially use the INNBCswap-specific custom modifications except by separate written authorization
- companies interested in using the engine, integrations, architecture, or custom modifications should contact the author for a commercial license agreement
- see `LICENSE.md` for the full license terms

The restriction described here applies only to the INNBCswap-specific custom work introduced by this project, and only to the extent permitted by applicable upstream licenses.

### Commercial Licensing

For commercial licensing, engine licensing, collaboration, or technical consulting, contact:

administrator@innovativebioresearch.com