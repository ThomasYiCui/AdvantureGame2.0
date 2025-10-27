function Player() {
    this.x = 0;
    this.y = 0;
    this.index = 0;
    this.equippedIndex = 0;
    this.aX = 0;
    this.aY = 0;
    this.swings = [0, 0, 0, 0, 0];
    this.swing = 0;
    this.lvl = 1;
    this.strength = 1;
    this.exp = 0;
    this.size = 20;
    this.health = 10;
    this.maxHealth = 10;
    this.regen = 0.01;
    this.manaRegen = 0.005;
    this.spd = 2;
    this.mana = 5; 
    this.maxMana = 5;
    this.exp = 0;
    //this.exp = 0;
    this.nxtLvlExp = 10;
    this.sp = 0;
    this.r = 0;
    this.equipped = "Basic Sword"
    this.upgrades = {};
}
Player.prototype.draw = function() {
    // health bar
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.fillRect(this.x - this.size, this.y + this.size * 1.3, this.size * 2, this.size * 0.35);
    ctx.fillStyle = "rgb(40, 219, 13)"
    ctx.fillRect(this.x - this.size * 0.95, this.y + this.size * 1.35, this.size * 1.9 * this.health/this.maxHealth, this.size * 0.25);

    // player body
    ctx.fillStyle = "rgb(252, 219, 154)";
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.size, this.size, 0, 0, 2 * Math.PI);
    ctx.fill();
}
Player.prototype.update = function() {
    this.swings = this.swings.slice(0, 4)
    var pr = this.r
    this.r = Math.atan2(canvas.height/2 - mouseY, canvas.width/2 - mouseX)
    this.swings.push(Math.min(Math.abs(pr - this.r), Math.abs(pr + 360 - this.r)));
    this.swing = 0;
    for(let i = 0; i < this.swings.length; i++) {
        this.swing+=this.swings[i]
    }
    this.swing/=this.swings.length;
    if(keys[87] || keys[38]) {
        this.aY-=this.spd;
    } else if(keys[83] || keys[40]) {
        this.aY+=this.spd;
    }
    if(keys[65] || keys[37]) {
        this.aX-=this.spd;
    } else if(keys[68] || keys[39]) {
        this.aX+=this.spd;
    }
    this.x+=this.aX;
    this.y+=this.aY;
    this.index = this.y + this.size;
    this.aX*=0.4;
    this.aY*=0.4
    if(this.health < this.maxHealth) {
        this.health+=this.regen;
    }
    if(this.mana < this.maxMana) {
        this.mana+=this.manaRegen;
    }
    if(this.exp >= this.nxtLvlExp) {
        this.lvl+=1;
        this.exp-=this.nxtLvlExp;
        this.nxtLvlExp+=3 + this.nxtLvlExp * 0.2;
        this.health+=this.maxHealth * 0.1;
        this.mana+=this.maxMana * 0.1;
        this.maxHealth*=1.1;
        this.maxMana*=1.1;
        this.regen*=1.1;
        this.manaRegen*=1.1;
        this.sp+=1 + Math.ceil(this.lvl/5)
    }
    this.health = Math.min(this.health, this.maxHealth)
    this.mana = Math.min(this.mana, this.maxMana);
    hitboxGroups["Player"].hitboxes = {
        "body": {
            x: this.x,
            y: this.y,
            s: this.size,
            refer: this,
            type: "player",
        },
    }
    switch(this.equipped) {
        case "Basic Sword":
            hitboxGroups["Sword"].hitboxes["p1"] = {
                x: this.x - Math.cos(this.r) * this.size * 6/3, 
                y: this.y  - Math.sin(this.r) * this.size * 6/3, 
                s: this.size/3,
                refer: this,
                type: "ally",
            };
            hitboxGroups["Sword"].hitboxes["p2"] = {
                x: this.x - Math.cos(this.r) * this.size * 8/3, 
                y: this.y  - Math.sin(this.r) * this.size * 8/3, 
                s: this.size/2,
                refer: this,
                type: "ally",
            };
            hitboxGroups["Sword"].hitboxes["p3"] = {
                x: this.x - Math.cos(this.r) * this.size * 22/6, 
                y: this.y  - Math.sin(this.r) * this.size * 22/6, 
                s: this.size/2,
                refer: this,
                type: "ally",
            };
            hitboxGroups["Sword"].hitboxes["p4"] = {
                x: this.x - Math.cos(this.r) * this.size * 28/6, 
                y: this.y  - Math.sin(this.r) * this.size * 28/6, 
                s: this.size/2,
                refer: this,
                type: "ally",
            };
            hitboxGroups["Sword"].hitboxes["p5"] = {
                x: this.x - Math.cos(this.r) * this.size * 34/6, 
                y: this.y  - Math.sin(this.r) * this.size * 34/6, 
                s: this.size/2,
                refer: this,
                type: "ally",
            };
            this.equippedIndex = Math.max(this.y - Math.sin(this.r) * (1.5 * this.size) + 15, this.y - Math.sin(this.r) * (6 * this.size) + 15)
            render.push({item: this, index: this.equippedIndex})
        break;
    }
}
Player.prototype.drawEquipped = function() {
    switch(this.equipped) {
        case "Basic Sword":
            ctx.fillStyle = "rgb(252, 219, 154)";
            ctx.beginPath();
            ctx.ellipse(this.x - Math.cos(this.r) * 40, this.y  - Math.sin(this.r) * 40, this.size/3, this.size/3, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.lineWidth = this.size/3;
            ctx.strokeStyle = "rgb(171, 86, 0)"
            ctx.beginPath(); 
            ctx.moveTo(this.x - Math.cos(this.r) * (this.size * 1.5), this.y - Math.sin(this.r) * (this.size * 1.5)); 
            ctx.lineTo(this.x - Math.cos(this.r) * (this.size * 2.5), this.y - Math.sin(this.r) * (this.size * 2.5)); 
            ctx.stroke();
            ctx.lineWidth = this.size * 0.75;
            ctx.beginPath(); 
            ctx.moveTo(this.x - Math.cos(this.r) * (this.size * 2.5), this.y - Math.sin(this.r) * (this.size * 2.5)); 
            ctx.lineTo(this.x - Math.cos(this.r) * (this.size * 2.8), this.y - Math.sin(this.r) * (this.size * 2.8)); 
            ctx.stroke(); 
            ctx.strokeStyle = "rgb(209, 209, 209)"
            ctx.lineWidth = this.size * 0.6;
            ctx.beginPath(); 
            ctx.moveTo(this.x - Math.cos(this.r) * (6.02 * this.size), this.y - Math.sin(this.r) * (6.02 * this.size)); 
            ctx.lineTo(this.x - Math.cos(this.r) * (2.8 * this.size), this.y - Math.sin(this.r) * (2.8 * this.size)); 
            ctx.stroke();

            // tip
            ctx.fillStyle = "rgb(209, 209, 209)"
            ctx.beginPath();
            ctx.moveTo(this.x - Math.cos(this.r) * 6 * this.size - Math.cos(this.r + Math.PI/2) * this.size * 0.3, this.y - Math.sin(this.r) * 6 * this.size - Math.sin(this.r + Math.PI/2) * this.size * 0.3);
            ctx.lineTo(this.x - Math.cos(this.r) * this.size * 6.6, this.y - Math.sin(this.r) * this.size * 6.6);
            ctx.lineTo(this.x - Math.cos(this.r) * 6 * this.size + Math.cos(this.r + Math.PI/2) * this.size * 0.3, this.y - Math.sin(this.r) * 6 * this.size + Math.sin(this.r + Math.PI/2) * this.size * 0.3);
            ctx.fill();
        break
    }
}
