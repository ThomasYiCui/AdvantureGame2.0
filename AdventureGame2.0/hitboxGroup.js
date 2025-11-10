function hitboxGroup(hitboxes, func) {
    this.hitboxes = hitboxes;
    this.func = func;
};
hitboxGroup.prototype.check = function(p1, p2, padding) {
    if(!p1.s || !p2.s) {
        let p1w = p1.s * 2 || p1.w;
        let p1h = p1.s * 2 || p1.h;
        let p2w = p2.s * 2 || p2.w;
        let p2h = p2.s * 2 || p2.h;
        return p1.x - p1w/2 < p2.x + p2w && p1.x + p1w/2 > p2.x && p1.y - p1h/2 < p2.y + p2h && p1.y + p1h/2 > p2.y;
    } else {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)) <= (p1.s/2 + p2.s/2) * 2 + padding;
    }
};
hitboxGroup.prototype.draw = function() {
    for(let i in this.hitboxes) {
        let hitbox = this.hitboxes[i]
        ctx.fillStyle = "rgb(255, 0, 0, 0.3)"
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(hitbox.x, hitbox.y, hitbox.s, hitbox.s, 0, 0, 2 * Math.PI);
        ctx.fill();
    }
}
hitboxGroup.prototype.checkCollision = function(hitboxGroup, options) {
    hitboxes = hitboxGroup.hitboxes;
    var padding = options.padding || 0;
    for(let i in hitboxes) {
        for(let j in this.hitboxes) {
            if(this.check(hitboxes[i], this.hitboxes[j], padding)) {
                this.func(this.hitboxes[j], hitboxes[i])
            }
        }
    }
}