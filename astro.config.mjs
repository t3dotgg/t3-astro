import { defineConfig } from "astro/config";
import prefetch from "@astrojs/prefetch";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [prefetch(), tailwind()],
  redirects: {
    "/links": "/",
    "/faq": "/",
  },
});
