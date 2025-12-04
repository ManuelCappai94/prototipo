


const prompts =  {
        tree :  new Image(),
        vase : new Image(),
        treasure: new Image(),
        frame: new Image(),
        doors: {
            doorSud: new Image(),
            doorEst: new Image(),
            doorOvest: new Image(),
        },
        candle : new Image(),
        barrel : new Image(),
        candelbra : new Image(),
        hiddenWall : new Image(),  
        key: new Image(),      
    }


prompts.tree.src = "assets/tree-sprite.png" ///cosi accedo all'immagine dentro all'oggetto;
prompts.vase.src = "assets/vase.png"
prompts.treasure.src = "assets/treasure.png"
prompts.doors.doorSud.src = "assets/doorFrontSud.png"
prompts.doors.doorEst.src = "assets/doorSideLeft.png"
prompts.doors.doorOvest.src = "assets/doorSideRight.png"
prompts.frame.src= "assets/eye.png"
prompts.candle.src ="assets/candle.png"
prompts.hiddenWall.src = "assets/hiddenWall.png"
prompts.candelbra.src = "assets/candlebra.png"
prompts.barrel.src = "assets/barrel.png"
prompts.key.src = "assets/key.png"




export default class Assets { //assets non va evocato perchè astratto, le estensioni si!
    constructor(x, y, width, height, sprite, layer, isDesctruble ){
        this.x = x; //posizione
        this.y = y;
        this.width = width; // grandezza, quanto disegno, devo separarlo dall'hitbox
        this.height = height;
        this.sprite = sprite; //immagine
        this.frameX = 0; //definiti separatamente in ogni prompt
        this.frameY = 0;
        this.hp = 0; //definiti per ogni prompt
        this.fps = 0;
        this.layer = layer; 
        this.isDesctruble = isDesctruble     
    }
    draw(ctx, deltaTime){
        if (this.frameTimer > this.frameInterval) {
        if (this.frameX < this.maxFrame)this.frameX++;
            else this.frameX = 0;
                this.frameTimer = 0;
            } else { this.frameTimer += deltaTime; 
            }
        if(this.animationActive) {
                    this.aniamtionTimer += deltaTime; //tengo traccia dall'apertura della porta      
        }
        if (this.animationActive && this.frameX >= this.maxFrame){
                    // this.animationActive = false;
                    this.maxFrame =0;
                    this.frameX=4;
                    this.hitbox = {x:0, y:0, width:0, height:0}      
        }
         if (this.aniamtionTimer >= 2000 && !this.insideShade )  {
            // if(this.insideShade)return
            this.frameX= 0;
             this.frameY = 1;
             this.maxFrame = 4;
             this.isClosing = true;
              this.aniamtionTimer = 0;
        }  

        if(this.isClosing && this.frameX >= this.maxFrame){
            this.state = [this.frameX = 0,this.maxFrame= 0, this.frameY=0]
            this.isOpen = false
            this.animationActive = false
             this.hitbox = {
                x: this.x + this.offsetX ,      // margine interno
                y: this.y + this.offsetY,
                width: this.w * this.offsetW,
                height: this.h* this.offsetH ,       
        }
        this.isClosing= false
       }
       if (this instanceof Eye) {
         if (this.isLooking) {
            if (this.firstLook) {
                this.frameY = 0;     
                this.frameX = 0;
                this.maxFrame = 4;
                this.firstLook = false;
            }
            if (this.frameX >= this.maxFrame) {
                this.frameX = 0;
                this.frameY = Math.floor(Math.random() * 4);
            } } else {
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 0;
            this.firstLook = true
        }}
        if(this instanceof HiddenDoor){
            if(this.isOpen && this.frameX >= this.maxFrame){
                this.maxFrame = 0
                this.frameTimer = 0
                this.frameX = 10
                this.hitbox = {x:0, y:0, width:0, height:0}
            }
        }
            
        ctx.drawImage(this.sprite, this.width * this.frameX, this.height * this.frameY , this.width, this.height, this.x, this.y, this.w, this.h );
    }

    collisionsObjects(player, deltatime){ //questo viene chimato nel loop di gioco assieme a draw;
        const dt = deltatime/1000;
        const left = this.hitbox.x;
        const right = this.hitbox.x + this.hitbox.width;
        const top = this.hitbox.y;
        const  bottom = this.hitbox.y + this.hitbox.height;
        ///dentro al rettangolo
        const insideLeft = this.shape.x;
        const insideRight = this.shape.x + this.shape.width;
        const insideTop = this.shape.y;
        const insideBottom = this.shape.y + this.shape.height;
        ////player
        const playerleft = player.hitbox.x  ;
        const playerright = player.hitbox.x + player.hitbox.width;
        const playertop = player.hitbox.y;
        const playerbottom = player.hitbox.y + player.hitbox.height;
        //check collisione rettangoli
        if ( playerleft < right && playerright > left &&playerbottom > top && playertop <bottom) {
           if (player.speedx > 0) player.x -= player.speedx *dt; 
           //player.x è la posizione orizzontale del player.
            //Se fai player.x -= player.speedx, stai sottraendo la velocità alla posizione, cioè lo sposti indietro.
           //Se il player si muove a destra (speedx > 0) e collide, devi spostarlo indietro della stessa quantità che si sarebbe mosso, altrimenti finirebbe dentro l’oggetto.
            //Se invece stesse andando a sinistra (speedx < 0), faresti player.x -= player.speedx → visto che speedx è negativo, sottrarre un negativo fa +, quindi lo sposti indietro anche verso sinistra.
        if (player.speedx < 0) player.x -= player.speedx *dt; // sta andando a sinistra
        if (player.speedy > 0) player.y -= player.speedy *dt; // sta andando giù
        if (player.speedy < 0) player.y -= player.speedy *dt; // sta andando su
            this.canInteract = true; //flag prossimità
            }else {
                this.canInteract = false;
            }
        if(playerleft < insideRight && playerright > insideLeft &&playerbottom > insideTop && playertop < insideBottom){
            this.insideShade = true
        } else {
            this.insideShade = false
        }
        
    }



    checkHit(player, camera) {
        const hitbox = player.attackHitbox;
        if(!hitbox)return;

       if ( hitbox.x <  this.hitbox.x + this.hitbox.width && 
            hitbox.x + hitbox.width > this.hitbox.x &&
            hitbox.y < this.hitbox.y + this.hitbox.height &&
            hitbox.y + hitbox.height > this.hitbox.y
    ){
        if(this.isDesctruble){
            this.damage(2);
        }
         camera.shake(10, 4)
    }
        
    }
}



export class Tree extends Assets {
    constructor(x, y){
        super(x, y, 115, 128, prompts.tree, false);
         this.frameX = 0;
         this.frameY=  0;
         this.w = 64
         this.h = 84
            this.hitbox = {
            x: x ,      // margine interno
            y: y ,
            width: this.w ,
            height: this.h ,
        }
    }
}

export class Eye extends Assets {
    constructor(x,y){
        super(x, y, 64, 64, prompts.frame, "below", false)
        this.w = 64,
        this.h= 64,
        this.hitbox = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        }
        this.shape = {...this.hitbox}
        //animazione
        this.frameX= 0;
        // this.frameY = 0;
        this.maxFrame = 0;
        this.frameTimer= 0;
        this.fps = 7;
        this.frameInterval = 1000/this.fps;
        //timer per cambio animazione
        this.startAnimation = 0;
        this.isLooking= false;
        this.proximity = 80;
        this.distance = null;
    }
    getdistance(player){
     const vX = player.x - this.x;
     const vY = player.y - this.y;
     const distance = Math.hypot(vX, vY)
     if(distance < this.proximity){
         this.isLooking = true   
     } else {
        this.isLooking = false
     }
     
    }


}



export class Candle extends Assets{
    constructor(x, y ){
        super(x, y, 7, 16, prompts.candle, "below", false)
        this.w = 7,
        this.h = 16,
             this.hitbox = {
            x: 0,      
            y: 0,
            width: 0,
            height: 0,
        }
        this.shape = {...this.hitbox}
        this.frameTimer = 0
        this.fps = 4;
        this.maxFrame = 2
        this.frameInterval = 1000/this.fps;
        //// luce
        this.isLightSource = true;
        this.lightInner = 60;
        this.lightOuter = 90;
        this.pulsetimer = 0
        // l'area anche se casuale deve essere un cerchio
    }
    randomLight(deltatime){
        this.pulsetimer += deltatime
        if(this.pulsetimer >= 250){
            this.lightInner = 40 + Math.floor(Math.random()*3)
            this.lightOuter = 60 + Math.floor(Math.random()*2)
            this.pulsetimer = 0
        }
   
    }
}
export class Candlebra extends Assets{
    constructor(x, y){
        super(x, y, 11, 14, prompts.candelbra, "below", false)
        this.w = 11,
        this.h = 14,
             this.hitbox = {
            x: 0,      
            y: 0,
            width: 0,
            height: 0,
        }
        this.shape = {...this.hitbox}
        this.frameTimer = 0
        this.fps = 4;
        this.maxFrame = 3
        this.frameInterval = 1000/this.fps;
        ////luce
         this.isLightSource = true;
          this.lightInner = 30;
        this.lightOuter = 50;
        this.pulsetimer = 0
    }
  randomLight(deltatime){
        this.pulsetimer += deltatime
        if(this.pulsetimer >= 300){
            this.lightInner = 25 + Math.floor(Math.random()*3)
            this.lightOuter = 40 + Math.floor(Math.random()*2)
            this.pulsetimer = 0
        }
   
    }
}

class Interactable extends Assets {
    
    constructor(x, y, width, height, sprite, layer) {
        super(x, y, width, height, sprite, layer, false);
        this.canInteract = false;
        this.animationActive = false; //flag inizio animazioe
        this.isClosing = false; //flag per chiudere
       
      
    }
    interactDoor(player) {
      if(!this.canInteract) return
        if(this.isKeyRequired){
            if (!player.inventory?.includes(this.keyType)) {
           
            this.createMessage()
            return
        } }

        if(this.canInteract && !this.isOpen ){
          this.frameX = 0;
          this.frameY = 0;
          this.maxFrame = 4;
          this.state = [this.frameX, this.maxFrame, this.frameY]
          this.isOpen = true;
          this.animationActive = true;
            this.aniamtionTimer = 0; //punto iniziale, per calcolare la differenza tra inizio animazione e timestamp attuale. 
         
        }   
       }
           createMessage(){
            const textContainer = document.querySelector(".text-container")
            const duplicate = [...textContainer.children].some(el => el.textContent === message)
            if(duplicate) return
            
            const div = document.createElement("div")
            div.classList.add("avvisi")
            const message = document.createElement("span")
            message.classList.add("text")
            if(this instanceof Door){
                message.textContent = `it's closed, you can read ${this.keyType} on the doorplate`
            }
            if(this instanceof Keys){
                message.textContent = `Great! you picked the ${this.type} key!`
            }
            
            div.appendChild(message)
            textContainer.appendChild(div)
                setTimeout(() => {
                div.remove();
            }, 3000);

        }
    
}

export class Door extends Interactable {
    
    constructor(x, y, type, isKeyRequired, keyType){
        super(x, y, 64, 64)
        this.w = 64;
        this.h = 64; 
        this.fps = 8;
        this.frameTimer = 0; 
        this.canInteract = false; //questa serve per la prossimità
        this.frameInterval = 1000/this.fps;
        this.isKeyRequired = isKeyRequired;
        this.keyType = keyType;
        

        if (type === "frontSud"){
            this.sprite = prompts.doors.doorSud
             this.layer = "above"
            this.offsetX = 16;
            this.offsetY = 17;
            this.offsetW = 0.5
            this.offsetH = 0.5;
            this.hitbox = {
            x: x + this.offsetX,      
            y: y + this.offsetY,
            width: this.w * this.offsetW,
            height: this.h * this.offsetH,
        }
            this.shape = {...this.hitbox} //faccio una copia tanto sono uguali
            
            this.insideShade = false;
        }
        ///questa è l'unica che va disegnata dietro al player
        if (type === "frontNord"){
            this.sprite = prompts.doors.doorSud
             this.layer = "below"
            this.offsetX = 16;
            this.offsetY = 17;
            this.offsetW = 0.5
            this.offsetH = 0.25;
            this.hitbox = {
            x: x + this.offsetX,      // margine interno
            y: y + this.offsetY,
            width: this.w * this.offsetW,
            height: this.h * this.offsetH,
        }
            this.shape = {...this.hitbox} 
            
            this.insideShade = false;
        }
        if(type === "sideEst"){
            this.sprite = prompts.doors.doorEst
             this.layer = "above"
            this.offsetX = 16;
            this.offsetY = 8;
            this.offsetW = 0.1
            this.offsetH = 0.7;
            this.hitbox = {
                x: x + this.offsetX,     
                y: y + this.offsetY,
                width: this.w * this.offsetW,
                height: this.h * this.offsetH,
        }
            this.shape = {...this.hitbox} 
            this.insideShade = false;
        }
        if(type === "sideOvest"){
            this.sprite = prompts.doors.doorOvest
            this.layer = "above" 
            this.offsetX = 42;
            this.offsetY = 5;
            this.offsetW = 0.1;
            this.offsetH = 0.7;
            this.hitbox = {
                x: x + this.offsetX,      
                y: y + this.offsetY,
                width: this.w * this.offsetW,
                height: this.h * this.offsetH,
        }
            this.shape = {...this.hitbox} 
            this.insideShade = false;
        }
        this.state =  [this.frameX = 0,this.maxFrame= 0, this.frameY=0]
        this.isOpen = false //flag chiusura apertura
        
    }
 

}

 // con performance.now(), calcolo il tempo che passa dall'avvio dell'applicazione al momento il cui faccio scattare il trigger. deriva dal TIMESTAMP globale, lo stesso che noi utilizziamo nella funzione del timestamp.


export class HiddenDoor extends Interactable {
    constructor (x, y){
        super (x, y, 128, 128, prompts.hiddenWall, "below", false)
        this.w = 128
        this.h = 128
      
        this.offsetX = 32;
        this.offsetY = 41.5;
        this.offsetW = 0.5;
        this.offsetH = 0.3;
         this.hitbox = {
            x: x + this.offsetX,     
            y: y + this.offsetY,
            width: this.w * this.offsetW,
            height: this.h * this.offsetH,
        }
        this.canInteract = false; 
        this.shape = {...this.hitbox}
        //animation
        this.frameX = 0
        this.frameY = 0
        this.frameTimer = 0
        this.maxFrame = 0
        this.fps = 8;
        this.frameInterval = 0
        //states
        this.isOpen = false;
                
    }
    openHidden(){
        if(this.canInteract && !this.isOpen){
             this.isOpen = true
             this.frameInterval = 1000/this.fps
             this.frameX = 0
             this.maxFrame = 10
            
        }
    }
}


export class Treasure extends Interactable {
    constructor (x,y){
        super(x, y, 64, 64, prompts.treasure, "below", false)
        this.w = 32;
        this.h = 32;
        this.frameX = 0;
        this.offsetX = 6;
        this.offsetY = 6;
        this.offsetW = 0.6
        this.offsetH = 0.5;
         this.hitbox = {
            x: x + this.offsetX,      // margine interno
            y: y + this.offsetY,
            width: this.w * this.offsetW,
            height: this.h * this.offsetH,
        }
        this.canInteract = false; //se devo settare una flag
        this.shape = {...this.hitbox}
    }
    openTreasure(){
         this.frameX = 1
        this.maxFrame = 0;
        this.canInteract = false;

    }

}
export class Keys extends Interactable {
    constructor(x,y, type){
        super(x, y, 32, 32, prompts.key, "below", false)
        this.w = 32;
        this.h = 32;
        this.offsetX = 0;
        this.offsetY = 0;
        this.offsetW = 0.6
        this.offsetH = 0.5;
        this.type = type
        if(type ==="personnel"){
            const storedKey = JSON.parse(localStorage.getItem("personeelKey"))
            
            if(storedKey){
                this.hitbox = storedKey.hitbox
                this.frameY = storedKey.frameY
                this.isCollected = storedKey.isCollected
                this.shape = {...this.hitbox}
             } else {
                this.hitbox = {
                x: x + this.offsetX,      // margine interno
                y: y + this.offsetY,
                width: this.w * this.offsetW,
                height: this.h * this.offsetH,
                },
                this.canInteract = false,
                this.shape = {...this.hitbox},
                this.isCollected = false
             }
        }
        if(type === "library"){
            const libraryKey = JSON.parse(localStorage.getItem("libraryKey"))
            
            if(libraryKey){
                this.hitbox = libraryKey.hitbox
                this.frameY = libraryKey.frameY
                this.isCollected = libraryKey.isCollected
                this.shape = {...this.hitbox}
             } else {
                this.hitbox = {
                x: x + this.offsetX,      // margine interno
                y: y + this.offsetY,
                width: this.w * this.offsetW,
                height: this.h * this.offsetH,
                },
                this.canInteract = false,
                this.shape = {...this.hitbox},
                this.isCollected = false
             }
        }
        if(type === "rooms"){
            const roomsKey = JSON.parse(localStorage.getItem("roomsKey"))
            
            if(roomsKey){
                this.hitbox = roomsKey.hitbox
                this.frameY = roomsKey.frameY
                this.isCollected = roomsKey.isCollected
                this.shape = {...this.hitbox}
             } else {
                this.hitbox = {
                x: x + this.offsetX,      // margine interno
                y: y + this.offsetY,
                width: this.w * this.offsetW,
                height: this.h * this.offsetH,
                },
                this.canInteract = false,
                this.shape = {...this.hitbox},
                this.isCollected = false
             }
        }
        if(type === "torture_chamber"){
            const tortureKey = JSON.parse(localStorage.getItem("torture_chamber"))
            
            if(tortureKey){
                this.hitbox = tortureKey.hitbox
                this.frameY = tortureKey.frameY
                this.isCollected = tortureKey.isCollected
                this.shape = {...this.hitbox}
             } else {
                this.hitbox = {
                x: x + this.offsetX,      // margine interno
                y: y + this.offsetY,
                width: this.w * this.offsetW,
                height: this.h * this.offsetH,
                },
                this.canInteract = false,
                this.shape = {...this.hitbox},
                this.isCollected = false
             }
        }
    
    }

    collectskeys(){
       
        if(this.type === "library" && this.canInteract && !this.isCollected ){ 
            this.collectedKey()
            this.savekey()
            
        }
        if(this.type === "personnel" && this.canInteract && !this.isCollected ){ 
            this.collectedKey()
            this.savekey()
            
        }
        if(this.type === "rooms" && this.canInteract && !this.isCollected ){ 
            this.collectedKey()
            this.savekey()
           
        }
        if(this.type === "torture_chamber" && this.canInteract && !this.isCollected ){ 
           this.collectedKey()
            this.savekey()   
        }
    }
    collectedKey(){
            let inventory = []
         this.isCollected = true
            this.frameY = 1
            this.hitbox = {x:0, y:0, width:0, height:0}
            inventory = JSON.parse(localStorage.getItem("inventory")) || []
            inventory.push(this.type)
            localStorage.setItem("inventory", JSON.stringify(inventory))
    }
    savekey(){
        if(this.isCollected && this.type === "library"){
            const savedLibrary ={
                isCollected : true, 
                frameY : 1,
                hitbox : {x:0, y:0, width:0, height:0}
            }
            localStorage.setItem("libraryKey", JSON.stringify(savedLibrary))
        }
        if(this.isCollected && this.type === "personnel"){
            const savedPersoneel ={
                isCollected : true, 
                frameY : 1,
                hitbox : {x:0, y:0, width:0, height:0}
            }
            localStorage.setItem("personeelKey", JSON.stringify(savedPersoneel))
        }
        if(this.isCollected && this.type === "rooms"){
            const savedRooms ={
                isCollected : true, 
                frameY : 1,
                hitbox : {x:0, y:0, width:0, height:0}
            }
            localStorage.setItem("roomsKey", JSON.stringify(savedRooms))
        }
        if(this.isCollected && this.type === "torture_chamber"){
            const savedTorture ={
                isCollected : true, 
                frameY : 1,
                hitbox : {x:0, y:0, width:0, height:0}
            }
            localStorage.setItem("torture_chamber", JSON.stringify(savedTorture))
        }
    }
}

export class Destructable extends Assets {
    constructor(x, y, width, height, sprite, layer) {
        super(x, y, width, height, sprite, layer, true);

}
     damage(amount) {
    if (this.hp <= 0) return; // già rotto, ignora
    this.hp -= amount;
    if(this.hp <= 0){
        this.hp = 0;
         
    }
}
changeState(){
    if(this.hp <= 0){
       
        this.maxFrame = this.totalFrames
        if(this.frameX >= this.maxFrame) {
            this.frameTimer = 0
            this.frameX = this.totalFrames
            this.hitbox = { x:0, y:0, width:0, height:0}
        }
    }
  
    }

}

export class Vase extends Destructable {
    constructor(x,y){
        super(x, y, 64, 63, prompts.vase, "above", true)
        this.w = 16
        this.h = 16
        this.offsetX = 4;
        this.offsetY = 5;
        this.offsetW = 0.5
        this.offsetH = 0.7;
         this.hitbox = {
            x: x + this.offsetX,      // margine interno
            y: y + this.offsetY,
            width: this.w * this.offsetW,
            height: this.h * this.offsetH,
        }
        this.shape = {...this.hitbox}
        ////essenziali per l'animazione
        this.fps = 8;
        this.frameTimer = 0; 
        this.frameInterval = 1000/this.fps;
        this.hp = 100;
        this.state = [this.frameX = 0,this.frameY = 0, this.maxFrame = 0 ];
        this.aniamationLenght = 0;
        this.totalFrames = 5 //valore che passo aframex, e maxframe
    }
   
        }
export class Barrel extends Destructable{
    constructor(x,y){
        super(x, y, 64, 64, prompts.barrel, "above", true)
        this.w = 64;
        this.h = 64;
        this.offsetX = 24;
        this.offsetY = 29;
        this.offsetW = 0.25;
        this.offsetH = 0.3;
         this.hitbox = {
            x: x + this.offsetX,      // margine interno
            y: y + this.offsetY,
            width: this.w * this.offsetW,
            height: this.h * this.offsetH,
        }
        this.shape = {...this.hitbox}
        //animation
        this.fps = 8;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.fps;
        this.hp = 100;
        this.state = [this.frameX = 0,this.frameY = 0, this.maxFrame = 0 ];
        this.aniamationLenght = 0;
        this.totalFrames = 4;
    }
}