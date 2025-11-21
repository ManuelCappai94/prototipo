import Player from "./player.js";
import InputHandler from "./input.js";
import {currentMap, collision,  updateMap} from "./maps.js";
import { tileSize } from "./camera.js";
import {  scale, MAP_HEIGHT, MAP_WIDTH } from "./camera.js";
import Camera from "./camera.js";

const hp = document.querySelector(".hp")


// import { drawStatusText } from "./utils.js";


//INIZIAMO CON L'AGGIUNGERE GLI EVENTI CHE VOGLIAMO SI VERIFICHINO AL CARICMANETO DELLA PAGINA
window.addEventListener("load", function(){
    const loading = document.getElementById("loading");
    //quindi finche la pagina non è caricata mostrerà il titolo loading
    loading.style.display = "none";
    const canvas = document.getElementById("gameScenario");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //ora creiamo il costruttore player che in player.js vediamo che aspetta la larghezza e altezza, quindi gli passiamo..
    const player = new Player(canvas.width, canvas.height)
    //chiamiamo la camera creata con il costruttore in camera.js
    const camera = new Camera(canvas.width, canvas.height, MAP_WIDTH, MAP_HEIGHT);
    


    document.addEventListener("keyup",(e) =>{
      
         if (e.key === "f"){
            currentMap.objects.forEach(obj => {
                if(obj.canInteract && typeof obj.openTreasure === "function" ){
                    obj.openTreasure()
                    console.log("ciao")
                }
              
                if(obj.canInteract && typeof obj.interactDoor === "function"){
                    obj.interactDoor()
                   
                    console.log("aperto")
                }
            }
               
            )
        }
     });
                        
                    




    
    function drawMap() {
        ctx.drawImage(currentMap.img, 0, 0);
    
}

// controllo collisioni
function drawHitboxes(ctx) {
    // cicliamo tutti gli oggetti della mappa corrente
    currentMap.objects.forEach(obj => {
        ctx.save(); // salviamo lo stato del canvas
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'; // rosso semi-trasparente
        ctx.lineWidth = 2;
        // disegniamo un rettangolo nella posizione dell'oggetto
        ctx.strokeRect(obj.hitbox.x, obj.hitbox.y, obj.hitbox.width, obj.hitbox.height);
        ctx.restore(); // ripristiniamo lo stato del canvas
    });
    currentMap.enemies.forEach(enemy => {
        ctx.save();
        ctx.strokeStyle ="rgba(255, 0, 0, 0.6)"
        ctx.lineWidth = 2;
        ctx.strokeRect(enemy.hitbox.x, enemy.hitbox.y, enemy.hitbox.width, enemy.hitbox.height)
        ctx.restore()
    })

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'; // rosso semi-trasparente
    ctx.lineWidth = 1;
    ctx.strokeRect(
        player.hitbox.x,
        player.hitbox.y,
         player.hitbox.width,
         player.hitbox.height,
    );
    if (player.attackHitbox) {
    ctx.save();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(
        player.attackHitbox.x,
        player.attackHitbox.y,
        player.attackHitbox.width,
        player.attackHitbox.height
    );
    ctx.restore();
}
        ctx.restore(); // ripristiniamo lo stato del canvas
}

function debugAggroRange (ctx){
    currentMap.enemies.forEach(enemy => {
        ctx.save()
        ctx.strokeStyle= enemy.aggro ? "rgba(0, 13, 255, 0.62)": "rgba(7, 222, 7, 0.9)"
        ctx.lineWidth = 2;
        ctx.beginPath()
        ctx.arc(
            enemy.centerX,
            enemy.centerY,
            enemy.aggro ?  enemy.deAggro : enemy.aggroArea,
            0,
             Math.PI*2)
             ctx.stroke()
             ctx.restore()

    })
}

    

    ////ora che abbiamo la logica degli input, la aggiungiamo qui con un nuova istanza (new):
    const input = new InputHandler();

    ///////////////////////////////////////////////////////////////////////////////////////
    //deltaTime time! serve a regolare il framerate; in caso questo manca il framerate si baserà al refrasheRate dello schermo un ciclo ad ogni frame;
    // lastTIme che sarà il valore di timestamp dal loop precedente;
    ///il timestamp è un API fornita dal browser come il math e setInterval, gestito nativamente da JS
    let lastTime= 0;

    //////creiamo la funzione per l'animazione al cui interno usiamo il metodo requestAnimationFrame(); 
    function animate(timeStamp){
        ctx.clearRect( 0,0, canvas.width, canvas.height);
        //quindi diventa time stamp di questo loop meno il time stamp del loop precedente;
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp; 
        //qua chiamiamo la funzione per l'input upate,  e li passiamo lastkey da input.js:
        drawMap();
        updateMap(player);
        currentMap.objects.forEach(obj => {
            obj.draw(ctx, deltaTime)
            obj.collisionsObjects(player)
            // obj.hp = obj.maxHp;
            obj.checkHit(player)
            // obj.doorOpened()
            hp.textContent=`${obj.hp}`
        });
        currentMap.enemies.forEach(enemy => {
            enemy.draw(ctx, deltaTime)
           
            // enemy.enemyDistancefromPlayer(player.x, player.y, enemy.x, enemy.y)
            enemy.updateEnemy(player, deltaTime)
            enemy.collisions(player)
            enemy.checkHit(player)
           
        })
        drawHitboxes(ctx); // disegno le hitbox sopra
        debugAggroRange(ctx)
        camera.follow(player);
        camera.apply(ctx);
        player.update(input.lastKey);
        //aggiungiamo a player la funzione draw, e come argomento il contesto 2d; va messo qua dentro perchè se no clearReact lo cancellerebbe dopo un frame
        ////aggiungiamo anche il deltatime a player.draw, come argomento; dobbiamo essere sicuri che anche il draw in player.js aspetti quell'argomento e aggiungiamo variabili nell'istanza player in player.js
        player.draw(ctx, deltaTime);
        // drawStatusText(ctx, input, player);
        // console.log(input.lastKey); //con questo vediamo gli input come descritti
        collision(player);
        requestAnimationFrame(animate)
    };

    // ctx.scale(scale, scale)
    camera.setZoom(6); // 2x ingrandimento
    //mettiamo 0 perchè requestAnimationFrames, auto genera dal secondo loop
    animate(0);
})

