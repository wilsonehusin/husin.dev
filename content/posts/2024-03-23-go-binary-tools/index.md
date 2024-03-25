---
title: Using Go toolchain to manage binary dependencies
tags:
  - golang
description: >-
  Go modules can be used to define dependencies. Not only importable libraries, but also executables for development workflows.
---

With Go modules being de facto dependency manager for a while now, we can use its feature to define versions of tools which are not directly imported as libraries in our source code. The bite-sized tips below are sorted from official recommendations to personal opinions.

## The baseline

Go modules documentation to this day still [recommends one approach using `tools.go`](https://go.dev/wiki/Modules#how-can-i-track-tool-dependencies-for-a-module). In short, create a `tools.go` file within your repository where `go.mod` exists importing the desired package, then tell Go to exclude this file in build using tag.

```go
//go:build tools
package main

import _ "golang.org/x/tools/cmd/stringer"
```

Breaking down the file above:

1. `//go:build tools` tells Go to exclude the file in build process, unless `-tags tools` is provided.
1. Prefixing import path with `_` tells Go to import the package (i.e. run its `init()` function), but don't make the package methods accessible within the file. This is also why `go fmt` would not remove the line, because technically it's not unused import.
1. Because the import path is still a valid import per usual, `go mod tidy` will take into account its version.

Now, when running `go [run|install] golang.org/x/tools/cmd/stringer` on shell within the module directory, Go will honor the version described in `go.mod`.

## Separating import versions

If you are in complex Go projects, you may encounter differing versions required by binary dependencies and imports in your source code. Common occurrences of this problem can be seen somewhat commonly with projects which implicitly imports Protobuf, gRPC, or OpenTelemetry.

As such, you may want to separate the `go.mod` used by binary dependencies and its source code. I like to put them in an entirely separate directory.

```shell-session
$ ls
_tools go.mod go.sum ...

$ ls _tools
go.mod go.sum tools.go
```

Upon installation of the binaries, one can either change their active directory to `_tools/` or use `-modfile=_tools/go.mod`.

```shell-session
$ go install -modfile=_tools/go.mod golang.org/x/tools/cmd/stringer
```

Using the same principle, if two binary tools happen to have dependency conflict, then they can be separated in their own `go.mod`.

```shell-session
$ ls _tools/*
_tools/stringer:
go.mod go.sum tools.go

_tools/sqlc:
go.mod go.sum tools.go
```

If this looks tedious, the project [bingo](https://github.com/bwplotka/bingo) attempts to establish a convention on this approach. I have not personally used it, but the concept looks sound.

## Installing everything as declared

Now your `tools.go` may have many items listed in it. Where Go team's recommendation falls short, in my opinion, is that you still need to remember what tools are declared in each file, then issue the `go install` command one-by-one.

I have not found an easy solution to this, but we can stitch together something.

```shell-session
$ cat ./tools.go
//go:build tools
package main

import (
  _ "github.com/sqlc-dev/sqlc/cmd/sqlc"
  _ "golang.org/x/tools/cmd/stringer"
)

$ go list -e -f "{{range .Imports}}{{.}} {{end}}" ./tools.go
golang.org/x/tools/cmd/stringer github.com/sqlc-dev/sqlc/cmd/sqlc
```

With some bash, we can get something close to "give me all dependencies required for this project"

```bash
#!/usr/bin/env bash

set -euo pipefail

tools=$(go list -e -f "{{range .Imports}}{{.}} {{end}}" ./tools.go)
for tool in $tools; do
  go install "${tool}"
done
```

## Installing to in-repository directory

Different projects may use different versions of dependency. By default, `go install` will install to `$GOBIN` if defined, otherwise `$GOPATH/bin` (usually `~/go/bin` unless modified). This can be annoying when working on several projects with differing versions of the same tool, as Go will keep overwriting the existing version on every install.

As such, I generally follow the convention of creating `bin/` folder within code repository root, then adding it to `.gitignore`. Additionally, I would add said folder to my `$PATH`, preferably using [direnv](https://direnv.net) with `PATH_add bin` function in `.envrc`.

To make `go install` output be local, I would override the `$GOBIN` variable during installation.

```diff
  #!/usr/bin/env bash
  
  set -euo pipefail
+
+ export GOBIN=$PWD/bin
  
  tools=$(go list -e -f "{{range .Imports}}{{.}} {{end}}" ./tools.go)
  for tool in $tools; do
    go install "${tool}"
  done
```
