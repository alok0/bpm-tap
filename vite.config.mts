import { resolve } from "path";
import { defineConfig } from "vite";
import tailwindcssPlugin from "@tailwindcss/vite";
import prefreshPlugin from "@prefresh/vite";

const dirname = new URL(".", import.meta.url).pathname;

export default defineConfig(() => {
  return defineConfig({
    root: "src",
    base: "./",
    publicDir: false,
    clearScreen: false,
    esbuild: {
      legalComments: "none",
      jsx: "automatic",
      jsxImportSource: "preact",
    },
    build: {
      outDir: resolve(dirname, "dist"),
      emptyOutDir: true,
      target: ["chrome111", "firefox128"],
      assetsInlineLimit: 0,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1024 * 1024,
      modulePreload: { polyfill: false },
      rollupOptions: {
        output: {
          entryFileNames: "[hash].js",
          assetFileNames: "[hash][extname]",
          chunkFileNames: "[hash].js",
        },
      },
    },
    resolve: {
      alias: [
        { find: "react", replacement: "preact/compat" },
        { find: "react-dom/test-utils", replacement: "preact/test-utils" },
        { find: "react-dom", replacement: "preact/compat" },
        { find: "react/jsx-runtime", replacement: "preact/jsx-runtime" },
      ],
    },
    server: {
      allowedHosts: true,
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "credentialless",
      },
    },
    plugins: [tailwindcssPlugin(), prefreshPlugin()],
  });
});
