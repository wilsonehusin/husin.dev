---
title: Listing all groups in Linux
tags:
  - til
  - linux
---

All groups which exists in Linux can be found in `/etc/group`.

```shell-session
$ cat /etc/group
root:x:0:
wheel:x:1:wilson
kmem:x:2:
tty:x:3:
messagebus:x:4:
disk:x:6:
audio:x:17:
 ...
nogroup:x:65534:
```

To list the groups of which current user is member of, use `groups` command.

```shell-session
$ groups
users wheel networkmanager podman
```
