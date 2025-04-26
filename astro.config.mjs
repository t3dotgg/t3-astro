import { defineConfig } from "astro/config";
import prefetch from "@astrojs/prefetch";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  plugins: [],
  integrations: [prefetch()],
  redirects: {
    "/links": "/",
    "/faq": "/",
  },
});
