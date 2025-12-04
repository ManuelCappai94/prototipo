
 const tileSize = 16;


 

////dimensionin mappa 
// const MAP_WIDTH = 1920;
// const MAP_HEIGHT = 1080;

const resolution_width =  1920
const resolution_height = 1080

// Calcoliamo il fattore di scala rispetto allo schermo
// const scaleX = resolution_width / MAP_WIDTH;
// const scaleY = resolution_height / MAP_HEIGHT;
// const scale = Math.min(scaleX, scaleY); // Mantieni proporzioni corrette



export default class Camera {
    constructor () {
        this.resWidth = 1920;
        this.resHeight = 1080;
        this.mapWidth = 1;
        this.mapHeight = 1;
        this.x = 0;
        this.y = 0;
        this.scale = 1; //zoom iniziale
        //gestione shake schermo
        this.shakeDuration = 0; 
        this.magnitude = 0; //questo è il numero che moltiplico al random
    }
    shake(duration , magnitude ){
        this.shakeDuration = duration
        this.magnitude = magnitude
    }
 


    follow (player) {
        const viewportW = this.resWidth / this.scale; //deciso in zoom alla fine di script
        const viewportH = this.resHeight / this.scale;
        ///questo decide quanto centrare la camera
        this.x = Math.floor(player.x + player.w / 2 - viewportW/2);
        this.y = Math.floor(player.y + player.h / 2 - viewportH/2);
    
    // clamp ai bordi della mappa
        this.x = Math.max(0, Math.min(this.x, this.mapWidth - this.resWidth / this.scale));
        this.y = Math.max(0, Math.min(this.y, this.mapHeight - this.resHeight / this.scale))

        if (this.shakeDuration > 0) {
        const shakeX = (Math.random() - 0.5) * this.magnitude;
        const shakeY = (Math.random() - 0.5) * this.magnitude;

        this.x += shakeX;
        this.y += shakeY;

        this.shakeDuration--;
        // console.log("x" ,this.mapWidth, "y", this.mapHeight)
    }

}

apply (ctx) {
    ctx.setTransform(this.scale, 0, 0, this.scale, -this.x * this.scale, -this.y * this.scale);
}
setZoom(zoom) {
        this.scale = zoom;
    }

}

export {tileSize}