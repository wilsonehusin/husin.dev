{ pkgs ? import <nixpkgs> { }
, ... }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    hugo
    hivemind
    just
    timg

    nodejs_20
    nodejs_20.pkgs.pnpm
  ];
}
