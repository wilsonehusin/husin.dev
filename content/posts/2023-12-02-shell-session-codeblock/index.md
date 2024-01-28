---
title: Codeblocks for shell session
tags:
  - til
  - markdown
---

Technical documents often include outputs of shell script. For a while, I have been using the same language code `shell` for shell output, which usually returns incorrect syntax highlighting. The wrongness varies from parser-to-parser.

```shell
$ echo "this is not perfect"
"this is not perfect"
```

Turns out, codeblocks for `shell-session` is a thing!

```shell-session
$ echo "this is more accurate!"
"this is more accurate!"
```
