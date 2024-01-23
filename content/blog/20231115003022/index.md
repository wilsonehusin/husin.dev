---
title: Building containers in Nix, the sinful way
url: nix-container-sinful
publishDate: 2023-11-15
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

If you're already familiar with Nix, feel free to skip this section and jump to [_containers_ section](#with-containers)

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
