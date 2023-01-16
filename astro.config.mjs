import { defineConfig } from "astro/config";
import prefetch from "@astrojs/prefetch";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "http://localhost:3000",
  integrations: [prefetch(), tailwind()],
});
