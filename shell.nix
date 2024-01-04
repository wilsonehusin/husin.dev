{ pkgs ? import <nixpkgs> { }
, ... }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    hugo
    tailwindcss
    hivemind
    just
  ];
}
