---
title: "Linux laptop: suspend vs hibernate"
tags:
  - til
  - linux
  - nix
---

Apparently the two mean different things. From [Arch Linux Wiki](https://wiki.archlinux.org/title/Power_management/Suspend_and_hibernate):

> **Suspend to RAM (aka suspend, aka sleep)**
> The **S3** sleeping state as defined by ACPI. Works by cutting off power to most parts of the machine aside from the RAM, which is required to restore the machine's state. Because of the large power savings, it is advisable for laptops to automatically enter this mode when the computer is running on batteries and the lid is closed (or the user is inactive for some time).

> **Suspend to disk (aka hibernate)**
> The **S4** sleeping state as defined by ACPI. Saves the machine's state into **[swap space](https://wiki.archlinux.org/title/Swap_space)** and completely powers off the machine. When the machine is powered on, the state is restored. Until then, there is **[zero](https://en.wikipedia.org/wiki/Standby_power)** power consumption.

It seems like running Linux on laptops should always have swap space, even if one does not need swap for the usual reasons (i.e. have enough RAM).

[NixOS seem to have a preset for laptops](https://nixos.wiki/wiki/Laptop), but some people have reported possibly incomplete setups as well:

- [Hibernate doesn't work anymore](https://discourse.nixos.org/t/hibernate-doesnt-work-anymore/24673)
- [Is it possible to hibernate with swap-file?](https://discourse.nixos.org/t/is-it-possible-to-hibernate-with-swap-file/2852)

