//START ALPHA CHANGE 1522 -- remove Cloudflare Vite runtime plugin from plain web frontend config --
//FINISH ALPHA CHANGE 1522 -- remove Cloudflare Vite runtime plugin from plain web frontend config --
import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react'
//START ALPHA CHANGE 1663 -- remove unused child_process import after pruning legacy Vite git/env plumbing --
//FINISH ALPHA CHANGE 1663 -- remove unused child_process import after pruning legacy Vite git/env plumbing --
//START ALPHA CHANGE 1498 -- stop Vite from loading legacy .env files after migrating runtime config away from env --
//FINISH ALPHA CHANGE 1498 -- stop Vite from loading legacy .env files after migrating runtime config away from env --
import fs from 'fs'
import path from 'path'
import { createHash } from 'node:crypto'
import process from 'process'
import { fileURLToPath } from 'url'
//START ALPHA CHANGE 5936 -- load local proxy secrets for Vite dev without exposing them to browser runtime config --
import dotenv from 'dotenv'
//FINISH ALPHA CHANGE 5936 -- load local proxy secrets for Vite dev without exposing them to browser runtime config --
//START ALPHA CHANGE 1499 -- remove Vite loadEnv usage after pruning legacy .env runtime config --
import { defineConfig, type ViteDevServer } from 'vite'
//FINISH ALPHA CHANGE 1499 -- remove Vite loadEnv usage after pruning legacy .env runtime config --
import bundlesize from 'vite-plugin-bundlesize'
import commonjs from 'vite-plugin-commonjs'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
//START ALPHA CHANGE 1515 -- remove Cloudflare-only assets-ignore plugin from plain web Vite config --
//FINISH ALPHA CHANGE 1515 -- remove Cloudflare-only assets-ignore plugin from plain web Vite config --
import { cspMetaTagPlugin } from './vite/vite.plugins.js'
//START ALPHA CHANGE 1517 -- remove old entry-gateway proxy plumbing from local web Vite config --
//FINISH ALPHA CHANGE 1517 -- remove old entry-gateway proxy plumbing from local web Vite config --

// Get current file directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//START ALPHA CHANGE 5937 -- read ignored local API proxy secrets for Vite dev parity with Nginx --
dotenv.config({ path: path.resolve(__dirname, '.env.local') })
//FINISH ALPHA CHANGE 5937 -- read ignored local API proxy secrets for Vite dev parity with Nginx --

// When the private embedded wallet package is not installed,
// externalize it so Rollup doesn't fail to resolve dynamic imports at build time.
// At runtime, the dynamic import will fail and the try/catch in loadPrivyPbModule() provides
// a clear error message: "Embedded Wallet requires @uniswap/client-privy-embedded-wallet".
const privyPackageInstalled = fs.existsSync(
  path.resolve(__dirname, '../../node_modules/@uniswap/client-privy-embedded-wallet'),
)
const ENABLE_REACT_COMPILER = process.env.ENABLE_REACT_COMPILER === 'true'
const ReactCompilerConfig = {
  target: '18', // '17' | '18' | '19'
}

const VITE_DISABLE_SOURCEMAP = process.env.VITE_DISABLE_SOURCEMAP === 'true'
//START ALPHA CHANGE 1521 -- remove dead proxy debug flag after deleting old Vite proxy plumbing --
//FINISH ALPHA CHANGE 1521 -- remove dead proxy debug flag after deleting old Vite proxy plumbing --
//START ALPHA CHANGE 1518 -- remove old entry-gateway proxy toggle from local web Vite config --
//FINISH ALPHA CHANGE 1518 -- remove old entry-gateway proxy toggle from local web Vite config --

const DEFAULT_PORT = 3000

/**
 * Vite's optimizeDeps cache hash doesn't include `define` values, so changing env vars
 * (which are injected via `define` as `process.env.X` replacements) won't invalidate the
 * pre-bundled deps cache. This compares a hash of the resolved env defines against a stored
 * hash and forces a re-bundle only when env values actually changed.
 */
function shouldInvalidateOptimizeDepsForEnv({
  defines,
  cacheDir,
}: {
  defines: Record<string, unknown>
  cacheDir: string
}): boolean {
  const hash = createHash('md5').update(JSON.stringify(defines)).digest('hex').slice(0, 16)
  const hashFile = path.join(cacheDir, '.env-defines-hash')

  try {
    if (fs.existsSync(hashFile)) {
      const stored = fs.readFileSync(hashFile, 'utf-8').trim()
      if (stored === hash) {
        return false
      }
    }
  } catch {
    return true
  }

  try {
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true })
    }
    fs.writeFileSync(hashFile, hash)
  } catch {
    return true
  }

  return true
}

const reactPlugin = () =>
  ENABLE_REACT_COMPILER
    ? react({
        babel: {
          plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
        },
      })
    : react()

// Prints a warning if server automatically switches to a different port when `DEFAULT_PORT` is already in use
const portWarningPlugin = (isProduction: boolean) =>
  isProduction
    ? undefined
    : {
        name: 'port-warning',
        configureServer(server: ViteDevServer) {
          server.httpServer?.once('listening', () => {
            const address = server.httpServer?.address()
            if (address && typeof address === 'object' && address.port !== DEFAULT_PORT) {
              setTimeout(() => {
                console.log('\n')
                console.log('\x1b[41m\x1b[37m' + '═'.repeat(80) + '\x1b[0m')
                console.log('\x1b[41m\x1b[37m' + ' '.repeat(80) + '\x1b[0m')
                console.log('\x1b[41m\x1b[37m' + '  ⚠️  WARNING: Port 3000 is already in use!'.padEnd(80) + '\x1b[0m')
                console.log('\x1b[41m\x1b[37m' + ' '.repeat(80) + '\x1b[0m')
                console.log(
                  '\x1b[41m\x1b[37m' + '  You may have another server instance running.'.padEnd(80) + '\x1b[0m',
                )
                console.log('\x1b[41m\x1b[37m' + ' '.repeat(80) + '\x1b[0m')
                console.log(
                  '\x1b[41m\x1b[37m' +
                    `  The server is running on port ${address.port} instead.`.padEnd(80) +
                    '\x1b[0m',
                )
                console.log('\x1b[41m\x1b[37m' + ' '.repeat(80) + '\x1b[0m')
                console.log('\x1b[41m\x1b[37m' + '═'.repeat(80) + '\x1b[0m')
                console.log('\n')
              }, 100) // Small delay to ensure it appears after Vite's messages
            }
          })
        },
      }

//START ALPHA CHANGE 1500 -- remove legacy .env loading and env-derived git metadata from Vite config --
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
//FINISH ALPHA CHANGE 1500 -- remove legacy .env loading and env-derived git metadata from Vite config --
  const isStaging = mode === 'staging'
//START ALPHA CHANGE 1525 -- remove dead Vercel deployment branching from plain web Vite config --
//FINISH ALPHA CHANGE 1525 -- remove dead Vercel deployment branching from plain web Vite config --
  const root = path.resolve(__dirname)

  //START ALPHA CHANGE 5938 -- keep local API keys in Vite dev proxy process instead of browser runtime config --
  const localZeroExApiKey = process.env.ZERO_EX_API_KEY
  const localJupiterApiKey = process.env.JUPITER_API_KEY
  const localHeliusApiKey = process.env.HELIUS_API_KEY
  //FINISH ALPHA CHANGE 5938 -- keep local API keys in Vite dev proxy process instead of browser runtime config --

  // External package aliases only
  const overrides = {
    // External package aliases
    'react-native': 'react-native-web',
    'expo-blur': path.resolve(__dirname, './.storybook/__mocks__/expo-blur.jsx'),
    '@web3-react/core': path.resolve(__dirname, 'src/connection/web3reactShim.ts'),
    'uniswap/src': path.resolve(__dirname, '../../packages/uniswap/src'),
    'utilities/src': path.resolve(__dirname, '../../packages/utilities/src'),
    'ui/src': path.resolve(__dirname, '../../packages/ui/src'),
    'expo-clipboard': path.resolve(__dirname, 'src/lib/expo-clipboard.jsx'),
    // Force JSBI to use ESM build so transform plugin can add __esModule marker
    jsbi: path.resolve(__dirname, '../../node_modules/jsbi/dist/jsbi.mjs'),
  }

  const privyStubs = !privyPackageInstalled
    ? {
        '@uniswap/client-privy-embedded-wallet/dist/uniswap/privy-embedded-wallet/v1/service_pb': path.resolve(
          __dirname,
          'src/stubs/privy-service-pb.ts',
        ),
        '@uniswap/client-privy-embedded-wallet/dist/uniswap/privy-embedded-wallet/v1/service_connect': path.resolve(
          __dirname,
          'src/stubs/privy-service-connect.ts',
        ),
      }
    : {}

  // Aliases that need exact matching (using resolve.alias array format)
  const exactAliases = [
    // Use web app-specific i18n entry that doesn't import wallet's i18n-setup (exact match only)
    {
      find: /^uniswap\/src\/i18n$/,
      replacement: path.resolve(__dirname, '../../packages/uniswap/src/i18n/index.web-app.ts'),
    },
  ]

//START ALPHA CHANGE 1501 -- remove env-derived define injection after pruning legacy web env config --
  //START ALPHA CHANGE 1628 -- restore web platform env defines required by runtime platform detection after Vite env cleanup --
  const defines = {
    __DEV__: !isProduction,
    'process.env.NODE_ENV': JSON.stringify(mode),
    'process.env.EXPO_OS': JSON.stringify('web'),
    'process.env.TAMAGUI_STACK_Z_INDEX_GLOBAL': JSON.stringify('true'),
    'process.env.REACT_APP_IS_UNISWAP_INTERFACE': JSON.stringify('true'),
    'process.env.IS_UNISWAP_EXTENSION': JSON.stringify('false'),
  }
  //FINISH ALPHA CHANGE 1628 -- restore web platform env defines required by runtime platform detection after Vite env cleanup --
//FINISH ALPHA CHANGE 1501 -- remove env-derived define injection after pruning legacy web env config --

  const cacheDir = path.resolve(__dirname, 'node_modules/.vite')
  const forceOptimize = shouldInvalidateOptimizeDepsForEnv({ defines, cacheDir })

  return {
    root,

    define: defines,

    resolve: {
      // .web-app file extensions take priority over .web for web app-specific overrides
      extensions: ['.web-app.tsx', '.web-app.ts', '.web-app.js', '.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js'],
      modules: [path.resolve(root, 'node_modules')],
      dedupe: [
        '@uniswap/sdk-core',
        '@uniswap/v2-sdk',
        '@uniswap/v3-sdk',
        '@uniswap/v4-sdk',
        '@uniswap/router-sdk',
        '@uniswap/universal-router-sdk',
        '@uniswap/uniswapx-sdk',
        '@uniswap/permit2-sdk',
        '@visx/responsive',
        'jsbi',
        'ethers',
        'react',
        'react-dom',
      ],
      alias: [
        ...exactAliases,
        ...Object.entries({ ...overrides, ...privyStubs }).map(([find, replacement]) => ({ find, replacement })),
      ],
    },

    plugins: [
      // Fix JSBI ESM interop issue:
      // Rollup's interop wrapper checks for __esModule and passes through if present.
      // JSBI's pure ESM build doesn't have __esModule, so Rollup creates a proxy wrapper
      // that loses static methods like BigInt(). By adding __esModule as a named export,
      // the module namespace will include it, and the interop function returns the module
      // as-is, preserving all static methods.
      {
        name: 'jsbi-esm-interop-fix',
        enforce: 'pre' as const,
        transform(code: string, id: string) {
          // Only transform the JSBI ESM module
          if (!id.includes('node_modules/jsbi/dist/jsbi.mjs')) {
            return null
          }

          // Add __esModule as a named export so Rollup's interop passes it through
          // The interop checks: hasOwnProperty(moduleNamespace, "__esModule")
          // By exporting it, it will be a property on the module namespace object
          return {
            code: `${code}\nexport const __esModule = true;`,
            map: null,
          }
        },
      },
      {
        name: 'transform-react-native-jsx',
        async transform(code: string, id: string) {
          // Transform JSX in react-native libraries that ship JSX in .js files
          const needsJsxTransform = [
            'node_modules/react-native-reanimated',
            'node_modules/expo-blur'  // In case it's not fully mocked
          ].some(path => id.includes(path))

          if (!needsJsxTransform || !id.endsWith('.js')) {
            return null
          }

          // Dynamic import to avoid top-level import issues
          const { transformWithEsbuild } = await import('vite')

          // Use Vite's transformWithEsbuild to handle JSX
          return transformWithEsbuild(code, id, {
            loader: 'jsx',
            jsx: 'automatic',
          })
        },
      },
      portWarningPlugin(isProduction),
      reactPlugin(),
      isProduction || isStaging
        ? tamaguiPlugin({
            config: '../../packages/ui/src/tamagui.config.ts',
            components: ['ui', 'uniswap', 'utilities'],
            optimize: true,
            importsWhitelist: ['constants.js'],
          })
        : undefined,
      tsconfigPaths({
        // ignores tsconfig files in Nx generator template directories
        skip: (dir) => dir.includes('files'),
      }),
//START ALPHA CHANGE 1509 -- remove final legacy REACT_APP CSP toggle from Vite config --
      cspMetaTagPlugin(mode),
//FINISH ALPHA CHANGE 1509 -- remove final legacy REACT_APP CSP toggle from Vite config --
      svgr({
        svgrOptions: {
          icon: false,
          ref: true,
          titleProp: true,
          exportType: 'named',
          svgo: true,
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: { removeViewBox: false },
                },
              },
              'removeDimensions',
            ],
          },
        },
        include: '**/*.svg',
      }),
      //START ALPHA CHANGE 5944 -- stop production build from recreating pruned Rive landing assets --
      //FINISH ALPHA CHANGE 5944 -- stop production build from recreating pruned Rive landing assets --
      {
        name: 'svg-import-fix',
        transform(code: string) {
          const regex = /import\s+([a-zA-Z0-9_$]+)\s+from\s+['"]([^'"]+\.svg)['"]/g

          // eslint-disable-next-line max-params
          const transformed = code.replace(regex, (match, varName, path) => {
            // Don't touch named imports like { ReactComponent }
            if (match.includes('{')) return match
            // Skip if it already has a query param
            if (path.includes('?')) return match

            return `import ${varName} from '${path}?url'`
          })

          return transformed === code ? null : transformed
        },
      },
      nodePolyfills({
        globals: {
          process: true,
        },
        include: ['path', 'buffer'],
      }),
      commonjs({
        dynamic: {
          loose: false,
        },
      }),
      isProduction || VITE_DISABLE_SOURCEMAP
        ? undefined
        : bundlesize({
            limits: [
              { name: 'assets/index-*.js', limit: '2.40 MB', mode: 'gzip' },
              { name: '**/*', limit: Infinity, mode: 'uncompressed' },
            ],
          }),
//START ALPHA CHANGE 1516 -- remove Cloudflare-only assets-ignore plugin usage from plain web Vite config --
//FINISH ALPHA CHANGE 1516 -- remove Cloudflare-only assets-ignore plugin usage from plain web Vite config --
      {
        name: 'copy-twist-config',
        writeBundle() {
          const configMode = isProduction ? 'production' : 'staging'
          const sourceFile = path.resolve(__dirname, `twist-configs/twist.${configMode}.json`)
          const targetFileRoot = path.resolve(__dirname, `build/.well-known/twist.json`)
          const targetFileClient = path.resolve(__dirname, `build/client/.well-known/twist.json`)

          if (fs.existsSync(sourceFile)) {
            // Ensure the .well-known directory exists in build output
            const targetDirRoot = path.dirname(targetFileRoot)
            if (!fs.existsSync(targetDirRoot)) {
              fs.mkdirSync(targetDirRoot, { recursive: true })
            }

            // Ensure the .well-known directory also exists under build/client
            const targetDirClient = path.dirname(targetFileClient)
            if (!fs.existsSync(targetDirClient)) {
              fs.mkdirSync(targetDirClient, { recursive: true })
            }

            // Copy the file directly to the build output
            fs.copyFileSync(sourceFile, targetFileRoot)
            fs.copyFileSync(sourceFile, targetFileClient)
            console.log(`Copied ${configMode} TWIST config to build output (root and client) for env ${mode}`)
          } else {
            console.warn(`${configMode} TWIST config not found for env ${mode}`)
          }
        },
      },
//START ALPHA CHANGE 1523 -- remove Cloudflare runtime integration so Vite stays a plain frontend server/build tool --
//FINISH ALPHA CHANGE 1523 -- remove Cloudflare runtime integration so Vite stays a plain frontend server/build tool --
    ].filter(Boolean as unknown as <T>(x: T) => x is NonNullable<T>),

    optimizeDeps: {
      force: forceOptimize,
      entries: ['index.html'],
      include: [
        'graphql',
        'expo-linear-gradient',
        'expo-modules-core',
        'react-native-web',
        'react-native-gesture-handler',
        'tamagui',
        '@tamagui/web',
        'ui',
        '@uniswap/sdk-core',
        '@uniswap/v2-sdk',
        '@uniswap/v3-sdk',
        '@uniswap/v4-sdk',
        '@uniswap/router-sdk',
        '@uniswap/universal-router-sdk',
        '@uniswap/uniswapx-sdk',
        '@uniswap/permit2-sdk',
        'jsbi',
        'ethers',
        '@visx/responsive',
      ],
      // Libraries that shouldn't be pre-bundled
      exclude: ['expo-clipboard', '@connectrpc/connect'],
      esbuildOptions: {
        resolveExtensions: ['.web-app.js', '.web-app.ts', '.web-app.tsx', '.web.js', '.web.ts', '.web.tsx', '.js', '.ts', '.tsx'],
        loader: {
          '.js': 'jsx',
          '.ts': 'ts',
          '.tsx': 'tsx',
        },
      },
    },

    server: {
      port: DEFAULT_PORT,
      //START ALPHA CHANGE 3437 -- proxy local 0x Swap API calls through Vite to avoid browser CORS during local testing --
      proxy: {
        '/api/zero-ex': {
          target: 'https://api.0x.org',
          changeOrigin: true,
          secure: true,
          //START ALPHA CHANGE 5939 -- inject local 0x credentials from Vite server env instead of browser config --
          headers: {
            ...(localZeroExApiKey ? { '0x-api-key': localZeroExApiKey } : {}),
            '0x-version': 'v2',
          },
          //FINISH ALPHA CHANGE 5939 -- inject local 0x credentials from Vite server env instead of browser config --
          rewrite: (requestPath) => requestPath.replace(/^\/api\/zero-ex/, ''),
        },
        //START ALPHA CHANGE 5303 -- proxy local Jupiter Swap API calls for the separate Solana path --
        '/api/jupiter': {
          target: 'https://api.jup.ag/swap/v2',
          changeOrigin: true,
          secure: true,
          //START ALPHA CHANGE 5940 -- inject local Jupiter credentials from Vite server env instead of browser config --
          headers: {
            ...(localJupiterApiKey ? { 'x-api-key': localJupiterApiKey } : {}),
          },
          //FINISH ALPHA CHANGE 5940 -- inject local Jupiter credentials from Vite server env instead of browser config --
          rewrite: (requestPath) => requestPath.replace(/^\/api\/jupiter/, ''),
        },
        //FINISH ALPHA CHANGE 5303 -- proxy local Jupiter Swap API calls for the separate Solana path --
        //START ALPHA CHANGE 5941 -- proxy local Solana RPC through Vite so Helius keys stay server-side --
        '/api/solana-rpc': {
          target: 'https://mainnet.helius-rpc.com',
          changeOrigin: true,
          secure: true,
          rewrite: () => `/?api-key=${localHeliusApiKey ?? ''}`,
        },
        //FINISH ALPHA CHANGE 5941 -- proxy local Solana RPC through Vite so Helius keys stay server-side --
      },
      //FINISH ALPHA CHANGE 3437 -- proxy local 0x Swap API calls through Vite to avoid browser CORS during local testing --
    },

    build: {
      outDir: 'build',
//START ALPHA CHANGE 1526 -- remove dead Vercel-specific build branching from plain web Vite config --
      sourcemap: VITE_DISABLE_SOURCEMAP ? false : (isProduction ? 'hidden' : true),
      minify: isProduction ? 'esbuild' : undefined,
//FINISH ALPHA CHANGE 1526 -- remove dead Vercel-specific build branching from plain web Vite config --
      rollupOptions: {
        external: [
          /\.stories\.[tj]sx?$/,
          /\.mdx$/,
          /expo-clipboard\/build\/ClipboardPasteButton\.js/,
          // When the private package is not installed, externalize it so Rollup doesn't error.
          // Dynamic imports of this module will fail at runtime (caught by loadPrivyPbModule's try/catch).
          ...(!privyPackageInstalled ? [/^@uniswap\/client-privy-embedded-wallet/] : []),
        ],
        output: {
          // Ensure consistent file naming for better caching
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      // Increase the warning limit for larger chunks
      chunkSizeWarningLimit: 800,
      commonjsOptions: {
        include: [/node_modules/],
      },
    },

    // Support all prefixes (including no prefix)
    envPrefix: [],

    preview: {
      port: 3000,
    },
  }
})

//START ALPHA CHANGE 1520 -- remove dead proxy logger helper after deleting old Vite proxy plumbing --
//FINISH ALPHA CHANGE 1520 -- remove dead proxy logger helper after deleting old Vite proxy plumbing --
