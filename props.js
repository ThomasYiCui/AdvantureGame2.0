function prop(x, y, type, options) {
    this.x = x;
    this.y = y;
    this.index = x;
    this.type = type;
    this.options = options;
}
prop.prototype.draw = function() {
    switch(this.type) {
        case "grass":
            ctx.lineWidth = 4;
            ctx.strokeStyle = "rgb(16, 143, 11)"
            ctx.beginPath(); 
            ctx.moveTo(this.x - 10, this.y - 8); 
            ctx.lineTo(this.x, this.y); 
            ctx.stroke();
            ctx.beginPath(); 
            ctx.moveTo(this.x + 10, this.y - 8); 
            ctx.lineTo(this.x, this.y); 
            ctx.stroke();
            ctx.beginPath(); 
            ctx.moveTo(this.x, this.y - 10); 
            ctx.lineTo(this.x, this.y + 1); 
            this.index = this.y;
            ctx.stroke();
        break;
        case "signpost":
            ctx.lineWidth = 7;
            ctx.strokeStyle = "rgb(138, 76, 5)"
            ctx.beginPath(); 
            ctx.moveTo(this.x, this.y - 45); 
            ctx.lineTo(this.x, this.y + 1); 
            ctx.stroke();
            ctx.fillStyle = "rgb(137, 76, 5)"
            ctx.fillRect(this.x - 25, this.y - 70, 50, 25)
            this.index = this.y;
            
            // arrow
            if(this.options.direction === "left") {
                ctx.beginPath();
                ctx.moveTo(this.x - 24.5, this.y - 70);
                ctx.lineTo(this.x - 45, this.y - 57.5);
                ctx.lineTo(this.x - 24.5, this.y - 45)
                ctx.fill();
            } else if(this.options.direction === "right") {
                ctx.beginPath();
                ctx.moveTo(this.x + 24.5, this.y - 70);
                ctx.lineTo(this.x + 45, this.y - 57.5);
                ctx.lineTo(this.x + 24.5, this.y - 45)
                ctx.fill();
            }
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.textAlign = "center"
            ctx.font = this.options.size + "px Arial";
            ctx.fillText(this.options.txt, this.x + this.options.xOffset, this.y - 57 + this.options.size * 0.37);
        break;
    }
}
prop.prototype.update = function() {
    switch(this.type) {
        case "grass":
            if(this.x < player.x - canvas.width/2 - 100) {
                this.x = player.x + canvas.width/2 + 100 * Math.random();
            } else if(this.x > player.x + canvas.width/2 + 100) {
                this.x = player.x - canvas.width/2 - 100 * Math.random();
            }
            if(this.y < player.y - canvas.height/2 - 100) {
                this.y = player.y + canvas.height/2 + 100 * Math.random();
            } else if(this.y > player.y + canvas.height/2 + 100) {
                this.y = player.y - canvas.height/2 - 100 * Math.random();
            }
        break;
    }
}
