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
            if(this.opt === "enemy") {
                this.color = "rgb(230, 0, 0)"
            } else {
                this.color = "rgb(0, 0, 230)"
            }
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