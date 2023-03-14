# PhotosTagger

A collection of scripts to script Apple Photos.app to overcome
issues with the Family Sharing, which shares the photos, but not
the folder and album structure.

There are two scripts:
- [PhotosTagger.js](src/PhotosTagger.js) -- adds keywords to all media items with the folder/album path
- [PhotosCreateFolders.js](src/PhotosCreateFolders.js) -- reads keywords and re-creates the folder and album structure

## Examples:

Tag all photos in sorted folder:
```shell
./photos.sh tag Sorted
```

Create the folder structure 
```shell
./photos.sh folder TargetFolder
```

## Disclaimer

No guarantee that this works as expected. I tested it as good
as possible. It works for me.

---
```
Copyright 2023 Matthias L. Jugel

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
