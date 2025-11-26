async function loadTileset(ts, mapFolder) {

    const tsxPath = mapFolder + ts.source.replace("../", "");
    //il parse dell'xml
    const response = await fetch(tsxPath)
    //devo vedermi cosa ritorna text
    const text = await response.text()

    const parser = new DOMParser()
    const xml = parser.parseFromString(text, "application/xml")

    const tilesetNode = xml.querySelector("tileset")
    const imageNode = xml.querySelector("image")

    const tileW = parseInt(tilesetNode.getAttribute("tilewidth"));
    const tileH = parseInt(tilesetNode.getAttribute("tileheight"));
    const columns = parseInt(tilesetNode.getAttribute("columns"));
    const imageSrc = imageNode.getAttribute("source");

    const img = new Image()
    img.src = mapFolder + imageSrc.replace("../", "")
    await img.decode(); 

    return {
        firstgid: ts.firstgid,
        img,
        tileW,
        tileH,
        columns
    }
}


export async function loadTileMap(pathToTiledMap) {
    const raw = await fetch(pathToTiledMap).then(r => r.json());

    const mapFolder = pathToTiledMap.substring(0, pathToTiledMap.lastIndexOf("/") + 1);

    const tilesets = [];
    //devo approfondire questa riga
    for (const ts of raw.tilesets){
        const loaded = await loadTileset(ts, mapFolder)
        tilesets.push(loaded)
    }
    return{
        map: raw,
        tilesets
    }
}