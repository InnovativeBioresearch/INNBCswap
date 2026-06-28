const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// packages/api
const apiRoot = path.resolve(__dirname, '..')
// repo root
const repoRoot = path.resolve(apiRoot, '..', '..')

// The buggy base directory that openapi-typescript-codegen/json-schema-ref-parser resolves from on Windows
const bugBaseDir = path.resolve(repoRoot, 'node_modules', '@apidevtools', 'json-schema-ref-parser', 'dist')

const inputAbs = path.resolve(apiRoot, 'src', 'clients', 'trading', 'api.json')
const outputAbs = path.resolve(apiRoot, 'src', 'clients', 'trading', '__generated__')

if (!fs.existsSync(bugBaseDir)) {
  throw new Error(`Expected folder not found: ${bugBaseDir}`)
}
if (!fs.existsSync(inputAbs)) {
  throw new Error(`Trading OpenAPI spec not found: ${inputAbs}`)
}

const toPosix = (p) => p.replace(/\\/g, '/')

// IMPORTANT: compute paths *relative to the buggy base dir*
const inputRel = toPosix(path.relative(bugBaseDir, inputAbs))
const outputRel = toPosix(path.relative(bugBaseDir, outputAbs))

const cmd =
  `openapi --input "${inputRel}" ` +
  `--output "${outputRel}" ` +
  `--useOptions --exportServices true --exportModels true`

// Force the CLI to run with CWD = bugBaseDir so relative paths resolve correctly
execSync(cmd, { stdio: 'inherit', cwd: bugBaseDir })