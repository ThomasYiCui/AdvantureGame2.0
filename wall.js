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


function Event(x, y, w, h, func, opt) {
     this.x = x;
     this.y = y;
     this.w = w;
     this.h = h;
     this.func = func;
     this.opt = opt;
}
Event.prototype.run = function() {
    switch(this.opt.triggers.type) {
        case "playerProximity":
            ctx.fillStyle = "rgb(255, 0, 0, 0.3)"
            ctx.fillRect(this.x, this.y, this.w, this.h);
            if(player.x - player.size < this.x + this.w && player.x + player.size > this.x && player.y - player.size < this.y + this.h && player.y + player.size > this.y) {
                this.func();
            }
        break;
    }
};