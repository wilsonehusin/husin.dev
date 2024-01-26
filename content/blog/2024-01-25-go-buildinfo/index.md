---
title: Stop stamping commit info in Go projects
tags:
  - go
description: >-
  Go comes with standard library features to inspect build properties. Use `debug.ReadBuildInfo`.
---

Starting Go 1.18, the function [`ReadBuildInfo` from `runtime/debug`](https://pkg.go.dev/runtime/debug#ReadBuildInfo) can be used to retrieve the build information of the current program, including version control revision.

```go
bi, ok := debug.ReadBuildInfo()
if !ok {
  panic("cannot retrieve buildinfo. is go go-ing?")
}

for _, i := range bi.Settings {
  if i.Key == "vcs.revision"{
    fmt.Println(i.Value)
  }
}
```

## Why?

Providing the exact commit revision to end-user can be valuable for them to read the source code if they need to investigate something.

This provides stronger guarantee of accuracy than stamping arbitrary value through flags, which is rather error prone. It also makes the project builds reproducible (more easily) by other people.

## Caveat: `go run`

When using `go run` command, `debug.ReadBuildInfo` does not come with version control setting. Don’t be alarmed if you’re only testing this out, try and see if it works with `go build` and then executing the binary directly.

```shell-session
$ go run .



$ go build -o bin/bi . && ./bin/bi
2024-01-26T04:39:04Z
6ac24eb9e32d7b6ece44869f427a766c99f2542c
```

## Sample

Sample implementation can be found in [wilsonehusin/go-buildinfo-demo](https://github.com/wilsonehusin/go-buildinfo-demo).
