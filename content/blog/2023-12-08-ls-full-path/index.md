---
title: Listing files / directories with full path of query
tags:
  - til
  - linux
---

Have you ever noticed that `ls` sometimes provides relative path, while other times uses full path?

```shell-session
$ ls ~/.config/nixpkgs
config.nix

$ ls ~/.config/nixpkgs/*  # append wildcard suffix
/home/wilson/.config/nixpkgs/config.nix
```

The program `ls` actually is unaware of the trailing `*` because the current shell expanded the operator then passed the list of files. From the perspective of `ls`, the two commands below are the same.

```shell-session
$ ls ~/.config/nixpkgs/*
/home/wilson/.config/nixpkgs/config.nix

$ ls ~/.config/nixpkgs/config.nix
/home/wilson/.config/nixpkgs/config.nix
```
