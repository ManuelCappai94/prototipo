import Player from "./player.js";
import InputHandler, {input} from "./input.js";
import { drawMap, setMapData, currentMap, collision} from "./maps.js";
import { loadTileMap } from "./maps/Villa/loadMap.js";
import { Eye, Door, Vase, Candle, HiddenDoor, Destructable } from "./assets.js";
import { tileSize } from "./camera.js";
import Camera from "./camera.js";
const btnAttack = document.getElementById("btn-attack")
const btnInteract = document.getElementById("btn-interact");

window.addEventListener("load", function(){
    const loading = document.getElementById("loading");
     loading.style.display = "none"; // ormai inutile, da rifare!
    
    const allCanvas = document.getElementById("game-container")
    const canvas = document.getElementById("gameScenario");
    const entities = document.getElementById("layer-entities-objects")
  
    const layerFx = document.getElementById("layer-fx")
    const layerHud = document.getElementById("layer-hud")

    const ctx = canvas.getContext("2d");
    const ctxEntities = entities.getContext("2d");
   
    const ctxFx = layerFx.getContext("2d");
    const ctxHud = layerHud.getContext("2d");
    

   

    //ora creiamo il costruttore player che in player.js vediamo che aspetta la larghezza e altezza, quindi gli passiamo..
    const player = new Player()
    //chiamiamo la camera creata con il costruttore in camera.js
   
     const camera = new Camera();
    let currentMapData = null;
    let assetsLoaded = false;

  
    canvas.width = camera.resWidth;
    canvas.height = camera.resHeight;
    entities.width = camera.resWidth;
    entities.height = camera.resHeight;
    layerFx.width = camera.resWidth;
    layerFx.height = camera.resHeight;
      


  
        
 //mi ritorna la lunghezza di ogni array presente nel current map
function detectOrientiationScreen(){
    if(window.innerHeight > window.innerWidth){
        document.body.classList.add("rotate");
    } else {
        document.body.classList.remove("rotate");
    }
}
window.addEventListener("resize", detectOrientiationScreen)
    async function startGame() {
       
        currentMapData = await loadTileMap(currentMap.name); 

        setMapData(currentMapData)

        const tileLenght = currentMap.tiles
        const mapWidht = tileLenght[0].length //prima row
        const mapHeight = tileLenght.length
        camera.mapWidth = mapWidht * tileSize;
        camera.mapHeight = mapHeight * tileSize;
       
        assetsLoaded = true;
     
    requestAnimationFrame(animate);
}




function drawTorchLight(ctxFx, camera, deltaTime){
    ctxFx.clearRect(0, 0, layerFx.width, layerFx.height)
    ctxFx.fillStyle = "rgba(0, 0, 0, 0.55)"
    ctxFx.fillRect(0, 0, layerFx.width, layerFx.height);
    // camera.apply(ctxFx);
    ctxFx.globalCompositeOperation = "destination-out";

    currentMap.objects.forEach(obj => {
        if(!obj.isLightSource) return
        obj.randomLight(deltaTime)
        ///centriamo la luce delle candele con la camera, se no segue il player
        const x = obj.x  ;
        const y = obj.y ;

        const gradient = ctxFx.createRadialGradient(
            x, y, obj.lightInner, 
            x, y, obj.lightOuter
        )
        gradient.addColorStop(0, "rgba(0,0,0,1)")
        gradient.addColorStop(1, "rgba(0,0,0,0")
        ctxFx.fillStyle = gradient
        ctxFx.beginPath()
        ctxFx.arc(x, y, obj.lightOuter, 0, Math.PI * 2)
        ctxFx.fill();
        
    })
    ctxFx.globalCompositeOperation = "source-over";
    camera.apply(ctxFx)
}


    
  ////////////////////debug///////////////////////////////////                      
// controllo collisioni
// function drawHitboxes(ctx) {
//     // cicliamo tutti gli oggetti della mappa corrente
//     currentMap.objects.forEach(obj => {
//         ctx.save(); // salviamo lo stato del canvas
//         ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'; // rosso semi-trasparente
//         ctx.lineWidth = 2;
//         // disegniamo un rettangolo nella posizione dell'oggetto
//         ctx.strokeRect(obj.hitbox.x, obj.hitbox.y, obj.hitbox.width, obj.hitbox.height);
//         ctx.restore(); // ripristiniamo lo stato del canvas
//     });
//     currentMap.enemies.forEach(enemy => {
//         ctx.save();
//         ctx.strokeStyle ="rgba(255, 0, 0, 0.6)"
//         ctx.lineWidth = 2;
//         ctx.strokeRect(enemy.hitbox.x, enemy.hitbox.y, enemy.hitbox.width, enemy.hitbox.height)
//         ctx.restore()
//         if(enemy.ginoAtkHbox){
//             ctx.save();
//             ctx.strokeStyle = "red";
//             ctx.lineWidth = 2;
//             ctx.strokeRect(
//                 enemy.ginoAtkHbox.x,
//                 enemy.ginoAtkHbox.y,
//                 enemy.ginoAtkHbox.width,
//                 enemy.ginoAtkHbox.height,
//             )
//             ctx.restore();
//         }
//     });
//     currentMap.triggers.forEach(trigger => {
//         ctx.save()
//         ctx.strokeStyle = 'rgba(229, 236, 25, 0.91)'
//         ctx.lineWidth = 2;
//         ctx.strokeRect(trigger.detectionArea.x, trigger.detectionArea.y, trigger.detectionArea.width, trigger.detectionArea.height )
//         ctx.restore()
//     })

//     ctx.save();
//     ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'; // rosso semi-trasparente
//     ctx.lineWidth = 1;
//     ctx.strokeRect(
//         player.hitbox.x,
//         player.hitbox.y,
//          player.hitbox.width,
//          player.hitbox.height,
//     );
//     if (player.attackHitbox) {
//     ctx.save();
//     ctx.strokeStyle = "red";
//     ctx.lineWidth = 2;
//     ctx.strokeRect(
//         player.attackHitbox.x,
//         player.attackHitbox.y,
//         player.attackHitbox.width,
//         player.attackHitbox.height
//     );
//     ctx.restore();
// }
//         ctx.restore(); // ripristiniamo lo stato del canvas
// }

// function debugAggroRange (ctx){
//     currentMap.enemies.forEach(enemy => {
//         ctx.save()
//         ctx.strokeStyle= enemy.aggro ? "rgba(0, 13, 255, 0.62)": "rgba(7, 222, 7, 0.9)"
//         ctx.lineWidth = 2;
//         ctx.beginPath()
//         ctx.arc(
//             enemy.centerX,
//             enemy.centerY,
//             enemy.aggro ?  enemy.deAggro : enemy.aggroArea,
//             0,
//              Math.PI*2)
//              ctx.stroke()
//              ctx.restore()

//     })
// }

     function drawEntities(ctxEntities, deltatime, camera){
        ctxEntities.clearRect(0, 0, entities.width, entities.height )
          
        
        currentMap.objects
        .filter(obj => obj.layer === "below")
        .forEach( obj => { 
            obj.draw(ctxEntities, deltatime)
            obj.collisionsObjects(player, deltatime)
            obj.checkHit(player, camera)

            if(obj instanceof Eye){
                obj.getdistance(player)
            }
        });

           player.draw(ctxEntities, deltatime);

        currentMap.objects
        .filter(obj => obj.layer === "above")
        .forEach(obj => {
           obj.draw(ctxEntities, deltatime)
           obj.collisionsObjects(player, deltatime)
           obj.checkHit(player, camera)
           if(obj instanceof Destructable){
            obj.changeState()
           }
           
        })

        currentMap.enemies.forEach(enemy => {
            enemy.draw(ctxEntities, deltatime)
            enemy.updateEnemy(player, deltatime)
            enemy.collisions(player, deltatime)
            enemy.checkHit(player, camera)
        });
                   
           camera.apply(ctxEntities); 
        
        }
function triggers(){
    currentMap.triggers.forEach(trigger => {
        trigger.triggerDetection(player)
    })
}
    ////ora che abbiamo la logica degli input, la aggiungiamo qui con un nuova istanza (new):
    const inputs = new InputHandler();
    
    //deve stare fuori dal gameloop se no si ripetono sempre
    document.addEventListener("keyup",() =>{
       if(inputs.action[input.interact]){
        player.interactions(currentMap)
       }
      
     });
    
    document.addEventListener("keydown",(e) =>{
        if (e.repeat) return; // blocca il loop tenendo premuto
        if(e.code === input.attack && !player.isAttacking && !player.isDeath){
           player.startAttack() 
       }
     });

     ///////////duplicazione momentanea del codice, quando avrò il menu opzioni pronto unifichero la gestioni di questi input/////////////////
    
     btnInteract.addEventListener("touchstart", (e) => {
        e.preventDefault()
    if (!player.isDeath) {
        inputs.action[input.interact] = true;
        player.interactions(currentMap);
    }
        });

        btnInteract.addEventListener("touchend", (e) => {
            e.preventDefault()
            inputs.action[input.interact] = false;
        });


        // Touch Attack
        btnAttack.addEventListener("touchstart", (e) => {
            e.preventDefault()
            if (!player.isAttacking && !player.isDeath) {
                inputs.action[input.attack] = true;
                player.startAttack();
            }
        });

        btnAttack.addEventListener("touchend", (e) => {
            e.preventDefault()
            inputs.action[input.attack] = false;
        });
    
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
        
       camera.apply(ctx) 
        camera.follow(player);
        
        drawMap(ctx, camera);
        // drawHitboxes(ctx); // disegno le hitbox sopra
        // debugAggroRange(ctx)
        player.update(inputs, input, deltaTime);
        drawEntities(ctxEntities, deltaTime, camera)
        drawTorchLight(ctxFx, camera, deltaTime)
        collision(player, deltaTime);
        triggers()
       detectOrientiationScreen()
        requestAnimationFrame(animate)
    };
    camera.setZoom(4); 
    startGame()
})

