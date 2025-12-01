function Player() {
    this.x = 0;
    this.y = 0;
    this.pX = this.x;
    this.pY = this.y;
    this.index = 0;
    this.equippedIndex = 0;
    this.knockBackRes = 1;
    this.aX = 0;
    this.aY = 0;
    this.armor = 1;
    this.manaArmor = 1;
    this.swings = [0, 0, 0, 0, 0];
    this.swing = 0;
    this.lvl = 1;
    this.strength = 1;
    this.stamina = 5;
    this.maxStamina = 5;
    this.staminaRegen = 0.005;
    this.exp = 0;
    this.size = 20;
    this.health = 10;
    this.maxHealth = 10;
    this.regen = 0.01;
    this.manaRegen = 0.005;
    this.spd = 2;
    this.mana = 5;
    this.maxMana = 5;
    this.gems = 5000;
    this.displayGems = this.gems;
    this.owned = ["Basic Sword"]
    this.spells = ["Mana Pellet"]
    this.exp = 0;
    //this.exp = 0;
    this.nxtLvlExp = 10;
    this.sp = 0;
    this.r = 0;
    this.equipped = "Basic Sword"
    this.skills = {
        "key1": {keycode: 69, spell: "Mana Pellet", cooldown: 0},
        "key2": {keycode: 81, spell: "None", cooldown: 0},
        "key3": {keycode: 70, spell: "None", cooldown: 0},
        "key4": {keycode: 84, spell: "None", cooldown: 0},
    }
    this.upgrades = {};
    this.dashCD = 0;
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
    this.pX = this.x;
    this.pY = this.y;
    if(this.health <= 0) {
        this.x = 0;
        this.y = 0;
        this.health = this.maxHealth;
        this.mana = this.maxMana;
        this.index = 0;
        this.equippedIndex = 0;
        this.aX = 0;
        this.aY = 0;
        this.swings = [0, 0, 0, 0, 0];
        this.swing = 0;
        this.r = 0;
        for(let i = 0; i < props.length; i++) {
            if(props[i].type === "grass") {
                props.splice(i, 1);
                continue;
            }
        }
        for(let i = 0; i < Math.round(canvas.width * canvas.height)/8000; i++) {
            props.push(new prop(-100 - canvas.width/2 + (canvas.width + 200) * Math.random(), -100 - canvas.height/2 + (canvas.width + 200) * Math.random(), "grass"));
        }
    }
    this.swings = this.swings.slice(0, 4)
    var pr = this.r
    this.displayGems+=(this.gems - this.displayGems) * 0.1
    var targetR = Math.atan2(canvas.height/2 - mouseY, canvas.width/2 - mouseX);
    if(this.r > Math.PI) {
        this.r = -Math.PI
    } else if(this.r < -Math.PI) {
        this.r = Math.PI;
    }
    if(Math.min(Math.abs(targetR - this.r), Math.abs(targetR - this.r + Math.PI * 2), Math.abs(targetR - this.r - Math.PI * 2)) < weaponStats[this.equipped].spd/20) {
        this.r = targetR;
    } else if(targetR - this.r < 0 && targetR - this.r > -Math.PI || targetR > 0 && this.r < 0 && Math.abs(targetR) + Math.abs(this.r) > Math.PI) {
        this.r-=weaponStats[this.equipped].spd/20;
    } else {
        this.r+=weaponStats[this.equipped].spd/20;
    }
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
    if(keys[16] && this.upgrades["Dash"] && this.dashCD <= 0) {
        this.dashCD = 50;
    }
    this.stamina = Math.max(Math.min(this.stamina, this.maxStamina), 0);
    if(this.dashCD >= 30 && this.stamina > 0) {
        this.stamina-=0.05;
        this.x-=Math.cos(this.r) * 2 * this.spd
        this.y-=Math.sin(this.r) * 2 * this.spd
        this.aX-=Math.cos(this.r) * 1 * this.spd;
        this.aY-=Math.sin(this.r) * 1 * this.spd
    }
    if(this.dashCD > 0) {
        this.dashCD-=1;
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
    if(this.stamina < this.maxStamina) {
        this.stamina+=this.staminaRegen;
    }
    for(let i in this.skills) {
        let skill = this.skills[i]
        if(skill.keycode === 70 && !this.upgrades["Spell Slot F"] || skill.keycode === 84 && !this.upgrades["Spell Slot T"]) {
            continue;
        }
        if(keys[skill.keycode] && skill.cooldown <= 0) {
            spells[skill.spell].func(this)
            skill.cooldown = spells[skill.spell].reset;
        }
        skill.cooldown-=1;
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
            type: "ally",
        },
    }
    let index = 1;
    while(hitboxGroups["Sword"].hitboxes["p" + index]) {
        hitboxGroups["Sword"].hitboxes["p" + index] = undefined;
        index+=1;
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
        case "Great Sword":
            hitboxGroups["Sword"].hitboxes["p1"] = {
                x: this.x - Math.cos(this.r) * this.size * 2, 
                y: this.y  - Math.sin(this.r) * this.size * 2, 
                s: this.size/3,
                refer: this,
                type: "ally",
            };
            hitboxGroups["Sword"].hitboxes["p2"] = {
                x: this.x - Math.cos(this.r) * this.size * 19/6, 
                y: this.y  - Math.sin(this.r) * this.size * 19/6, 
                s: this.size * 0.75,
                refer: this,
                type: "ally",
            };
            hitboxGroups["Sword"].hitboxes["p3"] = {
                x: this.x - Math.cos(this.r) * this.size * 28/6, 
                y: this.y  - Math.sin(this.r) * this.size * 28/6, 
                s: this.size * 0.75,
                refer: this,
                type: "ally",
            };
            hitboxGroups["Sword"].hitboxes["p4"] = {
                x: this.x - Math.cos(this.r) * this.size * 37/6, 
                y: this.y  - Math.sin(this.r) * this.size * 37/6, 
                s: this.size * 0.75,
                refer: this,
                type: "ally",
            };
            hitboxGroups["Sword"].hitboxes["p5"] = {
                x: this.x - Math.cos(this.r) * this.size * 46/6, 
                y: this.y  - Math.sin(this.r) * this.size * 46/6, 
                s: this.size * 0.75,
                refer: this,
                type: "ally",
            };
            hitboxGroups["Sword"].hitboxes["p6"] = {
                x: this.x - Math.cos(this.r) * this.size * 53/6, 
                y: this.y  - Math.sin(this.r) * this.size * 53/6, 
                s: this.size * 0.5,
                refer: this,
                type: "ally",
            };
            this.equippedIndex = Math.max(this.y - Math.sin(this.r) * (1.5 * this.size) + 15, this.y - Math.sin(this.r) * (6 * this.size) + 15)
            render.push({item: this, index: this.equippedIndex})
        break;
        case "Katana":
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
                s: this.size/4,
                refer: this,
                type: "ally",
            };
            hitboxGroups["Sword"].hitboxes["p3"] = {
                x: this.x - Math.cos(this.r) * this.size * 19/6, 
                y: this.y  - Math.sin(this.r) * this.size * 19/6, 
                s: this.size/4,
                refer: this,
                type: "ally",
            };
            hitboxGroups["Sword"].hitboxes["p4"] = {
                x: this.x - Math.cos(this.r) * this.size * 22/6, 
                y: this.y  - Math.sin(this.r) * this.size * 22/6, 
                s: this.size/4,
                refer: this,
                type: "ally",
            };
            hitboxGroups["Sword"].hitboxes["p5"] = {
                x: this.x - Math.cos(this.r) * this.size * 25/6, 
                y: this.y  - Math.sin(this.r) * this.size * 25/6, 
                s: this.size/4,
                refer: this,
                type: "ally",
            };
            hitboxGroups["Sword"].hitboxes["p6"] = {
                x: this.x - Math.cos(this.r) * this.size * 28/6, 
                y: this.y  - Math.sin(this.r) * this.size * 28/6, 
                s: this.size/4,
                refer: this,
                type: "ally",
            };
            hitboxGroups["Sword"].hitboxes["p7"] = {
                x: this.x - Math.cos(this.r) * this.size * 31/6, 
                y: this.y  - Math.sin(this.r) * this.size * 31/6, 
                s: this.size/4,
                refer: this,
                type: "ally",
            };
            hitboxGroups["Sword"].hitboxes["p8"] = {
                x: this.x - Math.cos(this.r) * this.size * 34/6, 
                y: this.y  - Math.sin(this.r) * this.size * 34/6, 
                s: this.size/4,
                refer: this,
                type: "ally",
            };
            hitboxGroups["Sword"].hitboxes["p9"] = {
                x: this.x - Math.cos(this.r) * this.size * 37/6, 
                y: this.y  - Math.sin(this.r) * this.size * 37/6, 
                s: this.size/4,
                refer: this,
                type: "ally",
            };
            hitboxGroups["Sword"].hitboxes["p10"] = {
                x: this.x - Math.cos(this.r) * this.size * 40/6, 
                y: this.y  - Math.sin(this.r) * this.size * 40/6, 
                s: this.size/4,
                refer: this,
                type: "ally",
            };
            hitboxGroups["Sword"].hitboxes["p11"] = {
                x: this.x - Math.cos(this.r) * this.size * 43/6, 
                y: this.y  - Math.sin(this.r) * this.size * 43/6, 
                s: this.size/4,
                refer: this,
                type: "ally",
            };
            this.equippedIndex = Math.max(this.y - Math.sin(this.r) * (1.5 * this.size) + 15, this.y - Math.sin(this.r) * (8 * this.size) + 15)
            render.push({item: this, index: this.equippedIndex})
        break;
        case "Mace":
            hitboxGroups["Sword"].hitboxes["p1"] = {
                x: this.x - Math.cos(this.r) * this.size * 15/3, 
                y: this.y  - Math.sin(this.r) * this.size * 15/3, 
                s: this.size,
                refer: this,
                type: "ally",
            };
            this.equippedIndex = Math.max(this.y - Math.sin(this.r) * (1.5 * this.size) + 15, this.y - Math.sin(this.r) * (15/3 * this.size) + 15)
            render.push({item: this, index: this.equippedIndex})
        break;
        case "Spear":
            hitboxGroups["Sword"].hitboxes["p1"] = {
                x: this.x - Math.cos(this.r) * this.size * 6.2, 
                y: this.y  - Math.sin(this.r) * this.size * 6.2, 
                s: this.size * 0.4,
                refer: this,
                type: "ally",
            };
            this.equippedIndex = Math.max(this.y - Math.sin(this.r) * (1.5 * this.size) + 15, this.y - Math.sin(this.r) * (15/3 * this.size) + 15)
            render.push({item: this, index: this.equippedIndex})
        break;
    }
}
Player.prototype.drawEquipped = function() {
    drawWeapon(this.x, this.y, this.r, this.size, this.equipped)
}
