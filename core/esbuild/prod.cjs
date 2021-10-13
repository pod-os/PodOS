require("esbuild")
  .build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    outfile: "lib/index.js",
    globalName: "PodOS",
  })
  .catch(() => process.exit(1));
