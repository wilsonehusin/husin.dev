const defaults = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./themes/v1/layouts/**/*.html",
    "./themes/v1/assets/css/chroma.css",
    "./themes/v1/assets/css/base.css",
    "./assets/js/*.js",
    "./assets/icon/*.svg",
  ],
  safelist: ["tag-*"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Gruvbox
        "bg-harder": "var(--bg-harder)",
        "bg-hard": "var(--bg-hard)",
        "bg-soft": "var(--bg-soft)",
        bg0: "var(--bg0)",
        bg1: "var(--bg1)",
        bg2: "var(--bg2)",
        bg3: "var(--bg3)",
        bg4: "var(--bg4)",

        fg0: "var(--fg0)",
        fg1: "var(--fg1)",
        fg2: "var(--fg2)",
        fg3: "var(--fg3)",
        fg4: "var(--fg4)",

        red: "var(--red)",
        green: "var(--green)",
        yellow: "var(--yellow)",
        blue: "var(--blue)",
        purple: "var(--purple)",
        aqua: "var(--aqua)",
        orange: "var(--orange)",
        gray: "var(--gray)",

        "red-dim": "var(--red-dim)",
        "green-dim": "var(--green-dim)",
        "yellow-dim": "var(--yellow-dim)",
        "blue-dim": "var(--blue-dim)",
        "purple-dim": "var(--purple-dim)",
        "aqua-dim": "var(--aqua-dim)",
        "orange-dim": "var(--orange-dim)",
        "gray-dim": "var(--gray-dim)",
      },
      fontSize: {
        xs: "var(--step--2)",
        sm: "var(--step--1)",
        base: "var(--step-0)",
        lg: "var(--step-1)",
        xl: "var(--step-2)",
        "2xl": "var(--step-3)",
        "3xl": "var(--step-4)",
        "4xl": "var(--step-5)",
        "5xl": "var(--step-6)",
        "6xl": "var(--step-7)",
        "7xl": "var(--step-8)",
      },
      fontFamily: {
        // modernfontstacks.com: Neo-Grotesque
        sans: ["InterVariable", "Inter", defaults.fontFamily.sans],
        // modernfontstacks.com: Industrial
        industrial: [
          "Bahnschrift",
          '"DIN Alternate"',
          '"Franklin Gothic Medium"',
          '"Nimbus Sans Narrow"',
          "sans-serif-condensed",
          "sans-serif",
        ],
        mono: ["'Victor Mono Variable'", defaults.fontFamily.mono],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            // Colors
            "--tw-prose-body": "var(--fg2)",
            "--tw-prose-headings": "var(--fg1)",
            "--tw-prose-links": "var(--orange)",
            "--tw-prose-bold": "var(--fg1)",
            "--tw-prose-counters": "var(--yellow)",
            "--tw-prose-bullets": "var(--yellow)",
            "--tw-prose-hr": "var(--yellow-dim)",
            "--tw-prose-quotes": "var(--fg3)",
            "--tw-prose-quote-borders": "var(--yellow-dim)",
            "--tw-prose-captions": "var(--fg4)",
            "--tw-prose-code": "var(--orange)",
            "--tw-prose-pre-code": "var(--fg3)",
            "--tw-prose-pre-bg": "var(--bg-hard)",
            "--tw-prose-th-borders": "var(--yellow-dim)",
            "--tw-prose-td-borders": "var(--bg3)",
            "--tw-prose-invert-body": "var(--tw-prose-body)",
            "--tw-prose-invert-headings": "var(--tw-prose-headings)",
            "--tw-prose-invert-links": "var(--tw-prose-links)",
            "--tw-prose-invert-bold": "var(--tw-prose-bold)",
            "--tw-prose-invert-counters": "var(--tw-prose-counters)",
            "--tw-prose-invert-bullets": "var(--tw-prose-bullets)",
            "--tw-prose-invert-hr": "var(--tw-prose-hr)",
            "--tw-prose-invert-quotes": "var(--tw-prose-quotes)",
            "--tw-prose-invert-quote-borders": "var(--tw-prose-quote-borders)",
            "--tw-prose-invert-captions": "var(--tw-prose-captions)",
            "--tw-prose-invert-code": "var(--tw-prose-code)",
            "--tw-prose-invert-pre-code": "var(--tw-prose-pre-code)",
            "--tw-prose-invert-pre-bg": "var(--tw-prose-pre-bg)",
            "--tw-prose-invert-th-borders": "var(--tw-prose-th-borders)",
            "--tw-prose-invert-td-borders": "var(--tw-prose-td-borders)",

            // Remove blockquotes quote wrapping.
            "blockquote p:first-of-type::before": false,
            "blockquote p:first-of-type::after": false,
            "blockquote p": { fontWeight: "normal" },
            code: { fontWeight: "700" },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
