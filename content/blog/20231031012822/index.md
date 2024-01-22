---
title: Execute a command as another user with `pkexec`
url: pkexec
publishDate: 2023-10-31
aliases:
  - til-pkexec-execute-a-command-as-another-user
tags:
  - til
  - linux
description: >-
  In the absence of `sudo`, `pkexec` is an alternate mechanism to gain privileges of another user, including root.
---

From the Linux man page:

> **pkexec** allows an authorized user to execute PROGRAM as another user. If username is not specified, then the program will be executed as the administrative super user, root.

When running uninstall on my Steam Deck via `sudo pacman -Rs [program]` (see Arch Linux wiki for reference), I somehow uninstalled `sudo`. As non-root user, I need root privileges to reinstall `sudo` via `sudo pacman -Suy sudo`. Except the command `sudo` no longer exists.

I recovered the situation by running `pkexec pacman -Suy sudo` and `sudo` is now back.
