import Player from "./player.js";
import { tileSize } from "./camera.js";



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
    collisions (player, deltatime){
         const dt = deltatime/1000;
        const left = this.hitbox.x;
        const right = this.hitbox.x + this.hitbox.width;
        const top = this.hitbox.y;
        const  bottom = this.y + this.hitbox.height + 15; //il problema sta nell'offset
        const playerleft = player.hitbox.x  ;
        const playerright = player.hitbox.x + player.hitbox.width;
        const playertop = player.hitbox.y;
        const playerbottom = player.hitbox.y + player.hitbox.height;
     
        if ( playerleft < right && playerright > left && playerbottom > top && playertop < bottom) {
        if (player.speedx > 0) player.x -= player.speedx *dt; 
        if (player.speedx < 0) player.x -= player.speedx *dt; // sta andando a sinistra
        if (player.speedy > 0) player.y -= player.speedy *dt; // sta andando giù
        if (player.speedy < 0) player.y -= player.speedy *dt; // sta andando su
        if (this.dirX > 0) this.x -= this.dirX * dt ;
        if (this.dirX < 0) this.x -= this.dirX * dt
        if (this.dirY > 0) this.y -= this.dirY * dt
        if (this.dirY < 0 ) this.y -= this.dirY * dt
        // console.log(this.dirX)
    }}
    checkHit(player, camera){
            const atkHitbox = player.attackHitbox;
            const enHitbox = this.ginoAtkHbox
        // if(!atkHitbox || !enHitbox)return;
        
    if(atkHitbox){
        if ( atkHitbox.x <  this.hitbox.x + this.hitbox.width && 
            atkHitbox.x + atkHitbox.width > this.hitbox.x &&
            atkHitbox.y < this.hitbox.y + this.hitbox.height  &&
            atkHitbox.y + atkHitbox.height  > this.hitbox.y
        ){
            this.damage(25);
            camera.shake(50, 1)
        }
        }
    if(enHitbox){
        if( enHitbox.x < player.hitbox.x + player.hitbox.width &&
            enHitbox.x + enHitbox.width > player.hitbox.x &&
            enHitbox.y < player.hitbox.y + player.hitbox.height &&
            enHitbox.y + enHitbox.height > player.hitbox.y
        ){
            this.damageToPlayer(35, player)
            camera.shake(30, 5)
        }
        }
     


    }
       damage(amount) {
    if (this.hp <= 0) return; 
        if(!this.invulnerable){
            this.hp -= amount;
            this.invulnerable = true;
            this.invulTimer = 0;
        }
    }
    ////rifattorizzare in player.js, per renderla riuttiliizabile (forse, a ,emp che decido di rendere le trappole come nemici)
    damageToPlayer(amount, player){
        if (player.playerHp <= 0) return;
        if(!this.invulnerable){
            player.playerHp -= amount;
            this.invulnerable = true;
            this.invulTimer = 0
        }
        
    }

}


export class Gino extends Enemies {
    constructor(x, y){
        super(x, y, 96, 96, enemies.gino, false, 140,  220)
        this.w = 64;
        this.h = 64;
        //animation
        // this.frameX = 0;
        this.fps = 8;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.fps;
        //movement
        this.speedx = 0;
        this.speedy = 0;
        this.maxSpeeed = 7 * tileSize;
        this.spawnX = this.x;
        this.spawnY = this.y;
        this.returnToIdle = 70 // più è alto più rallenta
        //////state//////
        this.isMoving = false;
        this.isAttacking = false;
        this.prevState = null; //mi serve per resettare l'animazione a 0
        ///inizializzo le variabii di movimento
        this.distance = null;
        this.dirX = null;
        this.dirY = null;
        this.arriveRadius = 30;
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
        this.hp = 80;
        this.coolDown = 500 //ms     
        this.attackTimer = 0
        this.canAttackAgain = true;
        this.animationlenght = 0
        //damage logic
        this.invulnerable = false;
        this.invulDuration = 500; 
        this.invulTimer = 0;
    }
    get centerX(){
    return this.x + this.w * 0.5;
    }

    get centerY(){
        return this.y + this.h * 0.5;
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
        case "attack_top":
            this.frameY = 3;
            this.maxFrame = 8;
            break;
        case "attack_bottom":
            this.frameY = 16;
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
    

    enemyAggro(){ 
        if(!this.aggro && this.distance <= this.aggroArea) this.aggro = true;
        if(this.aggro && this.distance > this.deAggro) this.aggro= false;
    }

    enemyMovment(deltaTime){
        const dt = deltaTime/1000;
        if(this.aggro){
            if(this.distance < this.arriveRadius ) return
            if(this.isAttacking) {
                this.isMoving = false
                return
            }

                this.isMoving = true;
                this.x += this.dirX * this.maxSpeeed * dt;
                this.y += this.dirY * this.maxSpeeed * dt;
                this.state = this.dirX > 0? "move_right" : "move_left" 
              
            
        }else if (!this.aggro) this.state = this.dirX < 0? "idle_right" : "idle_left";
    }    


    enemyReturnToBase(deltaTime){
        const dt = deltaTime/1000;
          if(this.isMoving && this.distance > 150){
                this.x += this.spawnDirX * this.maxSpeeed * dt
                this.y += this.spawnDirY * this.maxSpeeed * dt
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

 

    enemyAttack(){
        if (this.distance < this.arriveRadius && !this.isAttacking && this.canAttackAgain) {
          
            this.isAttacking = true; 
            this.attackTimer = 0;
            if (Math.abs(this.dirX) > Math.abs(this.dirY)) {
                    // direzione orizzontale dominante
                    this.state = this.dirX > 0 ? "attack_right" : "attack_left";
                } else {
                    // direzione verticale dominante
                    this.state = this.dirY > 0 ? "attack_bottom" : "attack_top";
                }
                console.log(Math.abs(this.dirX),Math.abs(this.dirY) )
    }
   
          
            
            if(this.state === "attack_left"){
                if(this.frameX === 2){
                    this.ginoAtkHbox = {
                    x: this.hitbox.x - this.hitbox.width,
                    y: this.hitbox.y ,
                    width: this.hitbox.width ,
                    height: this.hitbox.height ,
                }}
                if(this.frameX !==2){
                    this.ginoAtkHbox = null
                }
            
                if(this.frameX >= this.maxFrame) {
                    this.ginoAtkHbox = null
                    this.isAttacking = false   
                    this.canAttackAgain = false;
                    this.frameX = 0;
                    this.state = this.dirX > 0 ? "idle_right" : "idle_left";
                }
               
            }
            if(this.state === "attack_right"){
                if(this.frameX === 2){
                    this.ginoAtkHbox = {
                    x: this.hitbox.x + this.hitbox.width,
                    y: this.hitbox.y ,
                    width: this.hitbox.width ,
                    height: this.hitbox.height ,
                    
                }}
                if(this.frameX !==2){
                    this.ginoAtkHbox = null
                }
            
                if(this.frameX >= this.maxFrame ){
                    this.ginoAtkHbox = null 
                    this.isAttacking = false
                     this.canAttackAgain = false;
                     this.frameX = 0;
                     this.state = this.dirX > 0 ? "idle_right" : "idle_left";
                }}
            if(this.state === "attack_top"){
                if(this.frameX === 2){
                    this.ginoAtkHbox = {
                    x: this.hitbox.x -6 ,
                    y: this.hitbox.y + 11 - this.hitbox.height  ,
                    width: this.hitbox.width *1.8,
                    height: this.hitbox.height * 0.5 ,
                }}
                if(this.frameX !==2){
                    this.ginoAtkHbox = null
                }
            
                if(this.frameX >= this.maxFrame) {
                    this.ginoAtkHbox = null
                    this.isAttacking = false   
                    this.canAttackAgain = false;
                    this.frameX = 0;
                    this.state = this.dirX > 0 ? "idle_right" : "idle_left";
                }
               
            }
            if(this.state === "attack_bottom"){
                if(this.frameX === 2){
                    this.ginoAtkHbox = {
                    x: this.hitbox.x -6 ,
                    y: this.hitbox.y + 5 + this.hitbox.height  ,
                    width: this.hitbox.width *1.8,
                    height: this.hitbox.height * 0.5 ,
                }}
                if(this.frameX !==2){
                    this.ginoAtkHbox = null
                }
            
                if(this.frameX >= this.maxFrame) {
                    this.ginoAtkHbox = null
                    this.isAttacking = false   
                    this.canAttackAgain = false;
                    this.frameX = 0;
                    this.state = this.dirX > 0 ? "idle_right" : "idle_left";
                }
               
            }
              
              
        }

        attackCooldown(deltatime){
            if(!this.canAttackAgain)
              this.attackTimer += deltatime
            if(this.attackTimer >= this.coolDown)this.canAttackAgain = true
        }

        updateEnemy(player, deltatime){
        
        const {distance, dirX, dirY} = this.enemyDistancefromPlayer(player.centerX, player.centerY, this.centerX, this.centerY);
            this.distance = distance;
            this.dirX = dirX;
            this.dirY = dirY;

        this.enemyAggro()
        this.enemyMovment(deltatime)
        const {dist, distX, distY} = this.enemySpawnDistance(this.x, this.y);
            this.spawnDistance = dist;
            this.spawnDirX = distX;
            this.spawnDirY = distY;
        this.attackCooldown(deltatime)
        this.enemyAttack()

        if (this.invulnerable) {
            this.invulTimer += deltatime;
            if (this.invulTimer >= this.invulDuration) {
                this.invulnerable = false;
            }
        }
        
        this.enemyDeath(deltatime)
        this.enemyReturnToBase(deltatime)
        this.enemyStates()
    

    }
    
}





