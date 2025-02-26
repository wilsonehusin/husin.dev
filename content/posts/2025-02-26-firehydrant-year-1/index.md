---
title: "FireHydrant the first year"
description: |
  Things I did in a year when I'm encouraged to pick things up and run with it.
tags:
  - meta
  - career
  - firehydrant
---

It’s my first year workversary at FireHydrant. It’s been a fun ride: learned a lot, shipped a lot, and made a lot of new friends. I’m glad to be here!

I was initially hired to work primarily on Signals, our on-call alerting offering. However, as folks who have worked with me would testify, I would get my hands on anything that is within my reach. And I did!

Here are some of the notable things I have led or contributed significantly, especially in architecture and product direction in chronological order.

## Signals migrator

Our on-call alerting product became generally available within my first month at the company. At that point, we have had people running our system in production for a while.

My first major assignment was: make it easy for people to adopt Signals.

So I built the obvious thing in the migrator: [generate FireHydrant Terraform configurations based on your existing setup](https://firehydrant.com/blog/speedrun-to-signals-automated-migrations-are-here/).

This project is also what inspired other two posts on this site:
- [Replacing complicated hashmaps with SQLite](/ephemeral-sqlite/), also on [Hacker News](https://news.ycombinator.com/item?id=39950979)
- [A comparative guide to generate Terraform / HCL](/terraform-hclwrite/)

## Custom payload / event sources

With that out of the way, comes the next big problem: it turns out that people _want_ to be paged from so many sources! We supported several major monitoring providers, but I got to learn so many more that our customers use.

How can we support ingesting payloads from various sources, without it being a linear cost to product development roadmap?

This was one of the most challenging projects I have done: we considered so many alternatives and went back to square one so many times. However, we learned a lot on every time we wipe the whiteboard and start a new direction, building on top of it all.

In this feature release, [we think the right number of providers to support is **infinity**](https://firehydrant.com/blog/byopayload-custom-event-sources-for-signals-have-landed/). Give us a JavaScript function, we’ll run it for you in our sandbox. Just promise us the function finishes before we terminate them.

## Call routing

Now that we support any kind of HTTP API, a new challenger appears: can I make a phone call to your on-call person directly?

I mean, I know we call it _on-call_ so it makes sense to, you know, [make phone calls](https://firehydrant.com/changelog/live-call-routing-and-more/).

## Support hours

A past job put me on a team whose customers are internal to the company, which were largely US-based. As such, our team then didn't have on-call duties, but we have "interrupt" duties: other parts of the organizations would ask our team questions to get support for internal infrastructure.

This feature is made for folks holding jobs like past me. Your duties may be more critical than the one I had during your shift, but [there is no point of paging on-call outside of those shifts (e.g. financial industry going on halt outside of trading hours)](https://firehydrant.com/changelog/team-support-hours-interactive-ios-and-apple-watch-notifications-new-api-documentation-and-better-error-logging/). You can still get notified, but you can choose to not be woken up by it.

## Alert grouping

Just last month, [we introduced the initial support for alert grouping](https://firehydrant.com/blog/introducing-alert-grouping-less-noise-more-signal/). This was a challenge to accomplish and design well in a time-sensitive critical system. We want to make sure that end users don’t miss any notifications, with the understanding that this feature’s value is when bursts come in short amount of time.

I think we did a pretty decent job to build the foundations for this feature if customer feedback is a good measure for a feature ship. More to come — stay tuned!

{{< callout class="briefcase" >}}
I wish I have more time to write more about what happens under the hood of these projects, as well as the many more smaller ones which didn't make it to the list. [Nerd-snipe me for a lunch or coffee](/) and maybe talking about them enough will make the writing part easier!
{{</ callout >}}
