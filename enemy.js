function Enemy(x, y, type, id, team, opt) {
    this.x = x;
    this.y = y;
    this.pX = this.x;
    this.pY = this.y;
    this.team = team;
    this.target = null;
    this.aX = 0;
    this.aY = 0;
    this.type = type;
    this.size = 20;
    this.r = Math.random() * 360;
    this.id = id;
    this.health = 100;
    this.maxHealth = 100;
    this.index = 0;
    this.options = {};
    if(!enemyNum[this.type]) {
        enemyNum[this.type] = 0;
    }
    if(opt) {
        if(opt.spawnTime) {
            this.spawnTime = opt.spawnTime;
        }
    }
    switch(this.type) {
        case "Goblin":
            this.size = 17;
            this.armor = 1;
            this.manaArmor = 1;
            this.knockBackRes = 0.6;
            this.equipped = "Basic Sword"
            this.health = 18;
            this.maxHealth = 18;
            this.giveExp = 1.5;
            this.giveGems = 9;
            this.spd = 1.3;
            this.strength = 0.5;
            this.strafing = Math.random() > 0.5;
            this.strafeDist = 100;
            this.strafe = -this.strafeDist/2 + this.strafeDist * Math.round(Math.random());
            this.movementType = "slash"
            this.swings = [0, 0, 0, 0, 0];
            this.swing = 0;
            if(this.team === "enemy") {
                this.color = "rgb(250, 5, 5)"
            } else if(this.team === "ally") {
                this.color = "rgb(5, 5, 250)";
            }
        break;
        case "Troll":
            this.size = 30;
            this.armor = 0.1;
            this.manaArmor = 0.05;
            this.knockBackRes = 0.1;
            this.equipped = "Club"
            this.special = {
                "halfHealth": function(self) {
                    for(let i = 0; i < 5; i++) {
                        let r = Math.random() * Math.PI * 2
                        let enemy = new Enemy(self.x + Math.cos(r) * (800 + Math.random() * 200), self.y + (Math.sin(r) * 800 + Math.random() * 200), "Goblin", "BSG" + i + frameCount + self.id, "enemy");
                        enemy.r = self.r + Math.random() * Math.PI/4 - Math.PI/8;
                        enemies.push(enemy)
                    }
                    self.special.halfHealth = undefined;
                },
            }
            this.health = 80;
            this.maxHealth = 80;
            this.giveExp = 25;
            this.giveGems = 150;
            this.spd = 2;
            this.strength = 0.8;
            this.strafing = Math.random() > 0.5;
            this.strafeDist = 200;
            this.strafe = -this.strafeDist/2 + this.strafeDist * Math.random();
            this.movementType = "slash"
            this.swings = [0, 0, 0, 0, 0];
            this.swing = 0;
            if(this.team === "enemy") {
                this.color = "rgb(250, 5, 5)"
            } else if(this.team === "ally") {
                this.color = "rgb(5, 5, 250)";
            }
        break;
        case "Slime":
            this.health = 14;
            this.maxHealth = 14;
            this.armor = 1;
            this.manaArmor = 0.5;
            this.knockBackRes = 0.8;
            this.giveExp = 1;
            this.giveGems = 6;
            this.spd = 3;
            this.size = 13;
            this.dmg = 2;
            this.bounceRate = Math.round(50 * Math.random());
            this.hitCD = 0;
            this.resetHitCD = 20;
            this.movementType = "bounce"
            this.options = {"dmgOnCollide": true}
            if(this.team === "enemy") {
                this.color = "rgb(250, 5, 5)"
            } else if(this.team === "ally") {
                this.color = "rgb(5, 5, 250)";
            }
        break;
    }
}
Enemy.prototype.draw = function() {
    if(this.spawnTime && this.spawnTime > 0) {
        return;
    }
    let r = this.r;
    switch(this.type) {
        case "Goblin":
            // health bar
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.fillRect(this.x - this.size, this.y + this.size * 1.3, this.size * 2, this.size * 0.35);
            if(this.team === "enemy") {
                ctx.fillStyle = "rgb(219, 0, 0)"
            } else if(this.team === "ally") {
                ctx.fillStyle = "rgb(40, 219, 13)"
            }
            ctx.fillRect(this.x - this.size * 0.95, this.y + this.size * 1.35, this.size * 1.9 * this.health/this.maxHealth, this.size * 0.25);
            
            // body
            ctx.fillStyle = "rgba(6, 163, 6, 1)";
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.size, this.size, 0, 0, 2 * Math.PI);
            ctx.fill();
            if(this.target) {
                r = Math.atan2(this.target.y - this.y, this.target.x - this.x);
            }
            ctx.fillStyle = "rgb(255, 255, 255)"
            ctx.beginPath();
            ctx.ellipse(this.x + Math.cos(r) * this.size * 0.55 + Math.cos(r + Math.PI/2) * this.size * 0.35, this.y + Math.sin(r) * this.size * 0.55 + Math.sin(r + Math.PI/2) * this.size * 0.35, this.size * 0.1, this.size * 0.1, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(this.x + Math.cos(r) * this.size * 0.56 + Math.cos(r - Math.PI/2) * this.size * 0.35, this.y + Math.sin(r) * this.size * 0.55 + Math.sin(r - Math.PI/2) * this.size * 0.35, this.size * 0.1, this.size * 0.1, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = this.color
            ctx.beginPath();
            ctx.ellipse(this.x + Math.cos(r) * this.size * 0.58 + Math.cos(r + Math.PI/2) * this.size * 0.35, this.y + Math.sin(r) * this.size * 0.58 + Math.sin(r + Math.PI/2) * this.size * 0.35, this.size * 0.05, this.size * 0.05, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(this.x + Math.cos(r) * this.size * 0.58 + Math.cos(r - Math.PI/2) * this.size * 0.35, this.y + Math.sin(r) * this.size * 0.58 + Math.sin(r - Math.PI/2) * this.size * 0.35, this.size * 0.05, this.size * 0.05, 0, 0, 2 * Math.PI);
            ctx.fill();
            this.index = this.y + this.size;
        break;
        case "Troll":
            // health bar
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.fillRect(this.x - this.size, this.y + this.size * 1.3, this.size * 2, this.size * 0.35);
            if(this.team === "enemy") {
                ctx.fillStyle = "rgb(219, 0, 0)"
            } else if(this.team === "ally") {
                ctx.fillStyle = "rgb(40, 219, 13)"
            }
            ctx.fillRect(this.x - this.size * 0.95, this.y + this.size * 1.35, this.size * 1.9 * this.health/this.maxHealth, this.size * 0.25);
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.fillRect(this.x - this.size * 0.025, this.y + this.size * 1.25, this.size * 0.05, this.size * 0.45);
            
            // body
            ctx.fillStyle = "rgba(171, 5, 5, 1)";
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.size, this.size, 0, 0, 2 * Math.PI);
            ctx.fill();
            if(this.target) {
                r = Math.atan2(this.target.y - this.y, this.target.x - this.x);
            }
            ctx.fillStyle = "rgb(255, 255, 255)"
            ctx.beginPath();
            ctx.ellipse(this.x + Math.cos(r) * this.size * 0.55 + Math.cos(r + Math.PI/2) * this.size * 0.35, this.y + Math.sin(r) * this.size * 0.55 + Math.sin(r + Math.PI/2) * this.size * 0.35, this.size * 0.1, this.size * 0.1, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(this.x + Math.cos(r) * this.size * 0.56 + Math.cos(r - Math.PI/2) * this.size * 0.35, this.y + Math.sin(r) * this.size * 0.55 + Math.sin(r - Math.PI/2) * this.size * 0.35, this.size * 0.1, this.size * 0.1, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = this.color
            ctx.beginPath();
            ctx.ellipse(this.x + Math.cos(r) * this.size * 0.58 + Math.cos(r + Math.PI/2) * this.size * 0.35, this.y + Math.sin(r) * this.size * 0.58 + Math.sin(r + Math.PI/2) * this.size * 0.35, this.size * 0.05, this.size * 0.05, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(this.x + Math.cos(r) * this.size * 0.58 + Math.cos(r - Math.PI/2) * this.size * 0.35, this.y + Math.sin(r) * this.size * 0.58 + Math.sin(r - Math.PI/2) * this.size * 0.35, this.size * 0.05, this.size * 0.05, 0, 0, 2 * Math.PI);
            ctx.fill();
            this.index = this.y + this.size;
        break;
        case "Slime":
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.ellipse(this.x, this.y + this.size * 0.7, this.size, this.size * 1.5, 0, Math.PI, 0);
            ctx.fill();
            
            // health bar
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.fillRect(this.x - this.size, this.y + this.size * 1.3, this.size * 2, this.size * 0.35);
            if(this.team === "enemy") {
                ctx.fillStyle = "rgb(219, 0, 0)"
            } else if(this.team === "ally") {
                ctx.fillStyle = "rgb(40, 219, 13)"
            }
            ctx.fillRect(this.x - this.size * 0.95, this.y + this.size * 1.35, this.size * 1.9 * this.health/this.maxHealth, this.size * 0.25);
            this.index = this.y + this.size;
        break;
    }
}
Enemy.prototype.findTarget = function() {
    let minDist = 500;
    let target = undefined;
    if(this.target && this.target.health > 0) {
        target = this.target;
        minDist = dist(this.x, this.y, this.target.x, this.target.y) - 20;
    }
    let hateTeams = [];
    if(this.team === "ally") {
        hateTeams = ["enemy"]
    } else if(this.team === "enemy") {
        hateTeams = ["ally"]
    }
    for(let i = 0; i < hateTeams.length; i++) {
        let team = teams[hateTeams[i]];
        if(!team) {
            continue;
        }
        for(let j = 0; j < team.length; j++) {
            if(dist(team[j].x, team[j].y, this.x, this.y) < minDist) {
                target = team[j];
                minDist = dist(team[j].x, team[j].y, this.x, this.y);
            }
        }
    }
    return target;
}
Enemy.prototype.update = function() {
    enemyNum[this.type]+=1;
    if(this.spawnTime && this.spawnTime > 0) {
        this.spawnTime-=1;
        return;
    }
    this.pX = this.x;
    this.pY = this.y;
    this.x+=this.aX;
    this.y+=this.aY;
    this.aX*=this.knockBackRes;
    this.aY*=this.knockBackRes;
    this.target = this.findTarget();
    if(this.special) {
        if(this.special.halfHealth && this.health <= this.maxHealth/2) {
            this.special.halfHealth(this);
        }
    }
    switch(this.movementType) {
        case "slash":
            if(this.target) {
                if(this.strafing) {
                    this.strafe+=1 + Math.random() * 2 * (this.strafeDist/2 + 1 - this.strafe)/20;
                    if(this.strafe > this.strafeDist/2 && dist(this.x, this.y, this.target.x, this.target.y) < (this.strafeDist * 0.75 + this.size * 2 + this.target.size * 2)) {
                        this.strafing = false;
                    }
                } else {
                    this.strafe-=1 + Math.random() * 2 * (this.strafeDist/2 + 1 + this.strafe)/20;
                    if(this.strafe < -this.strafeDist/2 && dist(this.x, this.y, this.target.x, this.target.y) < (this.strafeDist * 0.75 + this.size * 2 + this.target.size * 2)) {
                        this.strafing = true;
                    }
                }
                var targetR = 0;
                if(this.strafe <= 0) {
                    targetR = Math.atan2(this.y - this.target.y, this.x - this.target.x) + Math.min(-Math.PI/2 + Math.PI/2 * (1 - Math.abs(this.strafe)/(this.strafeDist/2)), Math.PI/2)
                } else {
                    targetR = Math.atan2(this.y - this.target.y, this.x - this.target.x) + Math.min(Math.PI/2 * Math.abs(this.strafe)/(this.strafeDist/2), Math.PI/2)
                }
                if(targetR > Math.PI) {
                    targetR-=Math.PI * 2;
                } else if(targetR < -Math.PI) {
                    targetR+=Math.PI * 2;
                }
                if(this.r > Math.PI) {
                    this.r-=Math.PI * 2;
                } else if(this.r < -Math.PI) {
                    this.r+=Math.PI * 2;
                }
                if(Math.min(Math.abs(targetR - this.r), Math.abs(targetR - this.r + Math.PI * 2), Math.abs(targetR - this.r - Math.PI * 2)) < weaponStats[this.equipped].spd/20) {
                    this.r = targetR;
                } else if(targetR - this.r < 0 && targetR - this.r > -Math.PI || targetR > 0 && this.r < 0 && Math.abs(targetR) + Math.abs(this.r) > Math.PI) {
                    this.r-=weaponStats[this.equipped].spd/20;
                } else {
                    this.r+=weaponStats[this.equipped].spd/20;
                }
                var distance = dist(this.target.x, this.target.y, this.x, this.y);
                if(distance > this.target.size * 2 + 20 + Math.abs(this.strafe)) {
                    /**
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
                    */
                    this.aX-=Math.cos(Math.atan2(this.y - this.target.y, this.x - this.target.x) + this.strafe/50 * Math.PI/8) * this.spd;
                    this.aY-=Math.sin(Math.atan2(this.y - this.target.y, this.x - this.target.x) + this.strafe/50 * Math.PI/8) * this.spd;
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
                if(this.bounceRate >= 50) {
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
                type: this.team,
            };
            hitboxGroups["Sword"].hitboxes[this.id + "2"] = {
                x: this.x - Math.cos(this.r) * this.size * 8/3, 
                y: this.y  - Math.sin(this.r) * this.size * 8/3, 
                s: this.size/2,
                refer: this,
                type: this.team,
            };
            hitboxGroups["Sword"].hitboxes[this.id + "3"] = {
                x: this.x - Math.cos(this.r) * this.size * 22/6, 
                y: this.y  - Math.sin(this.r) * this.size * 22/6, 
                s: this.size/2,
                refer: this,
                type: this.team,
            };
            hitboxGroups["Sword"].hitboxes[this.id + "4"] = {
                x: this.x - Math.cos(this.r) * this.size * 28/6, 
                y: this.y  - Math.sin(this.r) * this.size * 28/6, 
                s: this.size/2,
                refer: this,
                type: this.team,
            };
            hitboxGroups["Sword"].hitboxes[this.id + "5"] = {
                x: this.x - Math.cos(this.r) * this.size * 34/6, 
                y: this.y  - Math.sin(this.r) * this.size * 34/6, 
                s: this.size/2,
                refer: this,
                type: this.team,
            };
            this.equippedIndex = Math.max(this.y - Math.sin(this.r) * (1.5 * this.size) + 15, this.y - Math.sin(this.r) * (6 * this.size) + 15)
            render.push({item: this, index: this.equippedIndex})
        break;
        case "Troll":
            hitboxGroups["Sword"].hitboxes[this.id + "1"] = {
                x: this.x - Math.cos(this.r) * this.size * 6/3, 
                y: this.y  - Math.sin(this.r) * this.size * 6/3, 
                s: this.size/3,
                refer: this,
                type: this.team,
            };
            hitboxGroups["Sword"].hitboxes[this.id + "2"] = {
                x: this.x - Math.cos(this.r) * this.size * 8/3, 
                y: this.y  - Math.sin(this.r) * this.size * 8/3, 
                s: this.size/2,
                refer: this,
                type: this.team,
            };
            hitboxGroups["Sword"].hitboxes[this.id + "3"] = {
                x: this.x - Math.cos(this.r) * this.size * 22/6, 
                y: this.y  - Math.sin(this.r) * this.size * 22/6, 
                s: this.size/2,
                refer: this,
                type: this.team,
            };
            hitboxGroups["Sword"].hitboxes[this.id + "4"] = {
                x: this.x - Math.cos(this.r) * this.size * 28/6, 
                y: this.y  - Math.sin(this.r) * this.size * 28/6, 
                s: this.size/2,
                refer: this,
                type: this.team,
            };
            hitboxGroups["Sword"].hitboxes[this.id + "5"] = {
                x: this.x - Math.cos(this.r) * this.size * 34/6, 
                y: this.y  - Math.sin(this.r) * this.size * 34/6, 
                s: this.size/2,
                refer: this,
                type: this.team,
            };
            hitboxGroups["Sword"].hitboxes[this.id + "6"] = {
                x: this.x - Math.cos(this.r) * this.size * 40/6, 
                y: this.y  - Math.sin(this.r) * this.size * 40/6, 
                s: this.size/2,
                refer: this,
                type: this.team,
            };
            this.equippedIndex = Math.max(this.y - Math.sin(this.r) * (1.5 * this.size) + 15, this.y - Math.sin(this.r) * (6 * this.size) + 15)
            render.push({item: this, index: this.equippedIndex})
        break;
    }
    hitboxGroups["Enemies"].hitboxes[this.id] = {
        x: this.x,
        y: this.y,
        s: this.size,
        type: this.team,
        refer: this,
        options: this.options
    }
}
Enemy.prototype.drawEquipped = function() {
    drawWeapon(this.x, this.y, this.r, this.size, this.equipped)
}
Enemy.prototype.die = function() {
    if(this.health <= 0) {
        player.exp+=this.giveExp;
        player.gems+=this.giveGems;
        delete hitboxGroups["Enemies"].hitboxes[this.id]
        delete hitboxGroups["Sword"].hitboxes[this.id + "1"]
        delete hitboxGroups["Sword"].hitboxes[this.id + "2"]
        delete hitboxGroups["Sword"].hitboxes[this.id + "3"]
        delete hitboxGroups["Sword"].hitboxes[this.id + "4"]
        delete hitboxGroups["Sword"].hitboxes[this.id + "5"]
        delete hitboxGroups["Sword"].hitboxes[this.id + "6"]
        return true;
    }
    return false;
}