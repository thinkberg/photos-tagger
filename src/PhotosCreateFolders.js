// photos recreate folder structure script
const TAGPREFIX = "P:"

ObjC.import('stdlib')
const argv = $.NSProcessInfo.processInfo.arguments.js.splice(4);

let app = Application('Photos');
app.includeStandardAdditions = true

const baseFolder = argv.length === 0 ? app : app.folders.byName(argv[0].js);
console.log(`!! target folder: ${baseFolder.name()}`);

// find the album `albumName` below the folder `folder` with the specified path
// creates the folder structure and the album, if not already existing
function findAlbum(folder, path, albumName) {
    //console.log(`== findAlbum({${folder.name()}}, [${path}], "${albumName}")`);

    // we arrived at the lowest folder level, check if the album exists
    if (path.length === 0) {
        const album = folder.albums.whose({name: albumName});
        if (album.length === 0) {
            console.log(`> creating new album: ${albumName} at ${folder.name()}`);
            return app.make({new: "album", named: albumName, at: folder});
        } else {
            //console.log(`> existing album found: ${albumName} at ${folder.name()}`);
            return album[0];
        }
    }

    // find a folder with the expected name at the current level
    const foundFolder = folder.folders.whose({name: path[0]});
    if (foundFolder.length === 0) {
        console.log(`> creating new folder: ${path[0]} at ${folder.name()}`);
        createFolder = {new: "folder", named: path[0], at: folder};
        // we can't use 'at' when we are at the top level
        if (folder instanceof Application) delete createFolder.at;
        const subFolder = app.make(createFolder);
        return findAlbum(subFolder, path.slice(1), albumName);
    } else {
        return findAlbum(foundFolder[0], path.slice(1), albumName);
    }
}

// keep a cache of existing albums at their path (no need to traverse again)
var albums = new Map();

Progress.totalUnitCount = app.mediaItems.length
Progress.completedUnitCount = 0
Progress.description = "Processing keywords..."
Progress.additionalDescription = "Preparing to process."

// check all media items with a keyword prefixed by 'P:'
app.mediaItems().forEach((m, i) => {
    Progress.additionalDescription = "Processing ... (" + i + "/" + Progress.totalUnitCount + ")"
    const keywords = m.keywords();
    if (keywords) {
        keywords.filter(k => k.startsWith(TAGPREFIX)).forEach(p => {
            var album = albums.get(p);
            if (!album) {
                //console.log(`>> analyzing ${p} for ${m.filename()}`);
                const pathElements = p.substring(2).split("/");
                const albumName = pathElements.pop();
                album = findAlbum(baseFolder, pathElements, albumName);
                albums.set(p, album);
            }
            // only add to album, if the photo is not already added
            if (album.mediaItems.whose({id: m.id()}).length === 0) {
                console.log(`>> adding ${m.filename()} to ${p.substring(2)}`);
                app.add([m], {to: album});
            }
        });
    }
    Progress.completedUnitCount = i;
});
$.exit(0)
