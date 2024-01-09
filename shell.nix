{ pkgs ? import <nixpkgs> { }
, ... }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    hugo
    hivemind
    just

    nodejs_20
    nodejs_20.pkgs.pnpm
  ];
}
