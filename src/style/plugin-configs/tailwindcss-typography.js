/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      typography: {
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
      },
    },
  },
};
