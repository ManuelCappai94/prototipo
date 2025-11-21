


const prompts =  {
        tree :  new Image(),
        vase : new Image(),
        treasure: new Image(),
        frame: new Image(),
        doors: {
            doorSud: new Image(),
            doorEst: new Image(),
        },
        
    }


prompts.tree.src = "assets/tree-sprite.png" ///cosi accedo all'immagine dentro all'oggetto;
prompts.vase.src = "assets/vase.png"
prompts.treasure.src = "assets/treasure.png"
prompts.doors.doorSud.src = "assets/doorFrontSud.png"
prompts.doors.doorEst.src = "assets/doorSideLeft.png"
prompts.frame.src= "assets/eye.png"




export default class Assets { //assets non va evocato perchè astratto, le estensioni si!
    constructor(x, y, width, height, sprite, ){
        this.x = x; //posizione
        this.y = y;
        this.width = width; // grandezza, quanto disegno, devo separarlo dall'hitbox
        this.height = height;
        this.sprite = sprite; //immagine
        this.frameX = 0; //definiti separatamente in ogni prompt
        this.frameY = 0;
        this.hp = 0; //definiti per ogni prompt
        this.fps = 0;

 
        
       
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
        if(this.isLooking) {this.startAnimation += deltaTime
            console.log(this.startAnimation)
        }
        }
            
            
        ctx.drawImage(this.sprite, this.width * this.frameX, this.height * this.frameY , this.width, this.height, this.x, this.y, this.w, this.h );
    }

    collisionsObjects(player, enemy){ //questo viene chimato nel loop di gioco assieme a draw;
        const left = this.hitbox.x;
        const right = this.hitbox.x + this.hitbox.width;
        const top = this.hitbox.y;
        const  bottom = this.y + this.hitbox.height;
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
           if (player.speedx > 0) player.x -= player.speedx; 
           //player.x è la posizione orizzontale del player.
            //Se fai player.x -= player.speedx, stai sottraendo la velocità alla posizione, cioè lo sposti indietro.
           //Se il player si muove a destra (speedx > 0) e collide, devi spostarlo indietro della stessa quantità che si sarebbe mosso, altrimenti finirebbe dentro l’oggetto.
            //Se invece stesse andando a sinistra (speedx < 0), faresti player.x -= player.speedx → visto che speedx è negativo, sottrarre un negativo fa +, quindi lo sposti indietro anche verso sinistra.
        if (player.speedx < 0) player.x -= player.speedx; // sta andando a sinistra
        if (player.speedy > 0) player.y -= player.speedy; // sta andando giù
        if (player.speedy < 0) player.y -= player.speedy; // sta andando su
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


   damage(amount) {
    if (this.hp <= 0) return; // già rotto, ignora
    this.hp -= amount;
    let newState;
    if(this.hp <= 0){
        this.hp = 0;
          this.changeState(newState); // ← qui fai partire animazione o sprite del vaso rotto
    }


      
    
   
}
    checkHit(player) {
        const hitbox = player.attackHitbox;
        if(!hitbox)return;

       if ( hitbox.x <  this.hitbox.x + this.hitbox.width && 
            hitbox.x + hitbox.width > this.hitbox.x &&
            hitbox.y < this.y + this.hitbox.height &&
            hitbox.y + hitbox.height > this.hitbox.y
    ){
        this.damage(2);
    }
        
    }
}



export class Tree extends Assets {
    constructor(x, y){
        super(x, y, 115, 128, prompts.tree);
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
        super(x, y, 64, 64, prompts.frame)
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
        this.maxFrame = 5;
        this.frameTimer= 0;
        this.fps = 8;
        this.frameInterval = 1000/this.fps;
        //timer per cambio animazione
        this.startAnimation = 0;
        this.isLooking= false;
        this.proximity = 100;
        
    }
    getdistance(player){
     const vX = player.x - this.x;
     const vY = player.y - this.y;
     const distance = Math.hypot(vX, vY)
     if(distance < this.proximity) this.isLooking = true
    }


}

export class Vase extends Assets {
    constructor(x,y){
        super(x, y, 64, 63, prompts.vase)
        this.w = 16
        this.h = 16
        this.offsetX = 4;
        this.offsetY = 0;
        this.offsetW = 0.5
        this.offsetH = 1;
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
        this.maxFrame = 6; // 7
        this.frameInterval = 1000/this.fps;
        this.hp = 100;
        this.state = [this.frameX = 0,this.frameY = 0, this.maxFrame = 0 ]
     
    }

    changeState(newState){
       
        newState = [this.frameX = 0,this.frameY = 1, this.maxFrame = 6 ];
        this.state = newState;
        setTimeout(() =>{
             newState = [this.frameX = 0,this.frameY = 2, this.maxFrame = 0 ];
             this.state = newState;
             this.hitbox = {x:0, y:0, width:0, height:0}
        },850)
  
    }
 

}

class Interactable extends Assets {
    
    constructor(x, y, width, height, sprite,) {
        super(x, y, width, height, sprite,);
        this.canInteract = false;
        this.animationActive = false; //flag inizio animazioe
        this.isClosing = false; //flag per chiudere
       
      
    }
    interactDoor() {
       
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
}

export class Door extends Interactable {
    
    constructor(x, y, type){
        super(x, y, 64, 64)
        this.w = 64;
        this.h = 64; 
        this.fps = 8;
        this.frameTimer = 0; 
        this.canInteract = false; //questa serve per la prossimità
        this.frameInterval = 1000/this.fps;

        if (type === "frontSud"){
            this.sprite = prompts.doors.doorSud
             
            this.offsetX = 16;
            this.offsetY = 16;
            this.offsetW = 0.5
            this.offsetH = 0.5;
            this.hitbox = {
            x: x + this.offsetX,      // margine interno
            y: y + this.offsetY,
            width: this.w * this.offsetW,
            height: this.h * this.offsetH,
        }
            this.shape = {...this.hitbox} //faccio una copia tanto sono uguali
            console.log(this.shape)
            this.insideShade = false;
        }
        if(type === "sideEst"){
            this.sprite = prompts.doors.doorEst
             
            this.offsetX = 16;
            this.offsetY = 8;
            this.offsetW = 0.1
            this.offsetH = 0.7;
            this.hitbox = {
                x: x + this.offsetX,      // margine interno
                y: y + this.offsetY,
                width: this.w * this.offsetW,
                height: this.h * this.offsetH,
        }
            this.shape = {...this.hitbox} //faccio una copia tanto sono uguali
            console.log(this.shape)
            this.insideShade = false;
        }
        this.state =  [this.frameX = 0,this.maxFrame= 0, this.frameY=0]
        this.isOpen = false //flag chiusura apertura
        
    }
}

 // con performance.now(), calcolo il tempo che passa dall'avvio dell'applicazione al momento il cui faccio scattare il trigger. deriva dal TIMESTAMP globale, lo stesso che noi utilizziamo nella funzione del timestamp.





export class Treasure extends Interactable {
    constructor (x,y){
        super(x, y, 64, 64, prompts.treasure)
        this.w = 16;
        this.h = 16;
        this.frameX = 0;
        this.offsetX = 4;
        this.offsetY = 3;
        this.offsetW = 0.5
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

const eye = new Eye

console.log(eye.isLooking)