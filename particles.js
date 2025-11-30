function particle(x, y, type, opt) {
    this.x = x;
    this.y = y;
    this.aX = 0;
    this.aY = 0;
    this.type = type;
    this.opt = opt;
    switch(this.type) {

    }
}
particle.prototype.update = function() {
    this.x+=this.aX;
    this.y+=this.aY;
}