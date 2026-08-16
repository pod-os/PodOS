let
  nixpkgs = builtins.fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/02e08985a27c65ffd33d434eeb2e660a2e4dc84d.tar.gz";
    sha256 = "1959piz48qhaaqdyr2m5mf92gnxxhrzhls6z1ppy01ckh5wdrya2";
  };
in
{ pkgs ? import nixpkgs {} }:

with pkgs;
mkShell {
  buildInputs = [
    nushell
    python3Packages.mkdocs
    python3Packages.mkdocs-material
    python3Packages.mkdocs-awesome-nav
    python3Packages.mkdocs-rss-plugin
    rsync
  ];

  shellHook = ''
echo "- Nushell $(nu --version)"
echo "- MkDocs $(mkdocs --version)" 
echo ""
echo "Available commands:"
echo "- make serve : Start development server"
echo "- make build : Build static site"
  '';
}