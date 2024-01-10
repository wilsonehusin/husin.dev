hugo-dev:
  rm -rf public/*
  hugo server --bind 0.0.0.0 --renderToDisk --templateMetrics --templateMetricsHints

hugo-build: css-gen
  rm -rf public/*
  hugo --gc --minify

css-gen:
  pnpm tailwindcss -i assets/css/base.css -o assets/css/dist/style.css --minify

css-watch:
  pnpm tailwindcss -i assets/css/base.css -o assets/css/dist/style.css --watch
