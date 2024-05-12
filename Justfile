new-post SLUG:
  hugo new posts/$(date +%Y-%m-%d)-{{SLUG}}/index.md

dev:
  #!/usr/bin/env bash
  set -eo pipefail

  just hugo-dev &
  just css-watch-v1 &

  wait

build: css-gen-v1 hugo-build

hugo-dev:
  rm -rf public/*
  hugo server --bind 0.0.0.0 --templateMetrics

hugo-build: css-gen-v1
  rm -rf public/*
  hugo --gc --minify

css-gen-v1:
  pnpm tailwindcss -i themes/v1/assets/css/base.css -o themes/v1/assets/css/dist.css --minify

css-watch-v1:
  pnpm tailwindcss -i themes/v1/assets/css/base.css -o themes/v1/assets/css/dist.css --watch
