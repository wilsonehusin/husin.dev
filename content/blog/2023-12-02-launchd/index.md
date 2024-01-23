---
title: "launchd: macOS daemon"
tags:
  - til
  - tools
  - mac
---

Equivalent (or subset) of `systemd` in Linux, but for Mac. Configured with `.plist` file in XML format. Specification can be found in the manual page:

```shell-session
$ man launchd.plist
```

[Apple’s support page points to the following directories](https://support.apple.com/guide/terminal/script-management-with-launchd-apdc6c1077b-5d5d-4d35-9c19-60f2397b2369/mac) for configurations:

| Folder                          | Usage                                                             |
| ------------------------------- | ----------------------------------------------------------------- |
| `/System/Library/LaunchDaemons` | Apple-supplied system daemons                                     |
| `/System/Library/LaunchAgents`  | Apple-supplied agents that apply to all users on a per-user basis |
| `/Library/LaunchDaemons`        | Third-party system daemons                                        |
| `/Library/LaunchAgents`         | Third-party agents that apply to all users on a per-user basis    |
| `~/Library/LaunchAgents`        | Third-party agents that apply only to the logged-in user          |

[Homebrew has an API to declare services related to a program](https://docs.brew.sh/Formula-Cookbook#service-files), which is likely the simplest way to manage installation of third-party manifests.
