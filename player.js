//disegnamo il player qui; creremo un costruttore con le classi
import { tileSize } from "./camera.js";

import { IdleBack, IdleFront, IdleLeft, IdleRight, RunningBack, RunningFront, RunningLeft, RunningRight, AttackBack, AttackFront, AttackLeft, AttackRight} from "./state.js";

export default class Player {
    //player dovrà sapere quando raggiunge i limiti della mappa quindi li passiamo la larghezza e altezza, e con this creiamo tutte le proprietà da attribuirli, visibili con un console.log
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        //creiamo l'array che contiene i vari states, idle , running ecc; 
        ////passare come argomento this, gli farà fare riferimento all'intera class player
        this.states = [new IdleBack(this), new IdleFront(this), new IdleLeft(this), new IdleRight(this), new RunningBack(this), new RunningFront(this), new RunningLeft(this), new RunningRight(this), new AttackBack(this), new AttackFront(this), new AttackLeft(this), new AttackRight(this)]; 
        // creiamo current state perchè player può essere in uno state alla volta
        this.currentState = this.states[1];
        this.image = document.getElementById("playerSprite");
        //settiamo le dimensioni per ogni frame dello spriteSheet e la posizione iniziale; per la dimensione in sprite tengo la misura in px, per la posizione uso i tile
        this.width = 128;
        this.height = 128;
        //controllo dimensioni
        this.w = tileSize*2;
        this.h = tileSize*2;
        //posizione iniziale player
        this.x = tileSize * 38;
        this.y = tileSize * 43;
        /////////////hitbox player, cosi non vengono aggoirnate, meglio scriverle nel getter, prima le avevo scritte qui, ma il valore era legato ad this.x, e gli offset non si aggiornavano
            this.offsetX = 12;
            this.offsetY = 8;
            this.offsetW = 0.3;
            this.offsetH = 0.5;
       
        //creiamo la posizione del frame x e y che poi assegniamo a draw per fargli capire quale disegnare
        this.frameX= 0;
        this.frameY = 0;
        this.maxFrame = 5;//questo valore puo essere aggiustato nello states per ogni azione
        //queste velocità controllano la velocità, andranno poi usate  dentro i metodi enter
        
        // in states.js
        this.speedx = 0;
        this.speedy = 0;
        this.tileSize = tileSize;
        this.maxSpeed =  tileSize* 0.05;
        ///variabili collegate a deltaTime
        this.fps = 8;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.fps; //1000 ms divisi per gli fps
    }
    get hitbox(){
        return {
                x: this.x + this.offsetX,      
                y: this.y + this.offsetY,
                width: this.w * this.offsetW,
                height: this.h * this.offsetH,
        }
    }

    
    ///////////////creiamo la funzione per il disegno//////////////////////////
    ////delta time è stato aggiunto solo dopo che abbiamo aggiunto la funzione; ha bisgono di altre 3 variabili per funzionare, fps, una variabile timer che incrementerà finche non raggiunge un certo valore, e una variabile che decide il valore che vogliamo raggiunga;
    draw(context, deltaTime) {
        //impostiamo un controllo per l'animazione
        if (this.frameTimer > this.frameInterval) {
            if (this.frameX < this.maxFrame)this.frameX++;
        else this.frameX = 0;
        this.frameTimer = 0;
    } else { this.frameTimer += deltaTime; 
    }
    
        context.drawImage(this.image, this.width * this.frameX, this.height * this.frameY , this.width, this.height, this.x, this.y, this.w, this.h )
    }
///////////////////qui crriamo la funzione che aggiornerà gl'input in base a quello che premiamo a cui passiamo handleInput che come argomento prendeva input, così puo fare il check per cosa è stato premuto

    update(input){
        this.currentState.handleInput(input);
        // se esiste l'update, allora chiama la funzione update dentro state.js
        if (this.currentState.update) this.currentState.update();
        //aggiungiamo le velocità orizzontali e verticali
        this.y += this.speedy;
        this.x += this.speedx;
       
    }
    

    setState(state) {
        //che prende come riferimento "this.currentState = this.states[0];" e this.states = []; che per ora è vuoto;
        this.currentState = this.states[state];
        //associamo a currentState enter che swapperà tra i frame
        this.currentState.enter();
    }
}

