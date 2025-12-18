//disegnamo il player qui; creremo un costruttore con le classi
import { tileSize } from "../camera/camera.js";
import { Door, HiddenDoor, Keys } from "../assets/assets.js";

export default class Player {

    constructor(gameWidth, gameHeight){
        const storedPosition = JSON.parse(localStorage.getItem("player position"))
        
       const storedX = storedPosition? storedPosition.x : null
       const  storedY = storedPosition? storedPosition.y : null
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.image = document.getElementById("playerSprite");
        //settiamo le dimensioni per ogni frame dello spriteSheet e la posizione iniziale; per la dimensione in sprite tengo la misura in px, per la posizione uso i tile
        this.width = 128;
        this.height = 128;
        //controllo dimensioni
        this.w = tileSize*2;
        this.h = tileSize*2;
        //posizione iniziale player
        this.x =  storedX? storedX : tileSize * 38;
        this.y =  storedY? storedY: tileSize * 42;
        /////////////hitbox player, cosi non vengono aggoirnate, meglio scriverle nel getter, prima le avevo scritte qui, ma il valore era legato ad this.x, e gli offset non si aggiornavano
            this.offsetX = 12;
            this.offsetY = 8;
            this.offsetW = 0.3;
            this.offsetH = 0.5;
        //creiamo la posizione del frame x e y che poi assegniamo a draw per fargli capire quale disegnare
        this.frameX= 0;
        this.frameY = 0;
        this.maxFrame = 5;
       //movement
        this.speedx = 0;
        this.speedy = 0;
        this.tileSize = tileSize;
        this.maxSpeed =  tileSize*8;
        ///variabili collegate a deltaTime
        this.fps = 8;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.fps; //1000 ms divisi per gli fps
        //states
        this.isAttacking = false;
       
        this.playerHp = 100;
        this.isDeath = false;
        this.prevState = null; //mi serve per resettare le animazioni
        this.lastDirection = "down" //la inizializzo per poi passarla agli idol

        //test inventario
        this.inventory = JSON.parse(localStorage.getItem("inventory")) || []
        //messages
        this.deathMessageShown = false
    }
    get hitbox(){
        return {
                x: this.x + this.offsetX,      
                y: this.y + this.offsetY,
                width: this.w * this.offsetW,
                height: this.h * this.offsetH,
        }
    }
    get centerX(){
        return this.x + this.w * 0.5
    }
     get centerY(){
        return this.y + this.h * 0.5;
    }
    playerStates(){
          if(this.state !== this.prevState){ //framex 0 ad ogni cambio di animazione
            this.frameX = 0;
            this.prevState = this.state
        }

        switch(this.state){
            case "idleUp":
                this.frameY = 6;
                this.maxFrame = 4;
                break
            case "moveUp":
                this.frameY = 7;
                this.maxFrame = 5;
                break
            case "idleDown":
                this.frameY = 0;
                this.maxFrame = 5;
                break
            case "moveDown":
                this.frameY = 1;
                this.maxFrame = 5;
                break
            case "idleLeft":
                this.frameY = 2;
                this.maxFrame = 5;
                break
            case "moveLeft":
                this.frameY = 3;
                this.maxFrame = 5;
                break
            case "idleRight":
                this.frameY = 4;
                this.maxFrame = 5;
                break
            case "moveRight":
                this.frameY = 5;
                this.maxFrame = 5
                break
            case "death":
                this.frameY = 13;
                this.maxFrame = 7;
                break
            case "attackUp":
                this.frameY = 9;
                this.maxFrame = 4;
                break
            case "attackDown":
                this.frameY = 8;
                this.maxFrame = 4;
                break
            case "attackRight":
                this.frameY = 11;
                this.maxFrame = 4;
                break
            case "attackLeft":
                this.frameY = 10;
                this.maxFrame = 4;
                break
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

    movePlayer(input, action, deltatime){
        const dt = deltatime/1000
        if(this.isAttacking) return

        //importante che i valori di speedx e speedy siano resettati qua
        this.speedx= 0;
        this.speedy = 0;
 
        if(input.action[action.move_up]) {
            this.speedy = -this.maxSpeed;  
            this.state = "moveUp"   
            this.lastDirection = "Up" 
        } 
        if(input.action[action.move_down]) {
            this.speedy = this.maxSpeed;
          this.state = "moveDown"
          this.lastDirection = "Down"
        } 
        if(input.action[action.move_left]) {
            this.speedx = -this.maxSpeed;
           this.state = "moveLeft"
           this.lastDirection = "Left"
        }  
        if(input.action[action.move_right]) {
            this.speedx = this.maxSpeed;
            this.state = "moveRight"
            this.lastDirection = "Right"
        }

        if( !input.action[action.move_up] && !input.action[action.move_down] && !input.action[action.move_left] && !input.action[action.move_right]) {
            this.state = `idle${this.lastDirection}`
        }
        //devo normalizzare la diagonale perchè se no speedx e speedy si sommano in 
        //|V| = √(speedX² + speedY²) teorema di pitagora, velocità totoale => ipotenusa
        // per correggere la velocità devo normalizzare il vettore e portarlo alla stessa lunghezza di prima => 1 / √2 ≈ 0.707
        
        if (this.speedx !== 0 && this.speedy !== 0) {
            const diagonalModifier = 1 / Math.sqrt(2);
            this.speedx *= diagonalModifier;
            this.speedy *= diagonalModifier;
        }
        
        this.y += this.speedy * dt;
        this.x += this.speedx * dt;
    }

    interactions( currentMap){
            currentMap.objects.forEach(obj => {
                if(obj.canInteract && typeof obj.openTreasure === "function" ){
                    obj.openTreasure()
                    console.log("ciao")
                }
                if(obj.canInteract && obj instanceof Door){
                    obj.interactDoor(this)
                 
                }
                if(obj.canInteract && obj instanceof HiddenDoor){
                obj.openHidden()
               }
                if(obj.canInteract && obj instanceof Keys && !this.isCollected){
                    obj.collectskeys()
                    obj.createMessage()
                   
                    console.log(this.inventory)
                }
            })
    }
    //non deve stare nel gameLoop, evento singolo
    startAttack(){
        if(this.isAttacking || this.isDeath ) return
            this.isAttacking = true
    }
    playerAttacks(){
        if(this.isAttacking){
            
            this.state = `attack${this.lastDirection}` //cosi prende la direzione giusta
            this.maxSpeed = 0
        }
        
        if(this.isAttacking && this.frameX >= this.maxFrame){
            this.isAttacking = false;
            this.state = `idle${this.lastDirection}`
            this.maxSpeed= tileSize*8
        }
       
        }
    playerAttackHitbox(){
        if(this.isAttacking){
            if(this.state ===  "attackUp"){
                if (this.frameX === 1 ) {
                this.attackHitbox = {
                    x: this.hitbox.x - 5,
                    y: this.hitbox.y - 10 ,
                    width: this.hitbox.width *2 ,
                    height: this.hitbox.height * 0.6 ,
                };
            };
            // Appena frame diverso, disattiva
            if (this.frameX !== 1) {
                this.attackHitbox = null;
            }
            } else if (this.state ==="attackDown"){
                if (this.frameX === 1 ) {
                this.attackHitbox = {
                    x: this.hitbox.x - 5,
                    y: this.hitbox.y + this.hitbox.height ,
                    width: this.hitbox.width * 2  ,
                    height: this.hitbox.height* 0.5,
                };
            };
            if (this.frameX !== 1) this.attackHitbox = null;
            }
            else if (this.state ==="attackLeft"){
                if (this.frameX === 1 ) {
                this.attackHitbox = {
                    x: this.hitbox.x - this.hitbox.width,
                    y: this.hitbox.y,
                    width: this.hitbox.width ,
                    height: this.hitbox.height,
                };
            };
            if (this.frameX !== 1) this.attackHitbox = null;
            }
            else if (this.state ==="attackRight"){
                if (this.frameX === 1 ) {
                this.attackHitbox = {
                    x: this.hitbox.x + this.hitbox.width,
                    y: this.hitbox.y,
                    width: this.hitbox.width ,
                    height: this.hitbox.height,
                };
            };
            if (this.frameX !== 1) this.attackHitbox = null;
            }
            
        }
    }
    playerDeath(){
        if(this.playerHp <= 0) {
            this.state = "death"
            this.isDeath = true
            this.maxSpeed = 0
        }
  
        if (this.isDeath && !this.deathMessageShown) {
        this.createMessage();
        this.deathMessageShown = true;
    }


        if(this.isDeath && this.frameX >= this.maxFrame){
           this.frameX = 7
            this.maxFrame = 0
            this.frameTimer = 0 
        }
      
    }
        createMessage(){
            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent); //by chat gpt
            const textContainer = document.querySelector(".text-container")
            
            const div = document.createElement("div")
            div.classList.add("avvisi")
            const message = document.createElement("span")
            message.classList.add("text")
           

            if(isMobile){
                message.textContent = `YOU DIED ! press reset to start a new game`
            } else {
                message.textContent = `YOU DIED ! press p to start a new game`
            }
            
            div.appendChild(message)
            textContainer.appendChild(div)
            
        

        }


    update(input, action, deltatime){
        
        this.movePlayer(input, action, deltatime)
        this.playerAttacks()
        this.playerAttackHitbox()
        this.playerDeath()

        this.playerStates()
        
       
    }
    
}

