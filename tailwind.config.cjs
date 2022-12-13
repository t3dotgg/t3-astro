// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,svg}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        "theo-purple": "#E8DCFF",
        "theo-blue": "#1F11E4",
        black: "#27272a",
        white: "#F4F4F5",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            blockquote: { "border-color": "rgb(39 39 42 / 5)" },
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:first-of-type::after": { content: "none" },
            "ul > li::marker": {
              color: "#27272a",
              fontWeight: "600",
            },
            color: "#27272a",
            pre: {
              color: "rgb(39 39 42 / 5)",
              backgroundColor: "rgb(39 39 42 / 5)",
            },
            "pre code::before": {
              "padding-left": "unset",
            },
            "pre code::after": {
              "padding-right": "unset",
            },
            code: {
              backgroundColor: "rgb(39 39 42 / 0.1)",
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
              color: "#1F11E4",
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
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
