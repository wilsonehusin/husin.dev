module.exports = {
  plugins: ["prettier-plugin-go-template", "prettier-plugin-tailwindcss"],
  overrides: [
    {
      files: "**/*.svg",
      options: { parser: "html" },
    },
    {
      files: ["*.html"],
      options: {
        parser: "go-template",
      },
    },
  ],
};
