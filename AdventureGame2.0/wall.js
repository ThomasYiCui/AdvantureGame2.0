function Wall(x, y, w, h, type, opt) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = type;
    this.opt = opt;
    this.index = this.y + this.h;
};
Wall.prototype.draw = function() {
    switch(this.type) {
        case "wall":
            ctx.fillStyle = this.opt.color;
            ctx.fillRect(this.x, this.y, this.w, this.h);
            hitboxGroups["Walls"].hitboxes[this.opt.id] = {
                x: this.x, 
                y: this.y, 
                w: this.w,
                h: this.h,
                refer: this,
                type: "wall",
            };
            this.index = this.y + this.h;
        break;
    }
};