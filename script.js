<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Adventure Game 2.0</title>
</head>

<body>
    <canvas id="canvi"></canvas>
    <script>
var canvas = document.getElementById("canvi");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var mouseX = 0;
var mouseY = 0;
var dragged = false;
var clicked = false
var keys = [];
var showHitbox = true;
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
var player;
var enemies;
var hitboxGroups;

function hitboxGroup(hitboxes, func) {
    this.hitboxes = hitboxes;
    this.func = func;
};
hitboxGroup.prototype.check = function(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)) <= (p1.s/2 + p2.s/2);
};
hitboxGroup.prototype.draw = function() {
    for(let i = 0; i < this.hitboxes.length; i++) {
        let hitbox = this.hitboxes[i]
        ctx.fillStyle = "rgb(255, 0, 0, 0.3)"
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(hitbox.x, hitbox.y, hitbox.s, hitbox.s, 0, 0, 2 * Math.PI);
        ctx.fill();
    }
}
hitboxGroup.prototype.checkCollision = function(hitboxGroup) {
    hitboxes = hitboxGroup.hitboxes;
    for(let i = 0; i < hitboxes.length; i++) {
        for(let j = 0; j < this.hitboxes.length; j++) {
            if(this.check(hitboxes[i], this.hitboxes[j])) {
                this.func(hitboxes[i], this.hitboxes[j])
            }
        }
    }
}

function Player() {
    this.x = 100;
    this.y = 100;
    this.lvl = 0;
    this.exp = 0;
    this.size = 20;
    this.health = 100;
    this.maxHealth = 100;
    this.spd = 3;
    this.r = 0;
    this.equipped = "Basic Sword"
}
Player.prototype.draw = function() {
    ctx.fillStyle = "rgb(252, 219, 154)";
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.size, this.size, 0, 0, 2 * Math.PI);
    switch(this.equipped) {
        case "Basic Sword":
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(this.x - Math.cos(this.r) * 40, this.y  - Math.sin(this.r) * 40, this.size/3, this.size/3, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.lineWidth = 7;
            ctx.strokeStyle = "rgb(171, 86, 0)"
            ctx.beginPath(); 
            ctx.moveTo(this.x - Math.cos(this.r) * (this.size * 1.5), this.y - Math.sin(this.r) * (this.size * 1.5)); 
            ctx.lineTo(this.x - Math.cos(this.r) * (this.size * 2.5), this.y - Math.sin(this.r) * (this.size * 2.5)); 
            ctx.stroke();
            ctx.lineWidth = 20;
            ctx.beginPath(); 
            ctx.moveTo(this.x - Math.cos(this.r) * (this.size * 2.5), this.y - Math.sin(this.r) * (this.size * 2.5)); 
            ctx.lineTo(this.x - Math.cos(this.r) * (this.size * 2.8), this.y - Math.sin(this.r) * (this.size * 2.8)); 
            ctx.stroke(); 
            ctx.strokeStyle = "rgb(209, 209, 209)"
            ctx.lineWidth = 12;
            ctx.beginPath(); 
            ctx.moveTo(this.x - Math.cos(this.r) * (5 * this.size), this.y - Math.sin(this.r) * (5 * this.size)); 
            ctx.lineTo(this.x - Math.cos(this.r) * (2.8 * this.size), this.y - Math.sin(this.r) * (2.8 * this.size)); 
            ctx.stroke();
        break
    }
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
    switch(this.equipped) {
        case "Basic Sword":
            hitboxGroups.hitboxes = [
            {
                x: this.x - Math.cos(this.r) * 40, 
                y: this.y  - Math.sin(this.r) * 40, 
                s: this.size/3,
            }];
        break;
    }
}

function Enemy(x, y, type) {
    this.x = x;
    this.y = x;
    this.type = type;
    this.size = 20;
    this.r = 0;
    switch(this.type) {
        case "Goblin":
            this.hp = 100;
            this.size = 15;
        break;
    }
}
Enemy.prototype.draw = function() {
    switch(this.type) {
        case "Goblin":
            ctx.fillStyle = "rgb(245, 5, 5)";
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.size, this.size, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(this.x - Math.cos(this.r) * 30, this.y + this.size/2  - Math.sin(this.r) * 30, this.size/3, this.size/3, 0, 0, 2 * Math.PI);
            ctx.fill();
        break;
    }
}
Enemy.prototype.update = function() {
    
}

player = new Player();
enemies = [];
hitboxGroups = {
    "Enemies": new hitboxGroup([], function(h1, h2) {
        
    }),
    "Sword": new hitboxGroup([], function(h1, h2) {
        
    })
}
enemies.push(new Enemy(canvas.width/2, canvas.height/2, "Goblin"))

var update = setInterval(function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.draw();
    player.update();
    for(var i = 0; i < enemies.length; i++) {
        enemies[i].draw();
        enemies[i].update();
    }
    hitboxGroups["Enemies"].draw();
    hitboxGroups["Sword"].draw();
}, 20);
    </script>
</body>

</html>
