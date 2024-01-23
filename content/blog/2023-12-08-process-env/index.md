---
title: Reading a process’ environment variables
tags:
  - til
  - linux
---

Everything is a file in Linux, including information about processes. Environment variables of a given process are also stored in a file: `/proc/[pid]/environ`.

However, it’s not _really_ readable.

```shellsession
$ sudo cat /proc/1527/environ
LANG=en_US.UTF-8PATH=/nix/store/bblyj5b3ii8n6v4ra0nb37cmi3lf8rz9-coreutils-9.3/bin:/nix/store/l974pi8a5yqjrjlzmg6apk0jwjv81yqw-findutils-4.9.0/bin:/nix/store/rx2wig5yhpbwhnqxdy4z7qivj9ln7fab-gnugrep-3.11/bin:/nix/store/9c5qm297qnvwcf7j0gm01qrslbiqz8rs-gnused-4.9/bin:/nix/store/7m5h0x27pxshl91v2wywfv209ajjrrm4-systemd-254.3/bin:/nix/store/bblyj5b3ii8n6v4ra0nb37cmi3lf8rz9-coreutils-9.3/sbin:/nix/store/l974pi8a5yqjrjlzmg6apk0jwjv81yqw-findutils-4.9.0/sbin:/nix/store/rx2wig5yhpbwhnqxdy4z7qivj9ln7fab-gnugrep-3.11/sbin:/nix/store/9c5qm297qnvwcf7j0gm01qrslbiqz8rs-gnused-4.9/sbin:/nix/store/7m5h0x27pxshl91v2wywfv209ajjrrm4-systemd-254.3/sbinNOTIFY_SOCKET=/run/systemd/notifyFDSTORE=512WATCHDOG_PID=1527WATCHDOG_USEC=180000000INVOCATION_ID=d1a3aa586c8d46bc890714a46c782e15JOURNAL_STREAM=8:4447RUNTIME_DIRECTORY=/run/systemd/inhibit:/run/systemd/seats:/run/systemd/sessions:/run/systemd/shutdown:/run/systemd/usersSTATE_DIRECTORY=/var/lib/systemd/lingerSYSTEMD_EXEC_PID=1527MEMORY_PRESSURE_WATCH=/sys/fs/cgroup/system.slice/systemd-logind.service/memory.pressure
```

It’s missing the newlines! To make the newlines show up correctly, use `xargs`.

```shellsession
$ sudo cat /proc/1527/environ | xargs --null --max-args=1 echo
NOTIFY_SOCKET=/run/systemd/notify
FDSTORE=512
WATCHDOG_PID=1527
WATCHDOG_USEC=180000000
INVOCATION_ID=d1a3aa586c8d46bc890714a46c782e15
JOURNAL_STREAM=8:4447
RUNTIME_DIRECTORY=/run/systemd/inhibit:/run/systemd/seats:/run/systemd/sessions:/run/systemd/shutdown:/run/systemd/users
STATE_DIRECTORY=/var/lib/systemd/linger
SYSTEMD_EXEC_PID=1527
MEMORY_PRESSURE_WATCH=/sys/fs/cgroup/system.slice/systemd-logind.service/memory.pressure
MEMORY_PRESSURE_WRITE=c29tZSAyMDAwMDAgMjAwMDAwMAA=
LOCALE_ARCHIVE=/nix/store/fiyrsa2vgznb057f3w8lwcfzhqdq0igi-glibc-locales-2.38-27/lib/locale/locale-archive
TZDIR=/nix/store/3vx4ajfr2gy3zbl803frpabh4n85cacp-tzdata-2023c/share/zoneinfo
```

