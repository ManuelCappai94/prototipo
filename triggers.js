

export default class ChangeMap {
    constructor(x, y, width, height, mapName){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.map = mapName;
        
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

        if ( playerleft < right && playerright > left && playerbottom > top && playertop <bottom) {
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
    super(x, y, 30, 5 )
  
    this.destination = {
        x: 75*16,
        y: 55*16
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
export class xCorridorKitchen extends ChangeMap {
   constructor(x, y){
    super(x, y, 5, 30 )
  
    this.destination = {
        x: 6*16,
        y: 14*16
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
export class xRoomChildreen extends ChangeMap {
   constructor(x, y){
    super(x, y, 5, 30 )
  
    this.destination = {
        x: 6*16,
        y: 9*16
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
export class xKitchen extends ChangeMap {
   constructor(x, y){
    super(x, y, 30, 5 )
  
    this.destination = {
        x: 19*16,
        y: 30*16
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
export class xCorridorKitchen2 extends ChangeMap {
   constructor(x, y){
    super(x, y, 30, 5 )
  
    this.destination = {
        x: 21*16,
        y: 14*16
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
export class xLoverRoom extends ChangeMap {
   constructor(x, y){
    super(x, y, 30, 5 )
  
    this.destination = {
        x: 22*16,
        y: 7*16
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
export class xdiningRoom extends ChangeMap {
   constructor(x, y){
    super(x, y, 30, 5 )
  
    this.destination = {
        x: 64*16,
        y: 9*16
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
export class xBiblio extends ChangeMap {
   constructor(x, y){
    super(x, y, 30, 5 )
  
    this.destination = {
        x: 102*16,
        y: 8*16
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
export class xTortureChamber extends ChangeMap {
   constructor(x, y){
    super(x, y, 5, 30 )
  
    this.destination = {
        x: 100*16,
        y: 53*16
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
export class xEmptyRoom extends ChangeMap {
   constructor(x, y){
    super(x, y, 5, 30 )
  
    this.destination = {
        x: 92*16,
        y: 34*16
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

///////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
export class sudWestHall extends ChangeMap {
    constructor(x, y){
        super(x, y, 30, 5 )
  
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
export class CorridRooms extends ChangeMap {
    constructor(x, y){
        super(x, y, 30, 5 )
  
    this.destination = {
        x: 30*16,
        y: 4*16,
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
export class xNordCorridor extends ChangeMap {
    constructor(x, y){
        super(x, y, 30, 5 )
  
    this.destination = {
        x: 57*16,
        y: 5*16,
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
export class WestHall1 extends ChangeMap {
    constructor(x, y){
        super(x, y, 5, 30 )
  
    this.destination = {
        x: 10*16,
        y: 15*16,
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
export class WestHall2 extends ChangeMap {
    constructor(x, y){
        super(x, y, 5, 30 )
  
    this.destination = {
        x: 10*16,
        y: 10*16,
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
export class xEastCorridorBiblio extends ChangeMap {
    constructor(x, y){
        super(x, y, 30, 5 )
  
    this.destination = {
        x: 71*16,
        y: 19*16,
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
    
export class EastCorridor extends ChangeMap {
    constructor(x, y){
        super(x, y, 5, 30 )
  
    this.destination = {
        x: 65*16,
        y: 37*16,
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
export class xEastCorridor2 extends ChangeMap {
    constructor(x, y){
        super(x, y, 5, 30 )
  
    this.destination = {
        x: 64*16,
        y: 38*16,
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