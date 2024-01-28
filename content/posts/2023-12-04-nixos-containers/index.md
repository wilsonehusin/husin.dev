---
title: Running container services in NixOS
tags:
  - til
  - nix
  - containers
---

NixOS provides a wrapper to simplify running containers as systemd services using [`virtualisation.oci-containers.containers.*`](https://nixos.wiki/wiki/Podman#Run_Podman_containers_as_systemd_services)

```nix
{
  virtualisation.oci-containers.backend = "podman";
  virtualisation.oci-containers.containers = {
    container-name = {
      image = "container-image";
      autoStart = true;
      ports = [ "127.0.0.1:1234:1234" ];
    };
  };
}
```
