//qua definiamo i vari state del personaggio, creeremo una nuova classe, scriviamo in enum statment per questioni di leggibilità ovvero STANDING-LEFT: 0, coì invece che scrivere 0, scriviamo il nome in maniera chiara

export const states = {
    IDLE_BACK: 0,
    IDLE_FRONT: 1,
    IDLE_LEFT: 2,
    IDLE_RIGHT: 3,
    RUNNING_BACK: 4,
    RUNNING_FRONT: 5,
    RUNNING_LEFT: 6,
    RUNNING_RIGHT: 7,
    ATTACK_BACK: 8,
    ATTACK_FRONT: 9,
    ATTACK_LEFT: 10,
    ATTACK_RIGHT:11,
   
}

//creiamo una custom class, che ha lo scopo di associare la proprietà state, argomento della funzione alla proprietà di state; nell'esempio lo usa per scrivere gli input a schermo
class State {
    constructor(state){
        this.state = state;
    }
}

//qua invece usiamo extend, che ha lo scopo di creare un child, estendendo una classe creo una rapporto di parentela tra il primo e il secondo elemento; in questo caso idle-left sarà figlio di state.
//  processo chiamato ineritance, dove una classe eredita le proprietà e gli attributi da un altra classe; quindi tutte le classi figlio che creeremo all'interno eredittranno tutte le proprietà e metodi; la classe padre è chiamata anche "super class"; la classe figlio "sub class";

export class IdleBack extends State {
    /////utilizziamo il costuttore con argomento player, cosi da poter usare le sue proprietà e possiamo modificare singolarmente la velocità per ogni animazione
    //il costruttore è eseguito in automatico quando creiamo una nuova istanza per la classe
    constructor(player) {
        /////usiamo super keyword, nel child cosi che possiamo accedere ai metodi del padre; 
        /////super eseguira tutto il codice del padre subito, quindi passandogli poi l'argomento "state", eseguirà la proprietà sotto;
        super("IDLE BACK");
        this.player = player;
    }
    //////creiamo 2 metodi all'internom che hanno lo scopo di inserire l'input e quindi prendere la giusta animazione, queste deve fare solo un ciclo e di tenere l'input andando durante l'animazione, che aspetta diversi input dal giocatore per cambiare lo state
    enter() {
        this.player.frameY = 6;
       
        this.player.speedy = 0;
        this.player.speedx = 0;
    }
    handleInput(input){
        //associamo all'input la funzione creata in player.js (funzionerebbe anche mettendo direttamente il numero)
        if ( input === "relase w") this.player.setState(states.IDLE_BACK);
        else if ( input === "press e") this.player.setState(states.ATTACK_BACK);
        else if (input === "press w")this.player.setState(states.RUNNING_BACK)
        else if (input === "press a") this.player.setState(states.RUNNING_LEFT);
        else if (input === "press d") this.player.setState(states.RUNNING_RIGHT);
        else if (input === "press s") this.player.setState(states.RUNNING_FRONT);
        // else if (input === "relase s") this.player.setState(states.IDLE_FRONT);
        // else if (input === "relase d")this.player.setState(states.IDLE_RIGHT);
        // else if (input === "relase a")this.player.setState(states.IDLE_LEFT);
    }
}
export class RunningBack extends State {
    
    constructor(player) {
        super("running back");
        this.player = player;
    }
    enter() {
        
        this.player.frameY = 7;
        this.player.maxFrames = 4;
        //va messo in meno per andare verso l'alto
        this.player.speedy = -this.player.maxSpeed;
        this.player.speedx = 0;
    }
    handleInput(input){
        //inoltre bisogna specificare anche il relase input nell'idle state
        if (input === "press w") this.player.setState(states.RUNNING_BACK);
        else if ( input === "press e") this.player.setState(states.ATTACK_BACK);
        else if (input === "press d") this.player.setState(states.RUNNING_RIGHT);
        else if (input === "press s") this.player.setState(states.RUNNING_FRONT);
        else if (input === "press a") this.player.setState(states.RUNNING_LEFT);
        else if (input === "relase w")this.player.setState(states.IDLE_BACK);
        // else if (input === "relase s") this.player.setState(states.IDLE_FRONT);
        // else if (input === "relase d")this.player.setState(states.IDLE_RIGHT);
        // else if (input === "relase a")this.player.setState(states.IDLE_LEFT);

    }
}
export class AttackBack extends State {
    constructor(player) {
        super("attack back");
        this.player = player;
    }
    enter() {
        this.player.frameY = 9;
        this.player.frameX = 0;  // Riparte dal primo frame
        this.player.maxFrames = 4; // Se hai 4 frame totali (0,1,2,3)
        this.player.speedx = 0;
        this.player.speedy = 0;

    }
    handleInput(input) {
        // if ( input === "relase e") this.player.setState(states.IDLE_BACK);
    }
    //quest'update mi serve per bloccare un animazione finito il ciclo.
    update(){
          if (this.player.frameX === 1 ) {
                this.player.attackHitbox = {
                    x: this.player.hitbox.x - 5,
                    y: this.player.hitbox.y - 10 ,
                    width: this.player.hitbox.width *2 ,
                    height: this.player.hitbox.height * 0.6 ,
                };
            };
            // Appena frame diverso, disattiva
            if (this.player.frameX !== 1) {
                this.player.attackHitbox = null;
            }
        if (this.player.frameX >= this.player.maxFrames) this.player.setState(states.IDLE_BACK)
    }
}

export class IdleFront extends State {
    
    constructor(player) {
        super("IDLE FRONT");
        this.player = player;
    }
    enter() {
        this.player.frameY = 0;
        this.player.speedy = 0;
        this.player.speedx = 0;
    }
    ///nell 'else if vanno specificati anche i bottoni per uscire da quella situazione, perchè se non si rimane incastrati in quella animazione
    handleInput(input){
        if (input === "relase s") this.player.setState(states.IDLE_FRONT);
        else if ( input === "press e") this.player.setState(states.ATTACK_FRONT);
        else if (input === "press s") this.player.setState(states.RUNNING_FRONT);
        else if (input === "press a") this.player.setState(states.RUNNING_LEFT);
        else if (input === "press d") this.player.setState(states.RUNNING_RIGHT);
        else if (input === "press w") this.player.setState(states.RUNNING_BACK);


    }
}
export class RunningFront extends State {
    
    constructor(player) {
        super("running front");
        this.player = player;
    }
    enter() {
        this.player.frameY = 1;
        // this.player.frameX = 0;
        this.player.maxFrames = 4;
        this.player.speedy = this.player.maxSpeed;
        this.player.speedx = 0;
    }
    ///nell 'else if vanno specificati anche i bottoni per uscire da quella situazione, perchè se non si rimane incastrati in quella animazione
    handleInput(input){
        if (input === "press s") this.player.setState(states.RUNNING_FRONT);
        else if ( input === "press e") this.player.setState(states.ATTACK_FRONT);
        else if (input === "relase s") this.player.setState(states.IDLE_FRONT);
        else if (input === "press a") this.player.setState(states.RUNNING_LEFT);
        else if (input === "press d") this.player.setState(states.RUNNING_RIGHT);
        else if (input === "press w") this.player.setState(states.RUNNING_BACK)
    }
 
}
export class AttackFront extends State {
    constructor(player) {
        super("attack front");
        this.player = player;
    }
    enter() {
        this.player.frameY = 8;
        this.player.frameX = 0;  // Riparte dal primo frame
        this.player.maxFrames = 4; // Se hai 4 frame totali (0,1,2,3)
        this.player.speedx = 0;
        this.player.speedy = 0;

    }
    handleInput(input) {
        // if ( input === "relase e") this.player.setState(states.IDLE_BACK);
    }
    //quest'update mi serve per bloccare un animazione finito il ciclo.
    update(){
             if (this.player.frameX === 1 ) {
                this.player.attackHitbox = {
                    x: this.player.hitbox.x - 5,
                    y: this.player.hitbox.y + this.player.hitbox.height ,
                    width: this.player.hitbox.width * 2  ,
                    height: this.player.hitbox.height* 0.5,
                };
            };
            // Appena frame diverso, disattiva
            if (this.player.frameX !== 1) {
                this.player.attackHitbox = null;
            }
        if (this.player.frameX >= this.player.maxFrames) this.player.setState(states.IDLE_FRONT)
    }
}

export class IdleLeft extends State {
    
    constructor(player) {
        super("IDLE LEFT");
        this.player = player;
    }
    enter() {
        this.player.frameY = 2;
        this.player.speedx = 0;
        this.player.speedy = 0;
    }
    handleInput(input){
        if (input === "relase a") this.player.setState(states.IDLE_LEFT);
        else if ( input === "press e") this.player.setState(states.ATTACK_LEFT);
        else if (input === "press a") this.player.setState(states.RUNNING_LEFT);
        else if (input === "press d") this.player.setState(states.RUNNING_RIGHT);
        else if (input === "press s") this.player.setState(states.RUNNING_FRONT);
        else if (input === "press w") this.player.setState(states.RUNNING_BACK);
        // else if (input === "relase s") this.player.setState(states.IDLE_FRONT);
        // else if (input === "relase w")this.player.setState(states.IDLE_BACK);
        // else if (input === "relase d")this.player.setState(states.IDLE_RIGHT);

    }
}
export class RunningLeft extends State {
    
    constructor(player) {
        super("running Left");
        this.player = player;
    }
    enter() {
        this.player.frameY = 3;
        this.player.speedx = -this.player.maxSpeed;
        this.player.speedy = 0;
    }
    handleInput(input){
        //inoltre bisogna specificare anche il relase input nell'idle state
        if (input === "press a") this.player.setState(states.RUNNING_LEFT);
        else if (input === "relase a")this.player.setState(states.IDLE_LEFT);
        else if ( input === "press e") this.player.setState(states.ATTACK_LEFT);
        else if (input === "press d") this.player.setState(states.RUNNING_RIGHT);
        else if (input === "press s") this.player.setState(states.RUNNING_FRONT);
        else if (input === "press w") this.player.setState(states.RUNNING_BACK);
    }
}
export class AttackLeft extends State {
    constructor(player) {
        super("attack left");
        this.player = player;
    }
    enter() {
        this.player.frameY = 10;
        this.player.frameX = 0;  // Riparte dal primo frame
        this.player.maxFrames = 4; // Se hai 4 frame totali (0,1,2,3)
        this.player.speedx = 0;
        this.player.speedy = 0;

    }
    handleInput(input) {
        // if ( input === "relase e") this.player.setState(states.IDLE_BACK);
    }
    //quest'update mi serve per bloccare un animazione finito il ciclo.
    update(){
                if (this.player.frameX === 1 ) {
                this.player.attackHitbox = {
                    x: this.player.hitbox.x - this.player.hitbox.width ,
                    y: this.player.hitbox.y ,
                    width: this.player.hitbox.width  ,
                    height: this.player.hitbox.height ,
                };
            };
            // Appena frame diverso, disattiva
            if (this.player.frameX !== 1) {
                this.player.attackHitbox = null;
            }
        if (this.player.frameX >= this.player.maxFrames) this.player.setState(states.IDLE_LEFT)
    }
}
export class IdleRight extends State {
    
    constructor(player) {
        super("IDLE RIGHT");
        this.player = player;
    }
    enter() {
        this.player.frameY = 4;
        this.player.speedx = 0;
        this.player.speedy = 0;
    }
    handleInput(input){
        if (input === "relase d") this.player.setState(states.IDLE_RIGHT);
        else if ( input === "press e") this.player.setState(states.ATTACK_RIGHT);
        else if (input === "press a") this.player.setState(states.RUNNING_LEFT);
        else if (input === "press d") this.player.setState(states.RUNNING_RIGHT);
        else if (input === "press s") this.player.setState(states.RUNNING_FRONT);
        else if (input === "press w") this.player.setState(states.RUNNING_BACK);
 

    }
}
export class RunningRight extends State {
    
    constructor(player) {
        super("running Left");
        this.player = player;
    }
    enter() {
        this.player.frameY = 5;
           this.player.speedx = this.player.maxSpeed;
           this.player.speedy = 0;
           this.player.maxFrames = 3;//se lo spritesheet contiene più frames, modificare questo
    }
    handleInput(input){
        //inoltre bisogna specificare anche il relase input nell'idle state
        if (input === "press d") this.player.setState(states.RUNNING_RIGHT);
        else if (input === "relase d")this.player.setState(states.IDLE_RIGHT);
        else if ( input === "press e") this.player.setState(states.ATTACK_RIGHT);
        else if (input === "press a") this.player.setState(states.RUNNING_LEFT);
        else if (input === "press s") this.player.setState(states.RUNNING_FRONT);
        else if (input === "press w") this.player.setState(states.RUNNING_BACK);
    }
}
export class AttackRight extends State {
    constructor(player) {
        super("attack right");
        this.player = player;
           ////hitbox di attacco
        
    }
    enter() {
        this.player.frameY = 11;
        this.player.frameX = 0;  // Riparte dal primo frame
        this.player.maxFrames = 4; // Se hai 4 frame totali (0,1,2,3)
        this.player.speedx = 0;
        this.player.speedy = 0;
        this.player.hasHit = false;
        
        //gestione frame hitbox
      
        //  this.player.attackHitbox = {
        //     x: this.player.x + this.player.w, //posizione iniziale + larghezza
        //     y: this.player.y + 8 ,
        //     width:this.player.w *0.5,
        //     height: this.player.h *0.5,
        
             
    // }

    }
    handleInput(input) {
     
    }
    //quest'update mi serve per bloccare un animazione finito il ciclo.
    update(){
          // Frame in cui colpisce (esempio frameX === 1)
            if (this.player.frameX === 1 ) {
                this.player.attackHitbox = {
                    x: this.player.hitbox.x + this.player.hitbox.width,
                    y: this.player.hitbox.y ,
                    width: this.player.hitbox.width ,
                    height: this.player.hitbox.height ,
                };
                // this.player.hasHit = true; // evita hit multipli nello stesso frame
            }

            // Appena frame diverso, disattiva
            if (this.player.frameX !== 1) {
                this.player.attackHitbox = null;
             
            }

            if (this.player.frameX >= this.player.maxFrames) {
                this.player.attackHitbox = null; //cancella dopo l'attacco
               
                this.player.setState(states.IDLE_RIGHT)
            }
    }
}
