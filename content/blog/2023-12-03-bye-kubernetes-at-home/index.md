---
title: Bye Kubernetes at home
tags:
  - kubernetes
  - containers
  - nix
  - linux
---

Having Kubernetes as a platform to deploy applications was a convenient escape hatch from managing my home server without having to understand Nix too much.

However, having learned more about Nix in the recent weeks, I am increasingly convinced that I would rather have Nix services with Nginx as reverse proxy.

Some familiar Kubernetes feature substitutes in NixOS:

- Ingress: NixOS has `services.nginx`, which is a [comprehensive module for Nginx with very sensible defaults](https://nixos.wiki/wiki/Nginx?ref=husin.dev).
- Cert Manager: NixOS leverages [go-acme/lego](https://github.com/go-acme/lego) to manage certificates at OS level in [`security.acme` module](https://nixos.org/manual/nixos/stable/options#opt-security.acme.certs).
- Persistent Volumes: if using systemd and ZFS, one may tell systemd to wait for ZFS volume to be ready (RequireMountsFor) before starting service.

I’ll level with you. There will be things I miss about Kubernetes. In fact, there are already some right now:

- Internal DNS (e.g. `git.apps.svc.cluster.local`) and virtual network means there is never a chance of port collision between applications. Instead, I will have to get used to output of `netstat -tunlp`.
- Cleanup of old apps is as simple as `kubectl delete pv`, whereas NixOS (systemd) may still leave crumbs in `/var/lib`.

They are balanced with the fact that I would not need to worry about Kubernetes problems again:

- “Successful” deployment only to find out it’s stuck on `ImagePullBackOff`.
- Unreadable output of `df` on host machine because it’s flooded with container overlays.

Jury is still out on how long this will last. Nonetheless, it’s an exciting new chapter for my homelab!

{{< callout >}}
This situation is incomparable to enterprise setups. Heck, I probably would stick with Kubernetes if I had multi-node cluster.
{{</ callout >}}
