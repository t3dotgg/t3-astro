export default {
  buildOptions: {
    site: "https://astro.t3.gg",
    sitemap: true, // Generate sitemap (set to "false" to disable)
  },
  devOptions: {
    port: 3000,
    hostname: "0.0.0.0",
    tailwindConfig: "./tailwind.config.js",
  },
  renderers: [],
};
