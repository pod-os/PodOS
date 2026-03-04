let
  nixpkgs = builtins.fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/fabb8c9deee281e50b1065002c9828f2cf7b2239.tar.gz";
    sha256 = "15gvdgdqsxjjihq1r66qz1q97mlcaq1jbpkhbx287r5py2vy38b1";
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