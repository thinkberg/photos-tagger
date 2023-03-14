// tags all photos with the folder/album structure
const REMOVETAGS = false;
const TAGPREFIX = "P:"

ObjC.import('stdlib');
const argv = $.NSProcessInfo.processInfo.arguments.js.splice(4);
if(argv.length === 0) {
    console.log("photos tagger: use a root folder!")
    $.exit(0);
}
const ROOT = argv[0].js;

let app = Application('Photos');
app.includeStandardAdditions = true

function collectAlbums(r, p, children) {
    if (children.length === 0) return r;
    for (var c of children) {
        const childPath = p + "/" + c.name();
        for (var a of c.albums()) {
            var path = childPath + "/" + a.name();
            if (path[0] === '/') path = path.substring(1);
            r.set(path, a);
            if (path.startsWith(ROOT)) {
                const tag = TAGPREFIX + path;
                a.mediaItems().forEach((m) => {
                    const keywords = m.keywords();
                    if(!keywords || !keywords.includes(tag)) {
                        console.log(`> ${m.filename()} tag '${tag}'`);
                        if(!keywords) m.keywords.set([tag]);
                        else m.keywords.set([...new Set([...keywords, ...[tag]])]);
                    } else if(REMOVETAGS && keywords && keywords.includes(tag)) {
                        console.log(`< ${m.filename()} tag '${tag}'`);
                        const idx = keywords.indexOf(tag);
                        m.keywords.set(keywords.splice(idx, idx));
                    }
                });
            }
        }
        r = new Map([...r, ...collectAlbums(r, childPath, c.folders())]);
    }
    return r;
}

let albums = new Map(app.albums().map((a) => [a.name(), a]));
let folders = new Map(app.folders().map((f) => [f.name(), f]));

console.log("== target folder: '"+ROOT+"'");
console.log("== top level albums: " + Array.from(albums.keys()));
console.log("== top level folders: " + Array.from(folders.keys()));

collectAlbums(albums, "", app.folders());
$.exit(0)
