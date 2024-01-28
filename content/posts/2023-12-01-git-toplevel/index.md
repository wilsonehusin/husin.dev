---
title: Finding Git repository top-level
tags:
  - til
  - git
description: >-
  Get the path to current repository's root directory from any inner folder.
---

```shell-session
$ pwd
/home/wilson/workspace/husin.dev/public

$ git rev-parse --show-toplevel
/home/wilson/workspace/husin.dev
```
