#!/usr/bin/env node

import * as esbuild from "esbuild";
import esbuildEnvfilePlugin from "esbuild-envfile-plugin";

await esbuild
  .build({
    entryPoints: ["client/app.jsx"],
    outfile: "public/bundle.js",
    bundle: true,
    minify: true,
    target: "ES6",
    loader: { 
      '.png': 'file',
      '.jpg': 'file'
     },
    plugins: [esbuildEnvfilePlugin],
  })
  .then((r) => console.log("Build succeeded."))
  .catch((e) => {
    console.log("Error building:", e.message);
    process.exit(1)
  });
