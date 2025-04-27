import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  target: 'esnext',
  clean: true,
  dts: true,
  treeshake: false,
  splitting: false,
  minify: true,
  sourcemap: true,
})
