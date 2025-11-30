function projectile(x, y, r, type, opt) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.type = type;
    this.opt = opt;
    switch(this.type) {
        case "Mana Pellet":
            this.size = 5;
            this.spd = 5;
            this.lifeTime = 100;
            this.damage = 5;
            this.decay = 100;
            this.dmgType = "mana";
            if(this.opt === "enemy") {
                this.color = "rgb(230, 0, 0)"
            } else {
                this.color = "rgb(0, 0, 230)"
            }
        break;
        case "Mana Bullet":
            this.size = 7;
            this.spd = 7;
            this.lifeTime = 300;
            this.damage = 10;
            this.decay = 100;
            this.dmgType = "mana";
            if(this.opt === "enemy") {
                this.color = "rgb(200, 0, 0)"
            } else {
                this.color = "rgb(0, 0, 200)"
            }
        break;
        case "Fireball":
            this.size = 14;
            this.spd = 5;
            this.lifeTime = 200;
            this.damage = 1;
            this.decay = 5;
            this.dmgType = "mana"
            this.effects = {
                "fire": {
                    "last": 100,
                }
            };
        break;
    }
}
projectile.prototype.draw = function() {
    switch(this.type) {
        case "Mana Pellet":
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.size, this.size, 0, 0, Math.PI * 2)
            ctx.fill();
        break;
        case "Mana Bullet":
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.size, this.size, 0, 0, Math.PI * 2)
            ctx.fill();
        break;
    }
}
projectile.prototype.die = function() {
    if(this.lifeTime <= 0) {
        delete hitboxGroups["Projectiles"].hitboxes[this.opt.id]
        return true;
    }
    return false;
}
projectile.prototype.update = function() {
    this.x-=Math.cos(this.r) * this.spd;
    this.y-=Math.sin(this.r) * this.spd;
    this.lifeTime-=1;
    hitboxGroups["Projectiles"].hitboxes[this.opt.id] = {
        x: this.x,
        y: this.y,
        s: this.size,
        refer: this,
        type: this.opt.type,
        special: this.special,
    }
}