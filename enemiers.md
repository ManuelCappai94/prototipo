moveEnemy(player, deltaTime){
     
        const enemyPositionX = this.x, enemyPositionY = this.y 
        const playerPositionX = player.x , playerPositionY= player.y 
        //vettore che punta al nemico
        const vettoreX = playerPositionX - enemyPositionX
        const vettoreY = playerPositionY - enemyPositionY
        //distanza (calcolo ipotenusa) = sqrt(a*b + c*d)
        const distance = Math.hypot(vettoreX, vettoreY)
        //soglia di arrivo per bloccarlo prima di toccare lo sprite
        const arriveRadius = 20;      // in pixel
            //normalizza la direzione, trasforma il vettore in unità di direzione
            const dirX = vettoreX / distance
            const dirY = vettoreY/ distance
            //applico velocità e deltatime
            const speed = this.maxSpeeed
            const spawnDistance = Math.hypot(this.spawnX - this.x, this.spawnY - this.y);
        if(!this.aggro && distance <= this.aggroArea) this.aggro = true;
        if(this.aggro && distance > this.deAggro) this.aggro= false;
        if(this.aggro) {
             if(distance < arriveRadius ){
                 if (dirX < 0) return this.state = "attack_left"
                 if (dirX > 0) return this.state = "attack_right"
            } 
            this.x += dirX * speed * deltaTime
            this.y += dirY * speed * deltaTime 
           if(dirX < 0 ) this.state = "move_left"        
           if(dirX > 0 ) this.state = "move_right"        
        } else {
            if(distance > 110){
                // const spawnDistance = Math.hypot(this.spawnX - this.x, this.spawnY - this.y)
                const dx = this.spawnX - this.x;
                const dy = this.spawnY - this.y;
                this.x += (dx / this.returnToIdle) * speed *deltaTime
                this.y += ( dy / this.returnToIdle) * speed *deltaTime
               if(dx / this.returnToIdle > 0 ) this.state = "move_left"        
                if(dy / this.returnToIdle < 0 ) this.state = "move_right"
            }
               if(spawnDistance < 5) {
                return this.state = "idle_left" 
            }}}