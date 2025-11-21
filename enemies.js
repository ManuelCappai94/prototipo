import Player from "./player.js";


const enemies ={
    gino : new Image(),
    carlo : new Image(),
}
enemies.gino.src = "enemies/Minotaur.png"



export default class Enemies {
    constructor(x, y, width, height, sprite, aggro, aggroArea, deAggro){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.frameX=0
        this.frameY = 0;
        this.sprite = sprite
        this.aggro = aggro
        this.aggroArea = aggroArea
        this.deAggro = deAggro

    }
    draw(ctx, deltaTime){
       if (this.frameTimer > this.frameInterval) {
        if (this.frameX < this.maxFrame)this.frameX++;
            else this.frameX = 0;
                this.frameTimer = 0;
            } else { this.frameTimer += deltaTime; 
            } 
        ctx.drawImage(this.sprite, this.width * this.frameX, this.height * this.frameY , this.width, this.height, this.x, this.y, this.w, this.h );
    }
    collisions (player ){
        const left = this.hitbox.x;
        const right = this.hitbox.x + this.hitbox.width;
        const top = this.hitbox.y;
        const  bottom = this.y + this.hitbox.height + 15; //il problema sta nell'offset
        const playerleft = player.hitbox.x  ;
        const playerright = player.hitbox.x + player.hitbox.width;
        const playertop = player.hitbox.y;
        const playerbottom = player.hitbox.y + player.hitbox.height;
     
        if ( playerleft < right && playerright > left && playerbottom > top && playertop < bottom) {
        if (player.speedx > 0) player.x -= player.speedx; 
        if (player.speedx < 0) player.x -= player.speedx; // sta andando a sinistra
        if (player.speedy > 0) player.y -= player.speedy; // sta andando giù
        if (player.speedy < 0) player.y -= player.speedy; // sta andando su
        if (this.dirX > 0) this.x -= this.dirX * 0.5 //il numero non deve essere troppo piccolo perchè se no si rompe
        if (this.dirX < 0) this.x -= this.dirX * 0.5
        if (this.dirY > 0) this.y -= this.dirY * 0.5
        if (this.dirY < 0 ) this.y -= this.dirY * 0.5
        // console.log(this.dirX)
    }}
    checkHit(player){
            const hitbox = player.attackHitbox;
        if(!hitbox)return;

       if ( hitbox.x <  this.hitbox.x + this.hitbox.width && 
            hitbox.x + hitbox.width > this.hitbox.x &&
            hitbox.y < this.y + this.hitbox.height + 15 &&
            hitbox.y + hitbox.height  > this.hitbox.y
    ){
        this.damage(2);
        console.log(this.hp)
    }
    }
       damage(amount) {
    if (this.hp <= 0) return; 
    this.hp -= amount;
    
    }

}


export class Gino extends Enemies {
    constructor(x, y){
        super(x, y, 96, 96, enemies.gino, false, 80,  90)
        this.w = 64;
        this.h =64;
        //animation
        // this.frameX = 0;
        this.fps = 8;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.fps;
        //movement
        this.speedx = 0;
        this.speedy = 0;
        this.maxSpeeed = 0.06;
        this.spawnX = this.x;
        this.spawnY = this.y;
        this.returnToIdle = 70 // più è alto più rallenta
        //////state//////
        this.isMoving = false;
        this.isAttacking = false;
        this.isIdle = false;
        this.prevState = null; //mi serve per resettare l'animazione a 0
        ///inizializzo le variabii di movimento
        this.distance = null;
        this.dirX = null;
        this.dirY = null;
        this.arriveRadius = 20;
        //varibili ritorno a casa
        this.spawnDistance = null; //con questo posso decidere il limite di aggro
        this.spawnDirX = null;
        this.spawnDirY = null;
        ///hitbox
        this.offsetX = 20;
        this.offsetY = 15;
        this.offsetH = 0.4;
        this.offsetW = 0.3;
        /// enemy behaviour
        this.hp = 20;
        this.coolDown = 2000 //ms     
        this.animationlenght = 0
    }
    get centerX(){
    return this.x + this.w / 2.5;
    }

    get centerY(){
        return this.y + this.h / 2.5;
    }
    //bisogna chiamarla dentro ad un metodo con get, per ottenere i valori aggiornati
    get hitbox () {
       if(this.hp > 0) return  {
            x: this.x + this.offsetX,      
            y: this.y + this.offsetY,
            width: this.w * this.offsetW,
            height: this.h * this.offsetH,
        } 
        else {
            return {
                x: 0,
                y:0,
                width:0,
                height: 0,
            }
        }
    }

    enemyStates(){
        if(this.state !== this.prevState){ //framex 0 ad ogni cambio di animazione
            this.frameX = 0;
            this.prevState = this.state
        }

       switch(this.state){
        case "idle_right":
           
            this.frameY = 0;
            this.maxFrame = 4;
            break;
        case "idle_left":
         
            this.frameY = 10;
            this.maxFrame = 4;
            break;
        case "move_right":
            this.frameY = 1;
            this.maxFrame = 7;
            break;
        case "attack_right":
            this.frameY = 3;
            this.maxFrame = 8;
            break;
        case "death":
           
            this.frameY = 19;
            this.maxFrame = 5;
            // this.hitbox = null;
            break;
        case "move_left":
            this.frameY = 11;
            this.maxFrame = 7;
            break;
        case "attack_left":
            this.frameY = 13;
            this.maxFrame = 8;
            break;
        
       }

    }
    //calcolo distanza //
    enemyDistancefromPlayer(ax, ay, bx, by){
        const vectorX = ax - bx;
        const vectorY = ay - by;
        const distance = Math.hypot(vectorX, vectorY);
        const dirX = vectorX/distance;
        const dirY = vectorY/distance;   
            return{
                distance,
                dirX,
                dirY,
            }
        }

    enemySpawnDistance(eX, eY){
        const vX =  this.spawnX - eX , vY =  this.spawnY - eY 
        const dist = Math.hypot(vX, vY)
        return {
            dist,
            distX: vX/dist,
            distY: vY/dist,
        }

    }
        //destrutturo i valori ottenuti nella funzione precedente dentro update, cosi non mischio roba e gli assoccio ai this!
    updateEnemy(player, deltatime){
        this.enemyStates()
        const {distance, dirX, dirY} = this.enemyDistancefromPlayer(player.x, player.y, this.centerX, this.centerY);
            this.distance = distance;
            this.dirX = dirX;
            this.dirY = dirY;

        this.enemyAggro()
        this.enemyMovment(deltatime)
        const {dist, distX, distY} = this.enemySpawnDistance(this.x, this.y);
            this.spawnDistance = dist;
            this.spawnDirX = distX;
            this.spawnDirY = distY;
        this.enemyDeath(deltatime)

        this.enemyReturnToBase(deltatime)
    }

    enemyAggro(){ 
        if(!this.aggro && this.distance <= this.aggroArea) this.aggro = true;
        if(this.aggro && this.distance > this.deAggro) this.aggro= false;
    }

    enemyMovment(deltaTime){
        if(this.aggro){
            if(this.distance < this.arriveRadius ) {
                return this.state = this.dirX > 0? "idle_right" : "idle_left"
            }
            this.isMoving = true;
                this.x += this.dirX * this.maxSpeeed * deltaTime;
                this.y += this.dirY * this.maxSpeeed * deltaTime;
                this.state = this.dirX > 0? "move_right" : "move_left";
       
        }else if (!this.aggro) this.state = this.dirX < 0? "idle_right" : "idle_left";
    }    


    enemyReturnToBase(deltaTime){
          if(this.isMoving && this.distance > 150){
                this.x += this.spawnDirX * this.maxSpeeed* deltaTime
                this.y += this.spawnDirY * this.maxSpeeed * deltaTime
                this.state = this.dirX < 0? "move_right" : "move_left";    
                if(this.spawnDistance < 5){
                    this.isMoving = false;
                }
            }
            
    }
    enemyDeath (deltaTime){
        if(this.hp <= 0){
            this.animationlenght += deltaTime;
            this.hp = 0;
            this.isMoving = false;
            this.aggroArea = 0;
            this.deAggro =  0;
            this.state = "death"
            this.maxSpeeed = 0
        if(this.animationlenght >= 500)
            this.frameTimer = 0
      
        }
        
    }

}





const gino = new Gino

console.log(gino)