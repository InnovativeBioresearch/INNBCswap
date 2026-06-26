//START ALPHA CHANGE 1512 -- remove legacy .env.local dependency from CSP Vite plugin --
import fs from 'fs'
import path from 'path'
import type { Plugin } from 'vite'
//FINISH ALPHA CHANGE 1512 -- remove legacy .env.local dependency from CSP Vite plugin --

const CSP_DIRECTIVE_MAP: Record<string, string> = {
  defaultSrc: 'default-src',
  scriptSrc: 'script-src',
  styleSrc: 'style-src',
  imgSrc: 'img-src',
  frameSrc: 'frame-src',
  connectSrc: 'connect-src',
  workerSrc: 'worker-src',
  mediaSrc: 'media-src',
  fontSrc: 'font-src',
  formAction: 'form-action',
}

// This plugin is used in vite.config.mts
// eslint-disable-next-line import/no-unused-modules
export function cspMetaTagPlugin(mode?: string): Plugin {
  return {
    name: 'inject-csp-meta',

    transformIndexHtml(html) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const env = mode ?? process.env.NODE_ENV ?? 'development'
//START ALPHA CHANGE 1513 -- remove env-driven CSP skip toggle from CSP Vite plugin --
//FINISH ALPHA CHANGE 1513 -- remove env-driven CSP skip toggle from CSP Vite plugin --

      // Load base CSP - adjust path to be relative to the project root
      const baseCSPPath = path.resolve(process.cwd(), 'public', 'csp.json')
      const baseCSP = JSON.parse(fs.readFileSync(baseCSPPath, 'utf-8'))

      // Optionally extend with dev/staging
      const envConfigFile = env === 'development' ? 'dev-csp.json' : env === 'staging' ? 'staging-csp.json' : null

      if (envConfigFile) {
        const extraCSPPath = path.resolve(process.cwd(), 'public', envConfigFile)
        const extraCSP = JSON.parse(fs.readFileSync(extraCSPPath, 'utf-8'))
        for (const [key, value] of Object.entries(extraCSP)) {
          if (Array.isArray(value)) {
            baseCSP[key] = [...new Set([...(baseCSP[key] || []), ...value])]
          }
        }
      }

//START ALPHA CHANGE 1514 -- remove legacy trading API env override from CSP Vite plugin --
//FINISH ALPHA CHANGE 1514 -- remove legacy trading API env override from CSP Vite plugin --

      // Transform the CSP content using the directive map
      const cspContent = Object.entries(baseCSP)
        .map(([key, values]) => {
          const directive = CSP_DIRECTIVE_MAP[key]
          if (!directive) {
            // Log unknown directives in development only
            if (env === 'development') {
              // biome-ignore lint/suspicious/noConsole: Required for Vite build debugging
              console.warn(`Unknown CSP directive: ${key}`)
            }
            return null
          }
          return `${directive} ${(values as string[]).join(' ')}`
        })
        .filter(Boolean)
        .join('; ')

      const escapedContent = cspContent
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')

      // Replace the comment with the CSP meta tag
      return html.replace(
        /<!-- CSP will be injected here -->/,
        `<meta http-equiv="Content-Security-Policy" content="${escapedContent}">`,
      )
    },
  }
}
