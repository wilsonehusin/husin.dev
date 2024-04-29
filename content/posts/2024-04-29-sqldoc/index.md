---
title: 'SQLDoc: generate database schema documentation'
description: |
  Stop digging in your migrations and get the current database state written in markdown.
header:
  src: "header.png"
  alt: "SQLDoc console preview, showing an example table schema in markdown format on terminal console."
tags:
  - golang
  - sql
  - postgres
---

Despite the many programming languages and frameworks I have used, I think [Ruby on Rails](http://rubyonrails.org) really nailed it for their database integrations. Specifically, I find it incredibly helpful in development loop to find out the database schema from within my editor by fuzzy-searching `db/schema.rb`. One step further to that is annotation on the models file, using something like [drwl/annotaterb](https://github.com/drwl/annotaterb).

I miss that feature when I'm developing something not-Rails. The majority of time I spent programming these days are in Go, which is usually paired with [sqlc](https://sqlc.dev) and [golang-migrate](https://github.com/golang-migrate/migrate).

In early projects, migrations are still simple that `CREATE TABLE` declarations is close enough with current state. It becomes harder with every `ALTER TABLE` statements, though.

In small projects, sqlc's generated structs within `models.go` would be sufficient. However, it's still difficult to find something beyond field types, such as default values and constraints.

So I did something about it: I wrote a documentation generator called [SQLDoc](https://github.com/wilsonehusin/sqldoc).  It's very early! Like, I hacked it over 2-3 hours kind of "early".

![Screencast of SQLDoc in action from terminal console](sqldoc-demo.gif)

I plan to continue working on this project. It's useful to fix my immediate needs, but I would love to have it be as informative, if not more, than `psql -c '\d+ table_name'`.

Please check it out and let me know what you think!
