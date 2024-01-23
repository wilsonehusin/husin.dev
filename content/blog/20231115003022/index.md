---
title: Building containers in Nix, the sinful way
url: nix-container-sinful
publishDate: 2023-11-15
header:
  src: "header.png"
  alt: Snippet of typical output when building containers with Docker Buildx plugin.
aliases:
  - building-container-with-nix-the-sinful-way
tags:
  - nix
  - linux
  - containers
description: >-
  How to build a container while using Nix without using Nix. Expect sharp edges around.
---

While there are blessed paths to build containers with Nix tooling, Nix comes with store paths which we can take advantage of in building containers. For the record, I never claim this to be a good idea.

## Crash course on Nix purity

{{< callout >}}

If you're already familiar with Nix, feel free to skip this section and jump to [_containers_](#with-containers).

{{</ callout >}}

Nix purists like to describe Nix's trait as "pure". I did not find this explanation helpful, until I realized and combined this with another piece of the puzzle: _Linux works through convention_. Despite many variations of Linux distributions, most would see `/usr/local/bin` in their `$PATH` by default. People expect `/bin/bash` to exist and dynamically linked libc is under `/usr/lib`.

Conventions are great during setup because it speeds up the process. However, expecting convention to be retained over long-lived instances would be naïve, just like the statements from people buying white sneakers.

Instead of following conventions to internals, Nix built its store through a read-only (for users) directory under `/nix/store`. In the following example, I told Nix to install curl such that it will be available system-wide and not just single user.

```nix
# configuration.nix

# List packages installed in system profile.
environment.systemPackages = with pkgs; [ curl ];
```

```shell-session
$ # Verify that curl is installed
$ curl --version
curl 8.4.0 (x86_64-pc-linux-gnu) libcurl/8.4.0 OpenSSL/3.0.11 zlib/1.3
  brotli/1.1.0 zstd/1.5.5 libidn2/2.3.4 libssh2/1.11.0 nghttp2/1.57.0
Release-Date: 2023-10-11
Protocols: dict file ftp ftps gopher gophers http https imap imaps mqtt
  pop3 pop3s rtsp scp sftp smb smbs smtp smtps telnet tftp
Features: alt-svc AsynchDNS brotli GSS-API HSTS HTTP2 HTTPS-proxy IDN
  IPv6 Kerberos Largefile libz NTLM SPNEGO SSL threadsafe
  TLS-SRP UnixSockets zstd

$ # Where is it installed?
$ which curl
/run/current-system/sw/bin/curl

$ # But I was promised it would be in /nix/store!?
$ file `which curl`
/run/current-system/sw/bin/curl: symbolic link to
  /nix/store/0g1lq3vff290wainxdlbz9a18m28pr4r-curl-8.4.0-bin/bin/curl
```

Now, curl is a dynamically linked binary to various libraries. Let's look at how we can find those libraries.

```shell-session
$ # Most Linux distributions would expect this to have something.
$ ls /lib /usr/lib
ls: cannot access '/lib': No such file or directory
ls: cannot access '/usr/lib': No such file or directory

$ # However, Nix also have them in /nix/store :)
$ readlink `which curl` | xargs file
/nix/store/0g1lq3vff290wainxdlbz9a18m28pr4r-curl-8.4.0-bin/bin/curl:
  ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked,
  interpreter /nix/store/gqghjch4p1s69sv4mcjksb2kb65rwqjy-glibc-2.38-23/lib/ld-linux-x86-64.so.2,
  BuildID[sha1]=ee89ad486f6e97b0d8e104c5d1178d71dbc94c0e,
  for GNU/Linux 3.10.0, not stripped

$ ldd `which curl`
    linux-vdso.so.1 (0x00007ffc20df0000)
    libcurl.so.4 => /nix/store/wxwljhqszqzg2wlvbckc7h61p5k8ap2v-curl-8.4.0/lib/libcurl.so.4 (0x00007f57dd7fa000)
    libssl.so.3 => /nix/store/vzajrlhsdv2d39s7v6zv09ggajs05gwj-openssl-3.0.11/lib/libssl.so.3 (0x00007f57dd74d000)
    libcrypto.so.3 => /nix/store/vzajrlhsdv2d39s7v6zv09ggajs05gwj-openssl-3.0.11/lib/libcrypto.so.3 (0x00007f57dd200000)
    libz.so.1 => /nix/store/s5gzrzha72q79v92wqq61x9ir8xiwbxk-zlib-1.3/lib/libz.so.1 (0x00007f57dd72f000)
    libc.so.6 => /nix/store/gqghjch4p1s69sv4mcjksb2kb65rwqjy-glibc-2.38-23/lib/libc.so.6 (0x00007f57dd018000)
    libnghttp2.so.14 => /nix/store/1cypijpn76f3p9ipbayy41dw9wrkngfr-nghttp2-1.57.0-lib/lib/libnghttp2.so.14 (0x00007f57dd6fd000)
    libidn2.so.0 => /nix/store/w4djxksksd1p8m054k537plqnif5858k-libidn2-2.3.4/lib/libidn2.so.0 (0x00007f57dd6cc000)
    libssh2.so.1 => /nix/store/fp6wxphhl73jlmhlncqy7q0wdz5vi4pw-libssh2-1.11.0/lib/libssh2.so.1 (0x00007f57dd686000)
    libgssapi_krb5.so.2 => /nix/store/4a2nvlybmsg95pq8zd6a0wch2gjv53zq-libkrb5-1.20.2/lib/libgssapi_krb5.so.2 (0x00007f57dcfc5000)
    libzstd.so.1 => /nix/store/g1cigbjr62y1wzff83j3s4fj3hnd3j6g-zstd-1.5.5/lib/libzstd.so.1 (0x00007f57dcef9000)
    libbrotlidec.so.1 => /nix/store/8py3bfw4k5b6lpxlwi3nmnakihxa63jp-brotli-1.1.0-lib/lib/libbrotlidec.so.1 (0x00007f57dceeb000)
    ...
```

By patching these import paths, Nix can ensure that programs can remain _pure_. If I happen to install a different program requiring a different version of the same libraries, Nix will store them separately and individual programs will know which designated version to import.

## With containers

Nix provides a built-in way to build containers, compatible with Docker. We will not go into that today, because:

1. Amos (aka fasterthanlime) has written a good one about it.
2. I don't think I have understood Nix Flakes enough for that method.

So, we are going into town the other way!

Because Nix has conveniently patched all import paths, there is technically no implicit dependencies, up to what is deemed appropriate by maintainers.

```shell-session
$ # Let's find out where all the paths required by git
$ nix-store --query --requisites `which curl`
/nix/store/sdhmm56jv7r449hf7f57cl3pvnsy3cbg-xgcc-12.3.0-libgcc
/nix/store/4r64z7v5l40pg6r0hd169bcs85c8c42b-libunistring-1.1
/nix/store/w4djxksksd1p8m054k537plqnif5858k-libidn2-2.3.4
/nix/store/gqghjch4p1s69sv4mcjksb2kb65rwqjy-glibc-2.38-23
/nix/store/s5gzrzha72q79v92wqq61x9ir8xiwbxk-zlib-1.3
/nix/store/vzajrlhsdv2d39s7v6zv09ggajs05gwj-openssl-3.0.11
/nix/store/1cypijpn76f3p9ipbayy41dw9wrkngfr-nghttp2-1.57.0-lib
/nix/store/abmvgf557s0ckg1a7l8n4kq4sf70g48k-keyutils-1.6.3-lib
/nix/store/lf0wpjrj8yx4gsmw2s3xfl58ixmqk8qa-bash-5.2-p15
/nix/store/4a2nvlybmsg95pq8zd6a0wch2gjv53zq-libkrb5-1.20.2
/nix/store/8py3bfw4k5b6lpxlwi3nmnakihxa63jp-brotli-1.1.0-lib
/nix/store/fp6wxphhl73jlmhlncqy7q0wdz5vi4pw-libssh2-1.11.0
/nix/store/1q6qwq8csbhyy0pv54sab00jxlmb3rw2-gcc-12.3.0-libgcc
/nix/store/9fy9zzhf613xp0c3jsjxbjq6yp8afrsv-gcc-12.3.0-lib
/nix/store/g1cigbjr62y1wzff83j3s4fj3hnd3j6g-zstd-1.5.5
/nix/store/wxwljhqszqzg2wlvbckc7h61p5k8ap2v-curl-8.4.0
/nix/store/0g1lq3vff290wainxdlbz9a18m28pr4r-curl-8.4.0-bin
```

Since we have all the dependencies here... what if... we just _shove_ them all into a container? 👉🏼👈🏼

```shell-session
$ # Start by archiving everything we need
$ storePaths=$(nix-store --query --requisites `which curl`)
$ tar -czf archive.tar.gz "${storePaths}"
tar: Removing leading `/' from member names
tar: Removing leading `/' from hard link targets

$ # Confirm that it has been built
$ du -h archive.tar.gz
19M     archive.tar.gz
```

```Dockerfile
# To prove that Nix really works, let's build it from scratch!
FROM scratch

# Docker automatically deflates the tarball to target directory.
ADD archive.tar.gz /

# Make sure it knows where to find curl.
ENV PATH /nix/store/0g1lq3vff290wainxdlbz9a18m28pr4r-curl-8.4.0-bin/bin:$PATH

ENTRYPOINT ["curl"]
```

```shell-session
$ docker build --load --tag nix-curl:latest .
 => [internal] load build definition from Dockerfile  0.0s
 => => transferring dockerfile: 174B                  0.0s
 => [internal] load .dockerignore                     0.0s
 => => transferring context: 2B                       0.0s
 => [internal] load build context                     0.0s
 => => transferring context: 38B                      0.0s
 => [1/1] ADD archive.tar.gz /                        0.4s
 => exporting to docker image format                  3.1s
 => => exporting layers                               2.3s
 => => exporting manifest sha256:4cb909988d928401da1  0.0s
 => => exporting config sha256:fc8c0dbe57250aea271c9  0.0s
 => => sending tarball                                0.8s
 => importing to docker                               0.6s

$ docker run --rm --interactive --tty nix-curl:latest --version
curl 8.4.0 (x86_64-pc-linux-gnu) libcurl/8.4.0 OpenSSL/3.0.11 zlib/1.3
  brotli/1.1.0 zstd/1.5.5 libidn2/2.3.4 libssh2/1.11.0 nghttp2/1.57.0
Release-Date: 2023-10-11
Protocols: dict file ftp ftps gopher gophers http https imap imaps mqtt
  pop3 pop3s rtsp scp sftp smb smbs smtp smtps telnet tftp
Features: alt-svc AsynchDNS brotli GSS-API HSTS HTTP2 HTTPS-proxy IDN
  IPv6 Kerberos Largefile libz NTLM SPNEGO SSL threadsafe
  TLS-SRP UnixSockets zstd
```

## Should you do this?

No.

Okay, fine.

_It depends_. Here is a non-exhaustive list of potential problems I found.

### Size difference

Compared to official container image published by curl maintainers, our image is **huge**. Literally 3x in size.

```shell-session
$ docker image ls
REPOSITORY          TAG         IMAGE ID       CREATED         SIZE
nix-curl            latest      fc8c0dbe5725   5 minutes ago   54.7MB
quay.io/curl/curl   latest      e5da26576817   4 weeks ago     18.3MB
```

While I don't have definitive rational on why it happens, the version output provides some hint of what could be part of the reason:

- Nix curl uses GNU libc, the other is musl.
- Nix curl has zstd, the other does not.

```shell-session
$ docker run --rm -it nix-curl:latest --version
curl 8.4.0 (x86_64-pc-linux-gnu) libcurl/8.4.0 OpenSSL/3.0.11 zlib/1.3
  brotli/1.1.0 zstd/1.5.5 libidn2/2.3.4 libssh2/1.11.0 nghttp2/1.57.0
Release-Date: 2023-10-11
Protocols: dict file ftp ftps gopher gophers http https imap imaps mqtt
  pop3 pop3s rtsp scp sftp smb smbs smtp smtps telnet tftp
Features: alt-svc AsynchDNS brotli GSS-API HSTS HTTP2 HTTPS-proxy IDN
  IPv6 Kerberos Largefile libz NTLM SPNEGO SSL threadsafe
  TLS-SRP UnixSockets zstd

$ docker run --rm -it quay.io/curl/curl:latest --version
curl 8.4.0 (x86_64-pc-linux-musl) libcurl/8.4.0 OpenSSL/3.1.3 zlib/1.2.13
  brotli/1.0.9 libidn2/2.3.4 libssh2/1.10.0 nghttp2/1.57.0
Release-Date: 2023-10-11
Protocols: dict file ftp ftps gopher gophers http https imap imaps mqtt
  pop3 pop3s rtsp scp sftp smb smbs smtp smtps telnet tftp
Features: alt-svc AsynchDNS brotli GSS-API HSTS HTTP2 HTTPS-proxy IDN
  IPv6 Kerberos Largefile libz NTLM SPNEGO SSL threadsafe
  TLS-SRP UnixSockets
```

### Does it _really_ work?

Surely a container was built to be used, right? Well, is it useful?

```shell-session
$ # Using host machine's native binary
$ curl https://dummyjson.com/http/200
{"status":"200","message":"OK"}

$ # Using the container we built
$ docker run --rm -it nix-curl:latest https://dummyjson.com/http/200
curl: (35) OpenSSL/3.0.11: error:16000069:STORE routines::unregistered scheme
```

Ah, good ol' certificates. This is actually one of the reasons why I usually go with [Distroless](https://github.com/GoogleContainerTools/distroless) instead of `scratch` as base image: it's packaged with certificate authority (CA) bundle and timezone data — stuff you don't think too much of until they're missing.

I imagine there is a good reason why certificates are handled differently compared to unlike dynamic libraries. My guess is that "there is no good reason to ask for older CA bundle".

Using Distroless is one way to solve this, while the other is by bundling CA certificates from Nix as well, which is left as an exercise for the reader.

{{< callout >}}

On NixOS, start with `/etc/ssl/certs/ca-bundle.crt` and `/etc/ssl/certs/ca-certificates.pem`.

{{</ callout >}}

## Appendix

- To do this on a host machine that doesn't have Nix, you can leverage multi-stage Docker build by using [nixos/nix](https://hub.docker.com/r/nixos/nix) as the container builder image. [Mitchell Hashimoto wrote about it](https://mitchellh.com/writing/nix-with-dockerfiles#dockerfile).
- While the archive of Nix stores are idempotent (i.e. the `archive.tar.gz` checksum will be consistent), it's not the same with the produced container image as it contains build metadata (e.g. build time).
  - If idempotent container build is something of interest to you, folks at Chainguard are solving that through [apko](https://github.com/chainguard-dev/apko).
  - Alternatively, look into [`pkgs.dockerTools`](https://ryantm.github.io/nixpkgs/builders/images/dockertools/).
- Shoutout to [Alpine Linux's Dockerfile](https://github.com/alpinelinux/docker-alpine/blob/edge/x86_64/Dockerfile) for the inspiration behind this idea.
