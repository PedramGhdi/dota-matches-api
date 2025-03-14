import { config } from "dotenv"
import { defineConfig } from "tsup"

config()

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",

  define: {
    "import.meta.env.MODE": JSON.stringify(
      process.env.NODE_ENV === "development" ? "development" : "production",
    ),
  },

  esbuildOptions: (options) => {
    options.supported = {
      "object-rest-spread": false,
    }
  },

  bundle: true,
  splitting: false,
  sourcemap: true,
  platform: "browser",
  target: "node22",
  format: ["esm"],

  clean: true,
  minify: true,
})
