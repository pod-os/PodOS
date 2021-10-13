require("esbuild")
  .serve({ servedir: "www", port: 4444 }, {
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: 'www/index.js',
    globalName: 'PodOS',

  })
  .catch(() => process.exit(1));
