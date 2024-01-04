hugo-dev:
  hugo server --bind 0.0.0.0

hugo-build: css-gen
  hugo

css-gen:
  tailwindcss -i assets/css/base.css -o assets/css/style.css --minify

css-watch:
  tailwindcss -i assets/css/base.css -o assets/css/style.css --watch
