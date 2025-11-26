 const tileSize = 16;

////dimensionin mappa 
const MAP_WIDTH = 1920;
const MAP_HEIGHT = 1080;

const resolution_width =  1920
const resolution_height = 1080

// Calcoliamo il fattore di scala rispetto allo schermo
const scaleX = resolution_width / MAP_WIDTH;
const scaleY = resolution_height / MAP_HEIGHT;
const scale = Math.min(scaleX, scaleY); // Mantieni proporzioni corrette



export default class Camera {
    constructor (resWidth, resHeight, mapWidth, mapHeight) {
        this.resWidth = resWidth;
        this. resHeight = resHeight;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;

        this.x = 0;
        this.y = 0;
        this.scale = scale; //zoom iniziale
    }

    follow (player) {
        ///questo decide quanto centrare la camera
        this.x = player.x + player.w / 2 - (this.resWidth / (2 * this.scale));
        this.y = player.y + player.h / 2 - (this.resHeight / (2 * this.scale));
    
    // clamp ai bordi della mappa
        this.x = Math.max(0, Math.min(this.x, this.mapWidth - this.resWidth / this.scale));
        this.y = Math.max(0, Math.min(this.y, this.mapHeight - this.resHeight / this.scale))
}

apply (ctx) {
    ctx.setTransform(this.scale, 0, 0, this.scale, -this.x * this.scale, -this.y * this.scale);
}
setZoom(zoom) {
        this.scale = zoom;
    }

}

export {tileSize, resolution_width, resolution_height, MAP_HEIGHT, MAP_WIDTH}