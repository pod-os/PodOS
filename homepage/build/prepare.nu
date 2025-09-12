#!/usr/bin/env nu

rsync --recursive --delete ../assets/ ./docs/assets/

rsync --recursive --delete ../docs/elements ./docs/reference

ls ./docs/reference/elements/**/readme.md
  | each {|f|
      $f.name
      let new = ($f.name | str replace 'readme.md' 'index.md')
      mv $f.name $new
  }
