---
title: Packaging Python application with poetry2nix
header:
  src: "header.png"
  alt: Output of Nix build on sample poetry2nix project.
aliases:
  - packaging-python-application-with-poetry2nix
tags:
  - nix
  - python
  - poetry
description: >-
  Demonstration and walkthrough of using poetry2nix to package a Python program in Nix without flakes.
---

Recently I found myself wanting to use a Python program in Nix, where the program itself manages its dependencies with Poetry. It’s a small and not actively maintained project, thus I would have to package it myself in Nix.

I’m simulating the hurdles I had to go through using a simple project for this exercise. Source code for Python program can be found in [wilsonehusin/hello-poetry2nix](https://github.com/wilsonehusin/hello-poetry2nix), while source code for Nix configurations can be found in [wilsonehusin/hello-poetry2nix-nix](https://github.com/wilsonehusin/hello-poetry2nix-nix).

## Building a simple program / happy path

Start by initializing `poetry2nix` in Nix configuration repository.

```shell-session
$ tree hello-poetry2nix
hello-poetry2nix/
├── default.nix
├── patches
│   └── hello-folks.patch
└── poetry2nix
    └── default.nix
```

```nix
# hello-poetry2nix/poetry2nix/default.nix
{ pkgs ? import <nixpkgs> { }
, ... }:

let
  src = pkgs.fetchFromGitHub {
    owner = "nix-community";
    repo = "poetry2nix";
    rev = "2023.12.111047";
    sha256 = "sha256-QSGP2J73HQ4gF5yh+MnClv2KUKzcpTmikdmV8ULfq2E=";
  };
in import src { inherit pkgs; }
```

{{< callout class="info" >}}

This _may_ be simpler with Nix Flakes, but I have not grok it fully that I decided to stick with what I can understand in plain Nix.

{{</ callout >}}

We can now use the `poetry2nix` definition from above in our build configuration.

```nix
# hello-poetry2nix/default.nix
{ pkgs ? import <nixpkgs> { }
, poetry2nix ? pkgs.callPackage ./poetry2nix { inherit pkgs; }
, ... }:

let
  name = "hello_poetry2nix";
  rev = "4431812218e1963fd34f4d9d22dcd688a4c33fb4";
  hash = "sha256-iHqzA/HJ+vb7O5vpGpA1eR3BcoGDPE2QOqQQpOp0zFQ=";

  src = pkgs.fetchFromGitHub {
    inherit rev hash;

    owner = "wilsonehusin";
    repo = "hello-poetry2nix";
  };
in poetry2nix.mkPoetryApplication {
  inherit name src;

  pname = name;
  version = rev;
  projectDir = src;
}
```

With that, we have a functioning build of our simple program in Nix.

```shell-session
$ nix-build hello-poetry2nix
/nix/store/c7fjdb0f6gj33lpk5akqkirjzamyjm9x-python3.11-hello_poetry2nix

$ /nix/store/c7fjdb0f6gj33lpk5akqkirjzamyjm9x-python3.11-hello_poetry2nix/bin/hello_poetry2nix
Hello poetry2nix!

$ /nix/store/c7fjdb0f6gj33lpk5akqkirjzamyjm9x-python3.11-hello_poetry2nix/bin/hello_poetry2nix --name readers
Hello readers!
```

## Failing to build dependencies

Sometimes, builds may fail because `poetry2nix` does not know how to build a given Python dependency. For example, the sample Python program added [`comtypes`](https://pypi.org/project/comtypes/) as a dependency in [dc017559ca0d7](https://github.com/wilsonehusin/hello-poetry2nix/commit/dc017559ca0d728b11a157e96278d224a7a5f26c).

{{< callout >}}
The Python program actually does not use `comtypes` at all in runtime — only declared as a dependency in `pyproject.toml`. In fact, `comtypes` is only relevant for Windows!

And yet, this is the reality of packaging Python programs in the wild.
{{</ callout >}}

To see how it fails, let’s update the Git revision referenced in the Nix build configuration.

```nix
# hello-poetry2nix/default.nix
{ pkgs ? import <nixpkgs> { }
, poetry2nix ? pkgs.callPackage ./poetry2nix { inherit pkgs; }
, ... }:

let
  name = "hello_poetry2nix";
  rev = "dc017559ca0d728b11a157e96278d224a7a5f26c";
  hash = "sha256-mkOUUkuaA3z5zHECXlmcIk7sjGGmdbZyju180KviHw8=";

# ...
```

Upon running `nix-build`, we now encounter a build failure.

```shell-session
$ nix-build hello-poetry2nix
these 3 derivations will be built:
  /nix/store/qsziza7lhal2rz85ny6dl58is7qav2jz-comtypes-1.2.0.zip.drv
  /nix/store/xl6iyv117ibnc6ixsy9wl5h37jiqv122-python3.11-comtypes-1.2.0.drv
  /nix/store/iy2gplf21yp2zb9ygqn06kik2qfgp5pg-python3.11-hello_poetry2nix.drv

  # ...

Creating a wheel...
WARNING: The directory '/homeless-shelter/.cache/pip' or its parent directory is not owned or is not writable by the current user. The cache has been disabled. Check the permissions and owner of that directory. If executing pip with sudo, you should use sudo's -H flag.
Processing /build/comtypes-1.2.0
  Running command Preparing metadata (pyproject.toml)
  Preparing metadata (pyproject.toml) ... done
ERROR: Exception:
Traceback (most recent call last):

  # ...

  File "<frozen importlib._bootstrap>", line 1204, in _gcd_import
  File "<frozen importlib._bootstrap>", line 1176, in _find_and_load
  File "<frozen importlib._bootstrap>", line 1140, in _find_and_load_unlocked
ModuleNotFoundError: No module named 'setuptools'


copying 1 paths...
error: path '/nix/store/zcx3xzsncm61pcyjkfhdd43n968jrhw6-python3.11-comtypes-1.2.0' is not valid
error: builder for '/nix/store/xl6iyv117ibnc6ixsy9wl5h37jiqv122-python3.11-comtypes-1.2.0.drv' failed with exit code 1
error: 1 dependencies of derivation '/nix/store/iy2gplf21yp2zb9ygqn06kik2qfgp5pg-python3.11-hello_poetry2nix.drv' failed to build
```

This error is a documented problem in [nix-community/poetry2nix documentation on edge cases](https://github.com/nix-community/poetry2nix/blob/master/docs/edgecases.md?ref=husin.dev), but the error message somehow does not point to it.

To fix the error, we need to tell `poetry2nix` how to build the dependency:

```nix
# hello-poetry2nix/default.nix

# ...
in poetry2nix.mkPoetryApplication {
  inherit name src;

  pname = name;
  version = rev;
  projectDir = src;
  overrides = poetry2nix.defaultPoetryOverrides.extend
    (self: super: {
      comtypes = super.comtypes.overridePythonAttrs
      (
        old: {
          buildInputs = (old.buildInputs or [ ]) ++ [ super.setuptools ];
        }
      );
    });
}
```

And then, all is good again.

```shell-session
$ nix-build hello-poetry2nix
/nix/store/cnvbm7w8fffqb9fhmwwdgwpw43avl2rg-python3.11-hello_poetry2nix

$ /nix/store/cnvbm7w8fffqb9fhmwwdgwpw43avl2rg-python3.11-hello_poetry2nix/bin/hello_poetry2nix
Hello poetry2nix!
```

## Patching source

Good news, patching happens to be a simple matter like a typical Nix packaging.

```patch
# hello-poetry2nix/patches/hello-folks.patch
diff --git a/hello_poetry2nix/__init__.py b/hello_poetry2nix/__init__.py
index 0310c44..ee9717f 100644
--- a/hello_poetry2nix/__init__.py
+++ b/hello_poetry2nix/__init__.py
@@ -1,6 +1,6 @@
 import fire

-def hello(name="poetry2nix"):
+def hello(name="folks"):
     return "Hello %s!" % name

 def main():
```

```nix
# hello-poetry2nix/default.nix
# ...

in poetry2nix.mkPoetryApplication {
  inherit name src;

  patches = [ ./patches/hello-folks.patch ];

  pname = name;
  version = rev;
  projectDir = src;
  overrides = poetry2nix.defaultPoetryOverrides.extend

# ...
```

```shell-session
$ nix-build hello-poetry2nix
/nix/store/l47ai8n88np1cj5629kr15dsxb2p2zyw-python3.11-hello_poetry2nix

$ /nix/store/l47ai8n88np1cj5629kr15dsxb2p2zyw-python3.11-hello_poetry2nix/bin/hello_poetry2nix
Hello folks!
```
