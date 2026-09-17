import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["../cli/src/index.ts"],
  format: ["cjs", "esm"],
  dts: false,
  clean: true,
  minify: false,
  sourcemap: true,
  splitting: false,
  noExternal: [/.*/],
  banner: {
    js: "#!/usr/bin/env node",
  },
});
