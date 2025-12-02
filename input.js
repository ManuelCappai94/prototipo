//per adesso vado ad hardcodare gli input, ma questi quando 
// implemento un menù opzioni diventeranno variabili selezionabili
export const input = {
    move_up: "w",
    move_down: "s",
    move_left: "a",
    move_right: "d",
    attack: "Space",
    dodge: "shift",
    parry: "e",
    interact: "f"
}

const btnLeft = document.getElementById("btn-left");
const btnRight = document.getElementById("btn-right");
const btnUp = document.getElementById("btn-up");
const btnDown = document.getElementById("btn-down");
const btnAttack = document.getElementById("btn-attack");
const btnInteract = document.getElementById("btn-interact");




export default class InputHandler {
    constructor(){
        this.action = {
            [input.move_up]: false,
            [input.move_down]: false,
            [input.move_left]: false,
            [input.move_right]: false,
            [input.attack]: false,
            [input.dodge]: false,
            [input.parry]: false,
            [input.interact]:false,

        }
      
        window.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() in this.action) this.action[e.key.toLowerCase()] = true
         if(e.code in this.action) this.action[e.code] = true
        
       
    });

        window.addEventListener("keyup", (e)=> {
            // e.preventDefault() 
        if (e.key.toLowerCase() in this.action)  this.action[e.key.toLowerCase()] = false
        if(e.code in this.action) this.action[e.code] = false

    })

   btnLeft.addEventListener("touchstart", (e) => {
    e.preventDefault();
    this.action[input.move_left] = true;
    });
    btnLeft.addEventListener("touchend", (e) => {
        e.preventDefault();
        this.action[input.move_left] = false;
    });
    btnLeft.addEventListener("touchcancel", () => {
        this.action[input.move_left] = false;
    });


    btnRight.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.action[input.move_right] = true;
    });
    btnRight.addEventListener("touchend", (e) => {
        e.preventDefault();
        this.action[input.move_right] = false;
    });
    btnRight.addEventListener("touchcancel", () => {
        this.action[input.move_right] = false;
    });


    btnUp.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.action[input.move_up] = true;
    });
    btnUp.addEventListener("touchend", (e) => {
        e.preventDefault();
        this.action[input.move_up] = false;
    });
    btnUp.addEventListener("touchcancel", () => {
        this.action[input.move_up] = false;
    });


    btnDown.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.action[input.move_down] = true;
    });
    btnDown.addEventListener("touchend", (e) => {
        e.preventDefault();
        this.action[input.move_down] = false;
    });
    btnDown.addEventListener("touchcancel", () => {
        this.action[input.move_down] = false;
    });
}}


