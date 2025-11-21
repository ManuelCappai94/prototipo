export const tileSize = 16;

////dimensionin mappa 
const MAP_WIDTH = 1280;
const MAP_HEIGHT = 720;

// Calcoliamo il fattore di scala rispetto allo schermo
const scaleX = window.innerWidth / MAP_WIDTH;
const scaleY = window.innerHeight / MAP_HEIGHT;
const scale = Math.min(scaleX, scaleY); // Mantieni proporzioni corrette



export default class Camera {
    constructor (canvasWidth, canvasHeight, mapWidth, mapHeight) {
        this.canvasWidth = canvasWidth;
        this. canvasHeight = canvasHeight;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;

        this.x = 0;
        this.y = 0;
        this.scale = 1; //zoom iniziale
    }

    follow (player) {
        ///questo decide quanto centrare la camera
        this.x = player.x + player.w / 2 - (this.canvasWidth / (2 * this.scale));
        this.y = player.y + player.h / 2 - (this.canvasHeight / (2 * this.scale));
    
    // clamp ai bordi della mappa
        this.x = Math.max(0, Math.min(this.x, this.mapWidth - this.canvasWidth / this.scale));
        this.y = Math.max(0, Math.min(this.y, this.mapHeight - this.canvasHeight / this.scale))
}

apply (ctx) {
    ctx.setTransform(this.scale, 0, 0, this.scale, -this.x * this.scale, -this.y * this.scale);
}
setZoom(zoom) {
        this.scale = zoom;
    }

}






export {scale, MAP_HEIGHT, MAP_WIDTH}