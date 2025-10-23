var canvas = document.getElementById("canvi");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var mouseX = 0;
var mouseY = 0;
var dragged = false;
var clicked = false
var keys = [];
function keysPressed(e) {
  keys[e.keyCode] = true;
  e.preventDefault();
}
function keysReleased(e) {
  keys[e.keyCode] = false;
}
ctx.textAlign = "center";

canvas.addEventListener("mousemove", function(e) {
    var cRect = canvas.getBoundingClientRect();
    mouseX = Math.round(e.clientX - cRect.left);
    mouseY = Math.round(e.clientY - cRect.top);
});
canvas.addEventListener("mousedown", function(e) {
    dragged = true;
}, false);
canvas.addEventListener("mouseup", function(e) {
    if(dragged === true) {
        clicked = true;
        dragged = false;
    }
}, false);
window.addEventListener("keydown", keysPressed, false);
window.addEventListener("keyup", keysReleased, false);

function Player() {
    this.x = 100;
    this.y = 100;
    this.lvl = 0;
    this.exp = 0;
    this.size = 20;
    this.spd = 3;
    this.r = 0;
}
Player.prototype.draw = function() {
    ctx.fillStyle = "rgb(252, 219, 154)";
    ctx.beginPath();
    ctx.ellipse(this.x + this.size/2, this.y + this.size/2, this.size, this.size, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(this.x + this.size/2 - Math.cos(this.r) * 30, this.y + this.size/2  - Math.sin(this.r) * 30, this.size/3, this.size/3, 0, 0, 2 * Math.PI);
    ctx.fill();
}
Player.prototype.update = function() {
    this.r = Math.atan2(this.y - mouseY, this.x - mouseX)
    if(keys[87] || keys[38]) {
        this.y-=this.spd;
    } else if(keys[83] || keys[40]) {
        this.y+=this.spd;
    }
    if(keys[65] || keys[37]) {
        this.x-=this.spd;
    } else if(keys[68] || keys[39]) {
        this.x+=this.spd;
    }
}

function Enemy(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = 30;
    switch(this.type) {
        case "1":
            this.size = 30;
        break;
    }
}
Enemy.prototype.draw = function() {
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.beginPath();
    ctx.ellipse(this.x + this.size/2, this.y + this.size/2, this.size, this.size, 0, 0, 2 * Math.PI);
    ctx.fill();
}
Enemy.prototype.update = function() {
    
}

var player = new Player();

var update = setInterval(function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.draw();
    player.update();
}, 20);
