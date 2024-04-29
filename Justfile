new-post SLUG:
  hugo new posts/$(date +%Y-%m-%d)-{{SLUG}}/index.md

dev:
  #!/usr/bin/env bash
  set -eo pipefail

  just hugo-dev &
  just css-watch &

  wait

build: css-gen hugo-build

hugo-dev:
  rm -rf public/*
  hugo server --bind 0.0.0.0 --templateMetrics

hugo-build: css-gen
  rm -rf public/*
  hugo --gc --minify

css-gen:
  pnpm tailwindcss -i assets/css/base.css -o assets/css/dist.css --minify

css-watch:
  pnpm tailwindcss -i assets/css/base.css -o assets/css/dist.css --watch
