---
title: What's running in my cluster? (Ep. 1)
aliases:
  - whats-in-my-cluster-ep-1
tags:
  - nix
  - kubernetes
  - homelab
---

Earlier this year, I converted an existing gaming computer into a small homelab cluster to be a personal server. I consider this journey to be a quest on incorporating better quality software in organizing my digital archives.

In some ways, I find the ability to easily justify this decision as a perk of being a software engineer by trade, especially when complemented with battle scars from previous employers, but I digress.

## I. The foundation

My utilization of Linux has decreased over the years and the biggest dip was when I acquired M1 MacBook Air. I don't have any desire to completely remove Linux out of my development workflow, but with the reduced utilization it's hard to keep track of what state the machine is in.

As such, I found [NixOS](https://nixos.org) to be incredibly helpful to make my Linux machines _just work_. It takes quite a bit of learning curve to get used to, but once set up it's quite pleasant. I would not claim that I am well versed in it, but I know enough to benefit from it.

{{< callout class="server" >}}
This is the 3rd iteration of cluster foundation that I have made with this hardware. TrueNAS was once the platform I had chosen, but I encountered problems trying to manage their embedded Kubernetes setup that I decided to just go barebones and self-manage everything.
{{</ callout >}}

I surrendered to running [Kubernetes](https://kubernetes.io) as primary application orchestrator. I considered going without Kubernetes, but other options requires me to duct tape some homegrown implementation of what Kubernetes provides through convention, such as private IP address allocation and port forwarding.

> Kubernetes provides a set of abstractions that solve a common set of problems. As people build understanding and skills around those problems they are more productive in more situations.
>
> — Joe Beda (source)

For primary storage, I acquired 2x 18TB disks on discount when I committed to building this server. From everything that I have considered, seems that using [ZFS](https://openzfs.github.io/openzfs-docs/) pool is a tried and true solution so that was a (thankfully) boring choice.

On top of the ZFS pool, I have [Garage Object Storage](https://garagehq.deuxfleurs.fr) running on NixOS directly. This is the primary storage mechanism for all the applications I run in the cluster.

Lastly, I have [Tailscale](https://tailscale.com) running on NixOS. I don't think about it too much and if it weren't for SSH re-authentication, I would forget that Tailscale is running. So uneventful, which makes it awesome.

## II. The applications

The foundation was thoughtfully crafted such that I can have some degree of consistency in deploying my applications, specifically about backup strategy that is abstracted away from application deployment setup.

More specifically, I don't want to think about "database server operations", such as backups and upgrades, without a paycheck to look forward to.

As such, I limited my options of database to SQLite with [Litestream](https://litestream.io) to support disaster recovery, leaving nearly 0 operational cost. I pretty much set it up according to [their tutorial](https://litestream.io/guides/docker/) by embedding Litestream binary to the application container and set the replication destination to Garage via S3 API.

### HedgeDoc

[HedgeDoc](https://hedgedoc.org) is a Markdown text editor and renderer. This is primary notepad, especially for technical documents. I have tried using Notion or Focalboard, but looks like the plain Markdown approach is actually a feature to keep my focus on writing

### Memos

[Memos](https://usememos.com) is a note-taking application with sharing and timeline feature. I practically use this to collect interesting things I found over the internet, usually news that I may want to make references in the future or some resources for a future project.

## III. What's next

My application library is still fairly small at the moment, since this is the 3rd iteration of the foundation since I set up the hardware. I am still in the lookout for other software solutions that would replace my usage of some online services.

### Cloud storage (e.g. Google Drive, iCloud Drive)

I am still looking for an application which provides cloud storage UI with S3 as primary backend. Some options that I have considered could not play along with my restrictions to minimize operational cost (e.g. ownCloud).

### Photo backup

This may or may not be the same solution as _Cloud storage_ section above, but I would like to have seamless photo backup system from iPhone / Android.

### Personal finance accounting

I would like to consolidate the several spreadsheets I have into a single source of truth. This solution may just be a spreadsheet application, but I have not ruled out that an existing domain-specific application exists that fits my needs.
