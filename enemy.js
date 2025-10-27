function Enemy(x, y, type, id) {
    this.x = x;
    this.y = y;
    this.target = null;
    this.aX = 0;
    this.aY = 0;
    this.type = type;
    this.size = 20;
    this.r = 0;
    this.id = id;
    this.health = 100;
    this.maxHealth = 100;
    this.index = 0;
    this.options = {};
    switch(this.type) {
        case "Goblin":
            this.size = 17;
            this.knockBackRes = 40;
            this.equipped = "Basic Sword"
            this.health = 18;
            this.maxHealth = 18;
            this.giveExp = 1.5;
            this.spd = 1;
            this.strength = 0.5;
            this.strafing = false;
            if(Math.random() < 0.5) {
                this.strafeFactor = -1;
            } else {
                this.strafeFactor = 1;
            }
            this.strafe = -50 + 100 * Math.random();
            this.movementType = "slash"
            this.swings = [0, 0, 0, 0, 0];
            this.swing = 0;
        break;
        case "Slime":
            this.health = 14;
            this.maxHealth = 14;
            this.knockBackRes = 20;
            this.giveExp = 1;
            this.spd = 3;
            this.size = 13;
            this.dmg = 2;
            this.bounceRate = Math.round(100 * Math.random());
            this.hitCD = 0;
            this.resetHitCD = 20;
            this.movementType = "bounce"
            this.options = {"dmgOnCollide": true}
        break;
    }
}
Enemy.prototype.draw = function() {
    switch(this.type) {
        case "Goblin":
            // health bar
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.fillRect(this.x - this.size, this.y + this.size * 1.3, this.size * 2, this.size * 0.35);
            ctx.fillStyle = "rgb(219, 0, 0)"
            ctx.fillRect(this.x - this.size * 0.95, this.y + this.size * 1.35, this.size * 1.9 * this.health/this.maxHealth, this.size * 0.25);
            
            // body
            ctx.fillStyle = "rgb(245, 5, 5)";
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.size, this.size, 0, 0, 2 * Math.PI);
            ctx.fill();
            this.index = this.y + this.size;
        break;
        case "Slime":
            ctx.fillStyle = "rgb(245, 5, 5)";
            ctx.beginPath();
            ctx.ellipse(this.x, this.y + this.size * 0.7, this.size, this.size * 1.5, 0, Math.PI, 0);
            ctx.fill();
            
            // health bar
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.fillRect(this.x - this.size, this.y + this.size * 1.3, this.size * 2, this.size * 0.35);
            ctx.fillStyle = "rgb(219, 0, 0)"
            ctx.fillRect(this.x - this.size * 0.95, this.y + this.size * 1.35, this.size * 1.9 * this.health/this.maxHealth, this.size * 0.25);
            this.index = this.y + this.size;
        break;
    }
}
Enemy.prototype.findTarget = function() {
    if(dist(player.x, player.y, this.x, this.y) < 300) {
        return player;
    }
}
Enemy.prototype.update = function() {
    this.x+=this.aX;
    this.y+=this.aY;
    this.aX*=1 - this.knockBackRes/100;
    this.aY*=1 - this.knockBackRes/100;
    if(!this.target) {
        this.target = this.findTarget();
    }
    switch(this.movementType) {
        case "slash":
            if(this.target) {
                if(this.strafing) {
                    this.strafe+=1 + Math.random() * 2 * (51 - this.strafe)/20;
                    if(this.strafe > 50 && dist(this.x, this.y, this.target.x, this.target.y) < (75 + this.size * 2 + this.target.size * 2)) {
                        this.strafing = false;
                    }
                } else {
                    this.strafe-=1 + Math.random() * 2 * (51 + this.strafe)/20;
                    if(this.strafe < -50 && dist(this.x, this.y, this.target.x, this.target.y) < (75 + this.size * 2 + this.target.size * 2)) {
                        this.strafing = true;
                    }
                }
                if(this.strafe <= 0) {
                    this.r = Math.atan2(this.y - this.target.y, this.x - this.target.x) + Math.min(-Math.PI/2 + Math.PI/2 * (1 - Math.abs(this.strafe)/50), Math.PI/2)
                } else {
                    this.r = Math.atan2(this.y - this.target.y, this.x - this.target.x) + Math.min(Math.PI/2 * Math.abs(this.strafe)/50, Math.PI/2)
                }
                var distance = dist(this.target.x, this.target.y, this.x, this.y);
                if(distance > this.target.size * 2 + 20 + Math.abs(this.strafe)) {
                    if(this.x < this.target.x) {
                        this.aX+=this.spd
                    }
                    if(this.x > this.target.x) {
                        this.aX-=this.spd
                    }
                    if(this.y < this.target.y) {
                        this.aY+=this.spd
                    }
                    if(this.y > this.target.y) {
                        this.aY-=this.spd
                    }
                } else if(distance < this.target.size * 2 + 15 + Math.abs(this.strafe)) {
                    if(this.x < this.target.x) {
                        this.aX-=this.spd
                    }
                    if(this.x > this.target.x) {
                        this.aX+=this.spd
                    }
                    if(this.y < this.target.y) {
                        this.aY-=this.spd
                    }
                    if(this.y > this.target.y) {
                        this.aY+=this.spd
                    }
                }
            }
        break;
        case "bounce":
            if(this.hitCD > 0) {
                this.hitCD-=1;
            }
            if(this.target) {
                r = Math.atan2(this.target.y - this.y, this.target.x - this.x);
                if(this.bounceRate >= 100) {
                    if(dist(this.target.x, this.target.y, this.x, this.y) >= (this.size + this.target.size) * 2 + 100) {
                        this.aX = Math.cos(r) * this.spd * 4;
                        this.aY = Math.sin(r) * this.spd * 4;
                    } else {
                        this.aX = Math.cos(r + (-Math.PI/4, Math.PI/4)) * this.spd * 4;
                        this.aY = Math.sin(r + Math.PI/4, Math.PI/4) * this.spd * 4;
                    }
                    this.bounceRate = 0;
                } else {
                    this.bounceRate+=1;
                }
            }
        break;
    }
    switch(this.type) {
        case "Goblin":
            hitboxGroups["Sword"].hitboxes[this.id + "1"] = {
                x: this.x - Math.cos(this.r) * this.size * 6/3, 
                y: this.y  - Math.sin(this.r) * this.size * 6/3, 
                s: this.size/3,
                refer: this,
                type: "enemy",
            };
            hitboxGroups["Sword"].hitboxes[this.id + "2"] = {
                x: this.x - Math.cos(this.r) * this.size * 8/3, 
                y: this.y  - Math.sin(this.r) * this.size * 8/3, 
                s: this.size/2,
                refer: this,
                type: "enemy",
            };
            hitboxGroups["Sword"].hitboxes[this.id + "3"] = {
                x: this.x - Math.cos(this.r) * this.size * 22/6, 
                y: this.y  - Math.sin(this.r) * this.size * 22/6, 
                s: this.size/2,
                refer: this,
                type: "enemy",
            };
            hitboxGroups["Sword"].hitboxes[this.id + "4"] = {
                x: this.x - Math.cos(this.r) * this.size * 28/6, 
                y: this.y  - Math.sin(this.r) * this.size * 28/6, 
                s: this.size/2,
                refer: this,
                type: "enemy",
            };
            this.equippedIndex = Math.max(this.y - Math.sin(this.r) * (1.5 * this.size) + 15, this.y - Math.sin(this.r) * (6 * this.size) + 15)
            render.push({item: this, index: this.equippedIndex})
        break;
    }
    hitboxGroups["Enemies"].hitboxes[this.id] = {
        x: this.x,
        y: this.y,
        s: this.size,
        type: "enemy",
        refer: this,
        options: this.options
    }
}
Enemy.prototype.drawEquipped = function() {
    switch(this.equipped) {
        case "Basic Sword":
            ctx.fillStyle = "rgb(219, 0, 0)"
            // hand
            ctx.beginPath();
            ctx.ellipse(this.x - Math.cos(this.r) * 30, this.y  - Math.sin(this.r) * 30, this.size/3, this.size/3, 0, 0, 2 * Math.PI);
            ctx.fill();
            
            // sword
            ctx.lineWidth = 7;
            ctx.strokeStyle = "rgb(171, 86, 0)"
            ctx.beginPath(); 
            ctx.moveTo(this.x - Math.cos(this.r) * (this.size * 1.3), this.y - Math.sin(this.r) * (this.size * 1.3)); 
            ctx.lineTo(this.x - Math.cos(this.r) * (this.size * 2.5), this.y - Math.sin(this.r) * (this.size * 2.5)); 
            ctx.stroke();
            ctx.lineWidth = 20;
            ctx.beginPath(); 
            ctx.moveTo(this.x - Math.cos(this.r) * (this.size * 2.5), this.y - Math.sin(this.r) * (this.size * 2.5)); 
            ctx.lineTo(this.x - Math.cos(this.r) * (this.size * 2.8), this.y - Math.sin(this.r) * (this.size * 2.8)); 
            ctx.stroke(); 
            ctx.strokeStyle = "rgb(209, 209, 209)"
            ctx.lineWidth = 12;
            ctx.beginPath(); 
            ctx.moveTo(this.x - Math.cos(this.r) * (5.02 * this.size), this.y - Math.sin(this.r) * (5.02 * this.size)); 
            ctx.lineTo(this.x - Math.cos(this.r) * (2.8 * this.size), this.y - Math.sin(this.r) * (2.8 * this.size)); 
            ctx.stroke();
            
            
            // tip
            ctx.fillStyle = "rgb(209, 209, 209)"
            ctx.beginPath();
            ctx.moveTo(this.x - Math.cos(this.r) * 5 * this.size - Math.cos(this.r + Math.PI/2) * this.size * 0.3, this.y - Math.sin(this.r) * 5 * this.size - Math.sin(this.r + Math.PI/2) * this.size * 0.3);
            ctx.lineTo(this.x - Math.cos(this.r) * this.size * 5.6, this.y - Math.sin(this.r) * this.size * 5.6);
            ctx.lineTo(this.x - Math.cos(this.r) * 5 * this.size + Math.cos(this.r + Math.PI/2) * this.size * 0.3, this.y - Math.sin(this.r) * 5 * this.size + Math.sin(this.r + Math.PI/2) * this.size * 0.3);
            ctx.fill();
        break;
    }
}
Enemy.prototype.die = function() {
    if(this.health <= 0) {
        player.exp+=this.giveExp;
        delete hitboxGroups["Enemies"].hitboxes[this.id]
        delete hitboxGroups["Sword"].hitboxes[this.id + "1"]
        delete hitboxGroups["Sword"].hitboxes[this.id + "2"]
        delete hitboxGroups["Sword"].hitboxes[this.id + "3"]
        delete hitboxGroups["Sword"].hitboxes[this.id + "4"]
        return true;
    }
    return false;
}
