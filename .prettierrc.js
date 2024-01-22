module.exports = {
  plugins: ["prettier-plugin-go-template"],
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
