{ pkgs ? import <nixpkgs> {} }:

with pkgs;
mkShell {
  buildInputs = [
    nushell
    python3Packages.mkdocs
    python3Packages.mkdocs-material
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