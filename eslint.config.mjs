import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypescript,
  // Override default ignores of eslint-config-next. This `globalIgnores` call replaces
  // the ignore list ESLint would otherwise apply, and without `node_modules/**` listed
  // here explicitly, `npm run lint` walks the entire dependency tree and never finishes
  // in reasonable time (diagnosed during Task 15, fixed in Task 16).
  globalIgnores([
    'node_modules/**',
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

/*
 * Belt-and-suspenders beyond the `ignores` list above: `package.json`'s `lint` script
 * passes explicit target paths (`src`, the four root config files) instead of linting
 * `.`. This is not just style — on a checkout whose path contains the Turkish "İ"
 * (U+0130), `@eslint/config-array`'s vendored Windows `relative()` helper lowercases
 * both sides of the path comparison for a case-insensitive prefix match, and
 * `"İ".toLowerCase()` is BMP-but-two-code-units ("i" + COMBINING DOT ABOVE) — one
 * character longer than the original. The common-prefix length is measured on that
 * lowercased string but then used to slice the ORIGINAL (non-lowercased) path, so the
 * relative path handed to every `ignores` pattern is missing its first character (e.g.
 * "node_modules/…" arrives as "ode_modules/…"). No `ignores` pattern — `node_modules/**`
 * included — can then match, and `npm run lint` walks the entire dependency tree again
 * regardless of what this file says. Scoping the CLI invocation to real source
 * directories sidesteps the bug entirely: `node_modules` is a sibling of `src`, so it is
 * never enumerated as a candidate file in the first place, independent of whether the
 * ignore-matching in this environment is trustworthy.
 */

export default eslintConfig
