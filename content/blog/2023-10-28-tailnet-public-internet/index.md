---
title: Exposing tailnet to public internet
aliases:
  - exposing-tailnet-to-public-internet
tags:
  - tailscale
description: >-
  Tailscale creates a private network for all your devices. Sometimes, you may want to selectively expose some endpoint on your private network to the public internet, like I do here. Alternative title: DIY Tailscale Funnel with Nginx.
---

My home cluster has Tailscale running on the node while Kubernetes Ingress only listens to the Tailscale IP. In other words, services which I have deployed on my home cluster are only accessible through my Tailnet.

{{< callout >}}
Tailnet is a private network for the given Tailscale account. Devices within the same tailnet can reach each other "as if they are within the same network". Like a LAN party, but over the internet!
{{</ callout >}}

I have been holding back on shaving some yaks of "CI system with access to my tailnet" because setting up Tailscale access from GitHub-managed CI system ~~doesn't sound like a very smart idea~~ (future Wilson here -- I learned that perhaps it's as bad as I thought since [Tailscale supports this use case](https://github.com/tailscale/github-action)). Having CI system within my cluster (thus my tailnet) makes those ideas a whole lot more actionable.

_"Okay cool story, but what does a CI system have to do with this?"_ Yeah that's what I thought too, until I realize that for CI providers to be _aware_ of new commits on GitHub, it wants to be notified by GitHub about events such as new commits.

In other words, GitHub needs to be able to reach my CI system webhook endpoint, which is not publicly accessible.

## Using reverse proxy

Borrowing a similar technique employed in private cloud networks, I created a [jump box](https://en.wikipedia.org/wiki/Jump_server) which is accessible from public internet and has access to my tailnet. My tailnet remains private to the rest of internet, but the jump box can access it.

As such, I created a [Fly.io](https://fly.io) application running Tailscale and Nginx as reverse proxy. [Tailscale has a helpful guide on how to set up an instance on Fly.io](https://tailscale.com/kb/1132/flydotio/).

I configured Nginx to essentially deny all traffic, but forwards requests for specific requests which resembles an authentic webhook from GitHub.

```nginx
location / {
  deny all;
}

location = /hook {
  add_header 'Host' 'ci.myhomecluster.net';
  proxy_pass 'https://ci.myhomecluster.net';
}
```

Lucky for me, the CI system ([Woodpecker CI](https://woodpecker-ci.org)) has a configuration for separating the server host and the webhook host by setting `WOODPECKER_WEBHOOK_HOST` variable.

## Alternatives

Before you decide to replicate this setup, I would encourage you to consider other easier alternative solutions. I resorted to my solution because my setup is not quite the blessed path, thus I was on my own to resolve it.

### Tailscale Funnel

> Tailscale Funnel is a feature that allows you to route traffic from the wider internet to one or more of your Tailscale nodes. You can think of this as publicly sharing a node for anyone to access, even if they don’t have Tailscale themselves.
>
> [Source](https://tailscale.com/kb/1223/tailscale-funnel/)

Technically, this is exactly what I want! However, Tailscale funnel would have an understanding of 1 domain name per node in the tailnet. This does not fit my deployment model where my cluster node, as far as Tailscale is aware of, is just 1 node with 1 IP address. The traffic to applications within the cluster is determined by HTTP `Host` header.

### Deploy it on cloud

If you got here from deploying something less critical than CI system, deploying it on the cloud may be the easier option. My homelab-brain tries to minimize my cloud usage these days, but sometimes the easier thing to do is being pragmatic on case-by-case basis.
