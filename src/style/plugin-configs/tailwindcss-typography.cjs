const colorForeground = "var(--color-foreground)";
const colorBackground = "var(--color-background)";

/**
 * Get a color with a given opacity
 * @param {number} opacity - The opacity of the color (0-1)
 * @returns {string} The color with the given opacity
 */
function applyAlphaColor(color, opacity) {
  return `color-mix(in srgb, ${color} ${opacity * 100}%, transparent)`
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-headings': colorForeground,
            '--tw-prose-quotes': colorForeground,
            '--tw-prose-bold': colorForeground,
            color: applyAlphaColor(colorForeground, .9),
            blockquote: { "border-color": colorForeground },
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:first-of-type::after": { content: "none" },
            "ul > li::marker": {
              color: colorForeground,
              fontWeight: "600",
            },
            pre: {
              color: colorForeground,
              backgroundColor: colorForeground,
            },
            "pre code::before": {
              "padding-left": "unset",
            },
            "pre code::after": {
              "padding-right": "unset",
            },
            code: {
              backgroundColor: applyAlphaColor(colorForeground, .1),
              color: "#DD1144", /* red */
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
              color: "var(--color-theo-blue)",
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
