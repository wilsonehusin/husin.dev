---
title: Partially removing modules from NixOS
description: A technique I needed to redefine / overwrite a service configuration which was defined upstream.
tags:
  - nix
  - til
---

I use [OAuth2 Proxy](https://oauth2-proxy.github.io/oauth2-proxy/) in my home cluster, which runs [NixOS](https://nixos.org). My update policy for this cluster is, quite literally, best effort when ~~the vibes feel like it~~ I remember to.

Recently, a change was introduced upstream in [nixos/nixpkgs](https://github.com/nixos/nixpkgs), where the OAuth2 Proxy integration with Nginx had [a regression for my use case of forwarding authorization header as ￼`X-User`￼ and ￼`X-Email`￼](https://github.com/NixOS/nixpkgs/issues/305266).

This problem was preventing me from using my Grafana instance, since I have it configured to [use proxy authentication](https://grafana.com/docs/grafana/latest/setup-grafana/configure-security/configure-authentication/auth-proxy/).

So now I'm stuck in a situation where I _want_ to stay updated upstream for _everything_, except for OAuth2 Proxy Nginx integration. Simply redefining the options will end up with a complaint from Nix, as it won’t accept overwrite as is.

And then I learned about a new option: `disabledModules`. As the name states, it tells NixOS to not use certain paths from derivations.

To accomplish a “working setup” I pretty much have to copy over [the service configuration prior to recent changes](https://github.com/NixOS/nixpkgs/blob/2e751c0772b9d48ff6923569adfa661b030ab6a2/nixos/modules/services/security/oauth2_proxy_nginx.nix), then mark the upstream path as disabled.

```nix
{
  disabledModules = [ "services/security/oauth2_proxy_nginx.nix" ];
  
  # The rest of this file is copied from 2e751c077 of nixos/nixpkgs
  # under nixos/modules/services/security/oauth2_proxy_nginx.nix
  options.services.oauth2_proxy.nginx = {
    proxy = {
  # ...
}
```

Afterwards, make sure to import the file above as `imports` from the `configuration.nix` (or its import tree).
