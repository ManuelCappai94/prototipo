//qui creiamo la logica degli input, stavolta useremo una class e dei costruttori, la logica verrà strutturata in modo tale da poter aggiungere e rimuovere tutti i commandi che si vuole



export default class InputHandler {
    constructor(){
        //questo valore verrà aggiornato ogni volta, all'interno di esso vengono storati i valori provenienti dai vari case;
        this.lastKey = " ";
        //guardando nel log per e, vediamo come ha una proprietà key, che registra l'input cliccato; usiamo il switch statement, per creare diversi states; invece delle funzioni normali, usiamo le arrow perchè hanno una speciale particolarità, ovvero che tengono lo scope della funzione dentro al codice della funzione stassa; quindi si evita di dover bindare il valore ogni volta; usare l'arrow permette ad ogni case di targhettizzare ogni volta il this.lastkey = "" property;

        window.addEventListener("keydown", (e) => {
        //    e.preventDefault();
        // console.log(e.key)
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
                case "e" :
                    this.lastKey= "press e";
                    break
                case "f" :
                    this.lastKey = "press f"
            }
        });
        window.addEventListener("keyup", (e)=> {
            // e.preventDefault();
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
                case "e" :
                    this.lastKey= "relase e";
                    break
            }
        });
        // window.addEventListener("mousedown", (e) => {
        //     e.preventDefault();
        //     switch(e.button) {
        //         case "mouse left":
        //             this.lastKey = "mouse left";
        //             break
        //     }
        // })
        
    }
}


