---
title: Affording maintenance cost
url: affording-maintenance-cost
publishDate: 2023-01-12T06:05:44Z
tags:
  - meta
  - management
description: >-
  A case study of two organizations managing dependency upgrades. One let it rot beyond end-of-life and the other proactively updates it.
---

Despite having a traditional background[^1] to the software industry, there are things I still had to learn on the job.
Sure, everyone had to learn about non-technical bits, like running effective 1:1 meetings or politely nagging a review from your coworker.
However, the technical side also had surprises in store for me.

[^1]: Formal education in computer-related studies.

## Case studies

Specifically in this post, I'm writing about scenarios relevant to software maintenance.
Computer programs are much like bicycles and cars --- you need to routinely perform services to keep it running safely.

Some drivers / cyclists are more disciplined than others and similarly, software practitioners share that same variance.

### Job A: too hard to do

My first job taught me the most about cost of negligence in a team owning a web application, built on top of a well-known framework.

Here is the interesting bit: it was using a framework released before I started college and still running in production.
The framework maintainers (major open-source project) deprecated that same version before I finished my first semester.

My reaction when I learned about it was roughly, "How are we getting away with this? Are we patching CVEs by paying insurance companies?"

"Close but not quite," said a colleague.
"We think most of them are irrelevant, then cherry-pick the fix and monkey-patch the rest."

This setup has strange implications too.
A big one is knowledge management / documentation:

- Upon searching online, one would find guides for newer versions of the framework, referring to nonexistent feature in our version.
- Some part of the monkey-patched code involves database ORM, which essentially means the behavior in official documentation isn't quite reflected in the product.[^2]
- Right before I left, the framework project took down the documentation page for the version we were using because it was long deprecated, which means developers are now running a local copy of documentation web server.

[^2]: Change introduces new forms of failure ([How Complex Systems Fail by Richard Cook](https://how.complexsystems.fail/#14)).

Through my tenure at that job, I asked around what people think is the reason that we did not keep a major dependency up-to-date.
The answers are varying colors of, "there is too much work to be done," which is unsatisfactory --- it would _not_ be too much if it were updated on time!

### Job B: minor turbulence

On a different job, an upgrade of web development framework happened while I was there.
The person championing the work to upgrade was interested in features of the new version, and thus they were incentivized to put in the work.

The upgrade was 1 major version bump and 1.5 years away from end-of-life.
The changeset was probably 20 files at most, small relative to the codebase.

So the team rolled out changes after hours.
They saw minor errors, quickly fixed it and redeploy.
Afterwards, the application seemed stable, so they called it done.

The next day, on-call engineers were up early from pager alarms.
I did not remember much of what happened as I was not on-call, but I remember the remedy was mostly the same hotfix that was done on roll out, just need to be applied to more files.
The organization's takeaway from the event was that they did not have enough coverage to detect those problems pre-deploy.

The whole effort took about a week, including the preparation all the way until application health normalized.

## Takeaway for today

I'm in a different spot compared to the two jobs mentioned above.
Being a part of the only engineering team (and the only team) in the company, there is a big pressure to prioritize ruthlessly.

I have not thought about Job A's situation in a while, as I have been fortunate enough where most teams I worked at are more similar to Job B.
Now I'm being reminded of it again.

I can now sympathize with the situation at Job A's when there are too many things to do to keep the business afloat.
At the same time, having experienced Job A, I feel constantly alert to not drift towards [normalization of deviance](https://danluu.com/wat/).

Job B's situation had turbulences, but it was quick and negligible in the grand scheme of things.
Building a proactive culture like Job B is what I would like to be.
It may tempting to say "we can't afford it today," and if that's truly the situation, then the agenda is working towards enabling it (i.e. make the hard thing easy, then do the easy thing).

In an oversimplified form, I keep this note at the back of my head: upgrading dependencies is like doing laundry --- do it while you can, not when you have to.
