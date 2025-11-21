input.js

//qui creiamo la logica degli input, stavolta useremo una class e dei costruttori, la logica verrà strutturata in modo tale da poter aggiungere e rimuovere tutti i commandi che si vuole

export default class InputHandler {
    constructor(){
        //questo valore verrà aggiornato ogni volta, all'interno di esso vengono storati i valori provenienti dai vari case;
        this.lastKey = " ";
        //guardando nel log per e, vediamo come ha una proprietà key, che registra l'input cliccato; usiamo il switch statement, per creare diversi states; invece delle funzioni normali, usiamo le arrow perchè hanno una speciale particolarità, ovvero che tengono lo scope della funzione dentro al codice della funzione stassa; quindi si evita di dover bindare il valore ogni volta; usare l'arrow permette ad ogni case di targhettizzare ogni volta il this.lastkey = "" property;

        window.addEventListener("keydown", (e) => {
           e.preventDefault();
            switch(e.key) {
                case "w":
                    this.lastKey ="press w";
                    break
                case "s": 
                    this.lastKey = "press s";
                    break
                case "a":
                    this.lastKey ="press a";
                    break
                case "d": 
                    this.lastKey = "press d";
                    break
                // case "space" 
            }
        });
        window.addEventListener("keyup", (e)=> {
            e.preventDefault();
            switch(e.key) {
                case "w":
                    this.lastKey ="relase w";
                    break
                case "s": 
                    this.lastKey = "relase s";
                    break
                case "a":
                    this.lastKey ="relase a";
                    break
                case "d": 
                    this.lastKey = "relase d";
                    break
            }
        });
        window.addEventListener("click", (e) =>{
            console.log(e.altKey)
            switch(e.button) {
                case "mouse left":
                    this.lastKey = "press mouse left"
                    break
            }
        })
        
    }
}

state.js
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
        this.player.frameY = 10;
        this.player.speedy = 0;
        this.player.speedx = 0;
    }
    handleInput(input){
        //associamo all'input la funzione creata in player.js (funzionerebbe anche mettendo direttamente il numero)
        if ( input === "relase w") this.player.setState(states.IDLE_BACK);
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
        this.player.frameY = 11;
        //va messo in meno per andare verso l'alto
        this.player.speedy = -this.player.maxSpeed;
    }
    handleInput(input){
        //inoltre bisogna specificare anche il relase input nell'idle state
        if (input === "press w") this.player.setState(states.RUNNING_BACK);
        else if (input === "press d") this.player.setState(states.RUNNING_RIGHT);
        else if (input === "press s") this.player.setState(states.RUNNING_FRONT);
        else if (input === "press a") this.player.setState(states.RUNNING_LEFT);
        else if (input === "relase w")this.player.setState(states.IDLE_BACK);
        else if (input === "relase s") this.player.setState(states.IDLE_FRONT);
        else if (input === "relase d")this.player.setState(states.IDLE_RIGHT);
        else if (input === "relase a")this.player.setState(states.IDLE_LEFT);

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
        else if (input === "press s") this.player.setState(states.RUNNING_FRONT);
        else if (input === "press a") this.player.setState(states.RUNNING_LEFT);
        else if (input === "press d") this.player.setState(states.RUNNING_RIGHT);
        else if (input === "press w") this.player.setState(states.RUNNING_BACK);
        // else if (input === "relase w")this.player.setState(states.IDLE_BACK);
        // else if (input === "relase d")this.player.setState(states.IDLE_RIGHT);
        // else if (input === "relase a")this.player.setState(states.IDLE_LEFT);

    }
}
export class RunningFront extends State {
    
    constructor(player) {
        super("running front");
        this.player = player;
    }
    enter() {
        this.player.frameY = 2;
        this.player.speedy = this.player.maxSpeed;
    }
    ///nell 'else if vanno specificati anche i bottoni per uscire da quella situazione, perchè se non si rimane incastrati in quella animazione
    handleInput(input){
        if (input === "press s") this.player.setState(states.RUNNING_FRONT);
        else if (input === "relase s") this.player.setState(states.IDLE_FRONT);
        else if (input === "relase w")this.player.setState(states.IDLE_BACK);
        else if (input === "relase d")this.player.setState(states.IDLE_RIGHT);
        else if (input === "relase a")this.player.setState(states.IDLE_LEFT);
        else if (input === "press a") this.player.setState(states.RUNNING_LEFT);
        else if (input === "press d") this.player.setState(states.RUNNING_RIGHT);
        else if (input === "press w") this.player.setState(states.RUNNING_BACK)
    }
}


export class IdleLeft extends State {
    
    constructor(player) {
        super("IDLE LEFT");
        this.player = player;
    }
    enter() {
        this.player.frameY = 3;
        this.player.speedx = 0;
        this.player.speedy = 0;
    }
    handleInput(input){
        if (input === "relase a") this.player.setState(states.IDLE_LEFT);
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
        this.player.frameY = 5;
        this.player.speedx = -this.player.maxSpeed;
    }
    handleInput(input){
        //inoltre bisogna specificare anche il relase input nell'idle state
        if (input === "press a") this.player.setState(states.RUNNING_LEFT);
        else if (input === "relase a")this.player.setState(states.IDLE_LEFT);
        else if (input === "relase d")this.player.setState(states.IDLE_RIGHT);
        else if (input === "relase w")this.player.setState(states.IDLE_BACK);
        else if (input === "relase s") this.player.setState(states.IDLE_FRONT);
        else if (input === "press d") this.player.setState(states.RUNNING_RIGHT);
        else if (input === "press s") this.player.setState(states.RUNNING_FRONT);
        else if (input === "press w") this.player.setState(states.RUNNING_BACK);
    }
}
export class IdleRight extends State {
    
    constructor(player) {
        super("IDLE RIGHT");
        this.player = player;
    }
    enter() {
        this.player.frameY = 6;
        this.player.speedx = 0;
        this.player.speedy = 0;
    }
    handleInput(input){
        if (input === "relase d") this.player.setState(states.IDLE_RIGHT);
         else if (input === "press a") this.player.setState(states.RUNNING_LEFT);
        else if (input === "press d") this.player.setState(states.RUNNING_RIGHT);
        else if (input === "press s") this.player.setState(states.RUNNING_FRONT);
        else if (input === "press w") this.player.setState(states.RUNNING_BACK);
        // else if (input === "relase a")this.player.setState(states.IDLE_LEFT);
        // else if (input === "relase w")this.player.setState(states.IDLE_BACK);
        // else if (input === "relase s") this.player.setState(states.IDLE_FRONT);

    }
}
export class RunningRight extends State {
    
    constructor(player) {
        super("running Left");
        this.player = player;
    }
    enter() {
        this.player.frameY = 8;
           this.player.speedx = this.player.maxSpeed;
           this.player.maxFrames = 3;//se lo spritesheet contiene più frames, modificare questo
    }
    handleInput(input){
        //inoltre bisogna specificare anche il relase input nell'idle state
        if (input === "press d") this.player.setState(states.RUNNING_RIGHT);
        else if (input === "relase d")this.player.setState(states.IDLE_RIGHT);
        else if (input === "relase a")this.player.setState(states.IDLE_LEFT);
        else if (input === "relase w")this.player.setState(states.IDLE_BACK);
        else if (input === "relase s") this.player.setState(states.IDLE_FRONT);
        else if (input === "press a") this.player.setState(states.RUNNING_LEFT);
        else if (input === "press s") this.player.setState(states.RUNNING_FRONT);
        else if (input === "press w") this.player.setState(states.RUNNING_BACK);
    }
}
