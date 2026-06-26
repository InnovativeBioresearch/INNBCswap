//START ALPHA CHANGE 1528 -- remove dead OG image route imports after deleting Vercel image handlers --
import { metaTagInjectionMiddleware } from 'functions/components/metaTagInjector'
//FINISH ALPHA CHANGE 1528 -- remove dead OG image route imports after deleting Vercel image handlers --
//START ALPHA CHANGE 3495 -- remove old Uniswap entry-gateway proxy imports from web worker --
import { Context, Hono } from 'hono'
//FINISH ALPHA CHANGE 3495 -- remove old Uniswap entry-gateway proxy imports from web worker --

type Bindings = {
  ASSETS?: { fetch: typeof fetch } // Only present on Cloudflare Workers
}

/** Platform-specific dependencies injected by each entry point. */
interface AppConfig {
  fetchSpaHtml: (c: Context) => Promise<Response>
}

//START ALPHA CHANGE 3496 -- remove old Uniswap entry-gateway and websocket backend constants from web worker --
//FINISH ALPHA CHANGE 3496 -- remove old Uniswap entry-gateway and websocket backend constants from web worker --



// ── Cache-Control middleware for image routes ───────────────────────────
//START ALPHA CHANGE 1530 -- remove dead image-route cache middleware after deleting OG image endpoints --
//FINISH ALPHA CHANGE 1530 -- remove dead image-route cache middleware after deleting OG image endpoints --


export function createApp({ fetchSpaHtml }: AppConfig) {
  const app = new Hono<{ Bindings: Bindings }>()

//START ALPHA CHANGE 1529 -- remove dead OG image routes after deleting Vercel image handlers --
//FINISH ALPHA CHANGE 1529 -- remove dead OG image routes after deleting Vercel image handlers --

//START ALPHA CHANGE 3497 -- remove old Uniswap entry-gateway and websocket proxy routes from web worker --
//FINISH ALPHA CHANGE 3497 -- remove old Uniswap entry-gateway and websocket proxy routes from web worker --


  // ── Catch-all: SPA serving + meta tag injection ────────────────────────
  app.all('*', async (c: Context) => {
    const url = new URL(c.req.url)

    const next = async () => {
      const response = await fetchSpaHtml(c)
      c.res = response
    }

    // API routes should not be processed by meta tag injection
    if (url.pathname.startsWith('/api/')) {
      await next()
      return c.res
    }

    // For non-API routes, use meta tag injection middleware
    return metaTagInjectionMiddleware(c, next)
  })

  return app
}
