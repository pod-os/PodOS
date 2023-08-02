import { build } from "esbuild";
await build({
  logLevel: "info",
  entryPoints: ["src/index.ts"],
  outfile: "lib/index.js",
  bundle: true,
  target: "esnext",
  globalName: "PodOS",
});
