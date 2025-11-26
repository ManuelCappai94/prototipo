

export default class ChangeMap {
    constructor(x, y, width, height, mapName, destination){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.map = mapName;
        this.destination = destination
    }

    triggerDetection(player){
        const left = this.detectionArea.x;
        const right = this.detectionArea.x + this.detectionArea.width;
        const top = this.detectionArea.y;
        const bottom = this.detectionArea.y + this.detectionArea.height;

        ////player
        const playerleft = player.hitbox.x  ;
        const playerright = player.hitbox.x + player.hitbox.width;
        const playertop = player.hitbox.y;
        const playerbottom = player.hitbox.y + player.hitbox.height;

        if ( playerleft < right && playerright > left &&playerbottom > top && playertop <bottom) {
           localStorage.setItem("current location",JSON.stringify(this.mapDest ))
           localStorage.setItem("player position", JSON.stringify(this.destination))
           location.reload()
        }

    }
    ///devo passare l'indice della mappa che voglio venga caricata
    loadNextMap(index){
     
    }

}

export class TriggerMap extends ChangeMap {
   constructor(x, y){
    super(x, y, 10, 10,"interiors" )
  
    this.destination = {
        x: 76*16,
        y: 56*16
    }
    this.mapDest = 1

    this.detectionArea = {
        x: this.x,
        y: this.y,
        width: this.width,
        height : this.height,
    }
   }
}


export class sudWestHall extends ChangeMap {
    constructor(x, y){
        super(x, y, 10, 10,"interiors" )
  
    this.destination = {
        x: 3*16,
        y: 33*16,
    }
    this.mapDest = 0

    this.detectionArea = {
        x: this.x,
        y: this.y,
        width: this.width,
        height : this.height,
    }
   }
}
    
