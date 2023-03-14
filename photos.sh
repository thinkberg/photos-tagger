#!/usr/bin/env bash

if [ "$1" = "tag" ]; then
  shift
  /usr/bin/osascript -l JavaScript src/PhotosTagger.js $*
elif [ "$1" == "folder" ]; then
  shift
  /usr/bin/osascript -l JavaScript src/PhotosCreateFolders.js $*
else
  echo "usage: $0 [tag|folder] <root folder>"
fi
