import Player from "./player.js";
import InputHandler from "./input.js";
import { drawMap, setMapData, currentMap, collision} from "./maps.js";
import { loadTileMap } from "./maps/Villa/loadMap.js";
import { Eye, Door, Vase, Candle } from "./assets.js";
import {resolution_width, resolution_height, MAP_HEIGHT, MAP_WIDTH } from "./camera.js";
import Camera from "./camera.js";


window.addEventListener("load", function(){
    const loading = document.getElementById("loading");
    //quindi finche la pagina non è caricata mostrerà il titolo loading
    loading.style.display = "none";
    const allCanvas = document.getElementById("game-container")
    const canvas = document.getElementById("gameScenario");
    const entities = document.getElementById("layer-entities-objects")
  
    const layerFx = document.getElementById("layer-fx")
    const layerHud = document.getElementById("layer-hud")

    const ctx = canvas.getContext("2d");
    const ctxEntities = entities.getContext("2d");
   
    const ctxFx = layerFx.getContext("2d");
    const ctxHud = layerHud.getContext("2d");
    

    canvas.width = resolution_width;
    canvas.height = resolution_height;
    entities.width = resolution_width
    entities.height = resolution_height

    //ora creiamo il costruttore player che in player.js vediamo che aspetta la larghezza e altezza, quindi gli passiamo..
    const player = new Player()
    //chiamiamo la camera creata con il costruttore in camera.js
    const camera = new Camera(resolution_width, resolution_height, MAP_WIDTH, MAP_HEIGHT);
    
    
    let currentMapData = null;
        let assetsLoaded = false;

    async function startGame() {
        currentMapData = await loadTileMap(currentMap.name);

        setMapData(currentMapData)
        assetsLoaded = true;
    requestAnimationFrame(animate);


}



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
        if(enemy.ginoAtkHbox){
            ctx.save();
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.strokeRect(
                enemy.ginoAtkHbox.x,
                enemy.ginoAtkHbox.y,
                enemy.ginoAtkHbox.width,
                enemy.ginoAtkHbox.height,
            )
            ctx.restore();
        }
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

     function drawEntities(ctxEntities, deltatime, camera){
        ctxEntities.clearRect(0, 0, entities.width, entities.height )
          

        currentMap.objects
        .filter(obj => obj.layer === "below")
        .forEach( obj => { 
            obj.draw(ctxEntities, deltatime)
            obj.collisionsObjects(player)
            obj.checkHit(player)

            if(obj instanceof Eye){
                obj.getdistance(player)
            }
        });

           player.draw(ctxEntities, deltatime);

        currentMap.objects
        .filter(obj => obj.layer === "above")
        .forEach(obj => {
           obj.draw(ctxEntities, deltatime)
           obj.collisionsObjects(player)
           obj.checkHit(player)
        })

        currentMap.enemies.forEach(enemy => {
            enemy.draw(ctxEntities, deltatime)
            enemy.updateEnemy(player, deltatime)
            enemy.collisions(player)
            enemy.checkHit(player)
        });
                   
            camera.apply(ctxEntities);
        
        }
function triggers(){
    currentMap.triggers.forEach(trigger => {
        trigger.triggerDetection(player)
    })
}
    ////ora che abbiamo la logica degli input, la aggiungiamo qui con un nuova istanza (new):
    const input = new InputHandler();

    ///////////////////////////////////////////////////////////////////////////////////////
    //deltaTime time! serve a regolare il framerate; in caso questo manca il framerate si baserà al refrasheRate dello schermo un ciclo ad ogni frame;
    // lastTIme che sarà il valore di timestamp dal loop precedente;
    ///il timestamp è un API fornita dal browser come il math e setInterval, gestito nativamente da JS
    let lastTime= 0;
    function animate(timeStamp){
        if(!assetsLoaded){
            requestAnimationFrame(animate)
            return
        } 
        ctx.clearRect( 0,0, canvas.width, canvas.height);
        //quindi diventa time stamp di questo loop meno il time stamp del loop precedente;
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp; 
        drawMap(ctx, camera);
        drawHitboxes(ctx); // disegno le hitbox sopra
        debugAggroRange(ctx)
        player.update(input.lastKey);
        drawEntities(ctxEntities, deltaTime, camera)
        camera.apply(ctx)
        camera.follow(player);
        collision(player);
        triggers()
        console.log(player.x)
        requestAnimationFrame(animate)
    };
    camera.setZoom(4); 
    startGame()
})

