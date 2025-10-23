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
    this.x = 0;
    this.y = 0;
    this.lvl = 0;
    this.exp = 0;
    this.size = 30;
    this.spd = 3;
}
Player.prototype.draw = function() {
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillRect(this.x, this.y, this.size, this.size);
}
Player.prototype.update = function() {
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

var player = new Player();

var update = setInterval(function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.draw();
}, 20);
