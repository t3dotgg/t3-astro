// tailwind.config.js
module.exports = {
  mode: "jit",
  content: [
    "./public/**/*.html",
    "./src/**/*.{astro,js,jsx,svelte,ts,tsx,vue,md}",
  ],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            blockquote: { "border-color": theme("colors.gray.800") },
            "ul > li::before": { "background-color": theme("colors.gray.800") },
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:first-of-type::after": { content: "none" },
            color: theme("colors.gray.800"),
            pre: {
              color: theme("colors.gray.100"),
              backgroundColor: theme("colors.gray.200"),
            },
            "pre code::before": {
              "padding-left": "unset",
            },
            "pre code::after": {
              "padding-right": "unset",
            },
            code: {
              backgroundColor: theme("colors.gray.200"),
              color: "#DD1144",
              fontWeight: "400",
              "border-radius": "0.25rem",
            },
            "code::before": {
              content: '""',
              "padding-left": "0.25rem",
            },
            "code::after": {
              content: '""',
              "padding-right": "0.25rem",
            },
            a: {
              color: theme(`colors.blue.600`),
              textDecoration: `none`,
              "&:hover": {
                textDecoration: `underline`,
              },
            },
          },
        },
      }),
      keyframes: {
        "fade-in-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      animation: {
        "fade-in-down": "fade-in-down 0.5s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
      },
      boxShadow: {
        'ring': '0 0 0 3px rgba(255, 255, 255, 0.8), 0 0 2px 3px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // ...
  ],
};
