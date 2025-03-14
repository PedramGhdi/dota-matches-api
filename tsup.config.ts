import { config } from "dotenv"
import { execSync } from "child_process"
import { defineConfig } from "tsup"

config()

let gitSha = "unknown" // Default value if Git command fails
try {
  gitSha = execSync("git rev-parse --short HEAD").toString().trim()
} catch (error) {
  console.warn("Warning: Unable to retrieve Git SHA. Using default value.")
}

export default defineConfig({
  entry: ["src/index.ts"],

  define: {
    "import.meta.env.MODE": JSON.stringify(
      process.env.NODE_ENV === "development" ? "development" : "production",
    ),
    GIT_SHA: JSON.stringify(gitSha),
  },

  esbuildOptions: (options) => {
    options.supported = {
      // For better performance: https://github.com/evanw/esbuild/issues/951
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
