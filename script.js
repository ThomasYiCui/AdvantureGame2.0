var canvas = document.getElementById("canvi");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var mouseX = 0;
var mouseY = 0;
var dragged = false;
var clicked = false
var keys = [];
var showHitbox = false;
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
var props = [];
var frameCount = 0;
var camera = {
    x: 0,
    y: 0,
}
var weaponStats = {
    "Basic Sword": {
        kb: 3,
        dmg: 0.1,
    }
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}
function prop(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
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
            ctx.stroke();
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

function hitboxGroup(hitboxes, func) {
    this.hitboxes = hitboxes;
    this.func = func;
};
hitboxGroup.prototype.check = function(p1, p2, padding) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)) <= (p1.s/2 + p2.s/2) * 2 + padding;
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

function Player() {
    this.x = canvas.width/2;
    this.y = canvas.height/2;
    this.aX = 0;
    this.aY = 0;
    this.swings = [0, 0, 0, 0, 0];
    this.swing = 0;
    this.lvl = 0;
    this.exp = 0;
    this.size = 20;
    this.health = 100;
    this.maxHealth = 100;
    this.regen = 0.01;
    this.spd = 2;
    this.r = 0;
    this.equipped = "Basic Sword"
}
Player.prototype.draw = function() {
    // health bar
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.fillRect(this.x - this.size, this.y + this.size * 1.3, this.size * 2, this.size * 0.35);
    ctx.fillStyle = "rgb(40, 219, 13)"
    ctx.fillRect(this.x - this.size * 0.95, this.y + this.size * 1.35, this.size * 1.9 * this.health/this.maxHealth, this.size * 0.25);
    
    // player body
    ctx.fillStyle = "rgb(252, 219, 154)";
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.size, this.size, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    switch(this.equipped) {
        case "Basic Sword":
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
            ctx.moveTo(this.x - Math.cos(this.r) * (6 * this.size), this.y - Math.sin(this.r) * (6 * this.size)); 
            ctx.lineTo(this.x - Math.cos(this.r) * (2.8 * this.size), this.y - Math.sin(this.r) * (2.8 * this.size)); 
            ctx.stroke();
        break
    }
}
Player.prototype.update = function() {
    this.swings = this.swings.slice(0, 4)
    var pr = this.r
    this.r = Math.atan2(canvas.height/2 - mouseY, canvas.width/2 - mouseX)
    this.swings.push(Math.min(Math.abs(pr - this.r), Math.abs(pr + 360 - this.r)));
    this.swing = 0;
    for(let i = 0; i < this.swings.length; i++) {
        this.swing+=this.swings[i]
    }
    this.swing/=this.swings.length;
    if(keys[87] || keys[38]) {
        this.aY-=this.spd;
    } else if(keys[83] || keys[40]) {
        this.aY+=this.spd;
    }
    if(keys[65] || keys[37]) {
        this.aX-=this.spd;
    } else if(keys[68] || keys[39]) {
        this.aX+=this.spd;
    }
    this.x+=this.aX;
    this.y+=this.aY;
    this.aX*=0.4;
    this.aY*=0.4
    if(this.health < this.maxHealth) {
        this.health+=this.regen;
    }
    this.health = Math.min(this.health, this.maxHealth)
    hitboxGroups["Player"].hitboxes = {
        "body": {
            x: this.x,
            y: this.y,
            s: this.size,
            refer: this,
            type: "player",
        },
    }
    switch(this.equipped) {
        case "Basic Sword":
            hitboxGroups["Sword"].hitboxes["p1"] = {
                x: this.x - Math.cos(this.r) * this.size * 6/3, 
                y: this.y  - Math.sin(this.r) * this.size * 6/3, 
                s: this.size/3,
                refer: this,
                type: "ally",
            };
            hitboxGroups["Sword"].hitboxes["p2"] = {
                x: this.x - Math.cos(this.r) * this.size * 8/3, 
                y: this.y  - Math.sin(this.r) * this.size * 8/3, 
                s: this.size/2,
                refer: this,
                type: "ally",
            };
            hitboxGroups["Sword"].hitboxes["p3"] = {
                x: this.x - Math.cos(this.r) * this.size * 22/6, 
                y: this.y  - Math.sin(this.r) * this.size * 22/6, 
                s: this.size/2,
                refer: this,
                type: "ally",
            };
            hitboxGroups["Sword"].hitboxes["p4"] = {
                x: this.x - Math.cos(this.r) * this.size * 28/6, 
                y: this.y  - Math.sin(this.r) * this.size * 28/6, 
                s: this.size/2,
                refer: this,
                type: "ally",
            };
            hitboxGroups["Sword"].hitboxes["p5"] = {
                x: this.x - Math.cos(this.r) * this.size * 34/6, 
                y: this.y  - Math.sin(this.r) * this.size * 34/6, 
                s: this.size/2,
                refer: this,
                type: "ally",
            };
        break;
    }
}

function Enemy(x, y, type, id) {
    this.x = x;
    this.y = y;
    this.target = null;
    this.aX = 0;
    this.aY = 0;
    this.type = type;
    this.size = 20;
    this.r = 0;
    this.id = id;
    this.health = 100;
    this.maxHealth = 100;
    this.equipped = "Basic Sword"
    switch(this.type) {
        case "Goblin":
            this.hp = 100;
            this.size = 17;
            this.knockBackRes = 40;
            this.health = 60;
            this.maxHealth = 60;
            this.spd = 1;
            this.strafing = false;
            if(Math.random() < 0.5) {
                this.strafeFactor = -1;
            } else {
                this.strafeFactor = 1;
            }
            this.strafe = -50 + 100 * Math.random();
            this.movementType = "slash"
            this.swings = [0, 0, 0, 0, 0];
        this.swing = 0;
        break;
    }
}
Enemy.prototype.draw = function() {
    switch(this.type) {
        case "Goblin":
            // health bar
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.fillRect(this.x - this.size, this.y + this.size * 1.3, this.size * 2, this.size * 0.35);
            ctx.fillStyle = "rgb(219, 0, 0)"
            ctx.fillRect(this.x - this.size * 0.95, this.y + this.size * 1.35, this.size * 1.9 * this.health/this.maxHealth, this.size * 0.25);
            
            // body
            ctx.fillStyle = "rgb(245, 5, 5)";
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.size, this.size, 0, 0, 2 * Math.PI);
            ctx.fill();
            
            // hand
            ctx.beginPath();
            ctx.ellipse(this.x - Math.cos(this.r) * 30, this.y  - Math.sin(this.r) * 30, this.size/3, this.size/3, 0, 0, 2 * Math.PI);
            ctx.fill();
            
            // sword
            ctx.lineWidth = 7;
            ctx.strokeStyle = "rgb(171, 86, 0)"
            ctx.beginPath(); 
            ctx.moveTo(this.x - Math.cos(this.r) * (this.size * 1.3), this.y - Math.sin(this.r) * (this.size * 1.3)); 
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
        break;
    }
}
Enemy.prototype.findTarget = function() {
    if(dist(player.x, player.y, this.x, this.y) < 300) {
        return player;
    }
}
Enemy.prototype.update = function() {
    this.x+=this.aX;
    this.y+=this.aY;
    this.aX*=1 - this.knockBackRes/100;
    this.aY*=1 - this.knockBackRes/100;
    if(!this.target) {
        this.target = this.findTarget();
    }
    switch(this.movementType) {
        case "slash":
            if(this.target) {
                if(this.strafing) {
                    this.strafe+=1 + Math.random() * 2 * (51 - this.strafe)/20;
                    if(this.strafe > 50 && dist(this.x, this.y, this.target.x, this.target.y) < (75 + this.size * 2 + this.target.size * 2)) {
                        this.strafing = false;
                    }
                } else {
                    this.strafe-=1 + Math.random() * 2 * (51 + this.strafe)/20;
                    if(this.strafe < -50 && dist(this.x, this.y, this.target.x, this.target.y) < (75 + this.size * 2 + this.target.size * 2)) {
                        this.strafing = true;
                    }
                }
                if(this.strafe <= 0) {
                    this.r = Math.atan2(this.y - player.y, this.x - player.x) + Math.min(-Math.PI/2 + Math.PI/2 * (1 - Math.abs(this.strafe)/50), Math.PI/2)
                } else {
                    this.r = Math.atan2(this.y - player.y, this.x - player.x) + Math.min(Math.PI/2 * Math.abs(this.strafe)/50, Math.PI/2)
                }
                var distance = dist(this.target.x, this.target.y, this.x, this.y);
                if(distance > this.target.size * 2 + 20 + Math.abs(this.strafe)) {
                    if(this.x < this.target.x) {
                        this.aX+=this.spd
                    }
                    if(this.x > this.target.x) {
                        this.aX-=this.spd
                    }
                    if(this.y < this.target.y) {
                        this.aY+=this.spd
                    }
                    if(this.y > this.target.y) {
                        this.aY-=this.spd
                    }
                } else if(distance < this.target.size * 2 + 15 + Math.abs(this.strafe)) {
                    if(this.x < this.target.x) {
                        this.aX-=this.spd
                    }
                    if(this.x > this.target.x) {
                        this.aX+=this.spd
                    }
                    if(this.y < this.target.y) {
                        this.aY-=this.spd
                    }
                    if(this.y > this.target.y) {
                        this.aY+=this.spd
                    }
                }
            }
        break;
    }
    switch(this.type) {
        case "Goblin":
            hitboxGroups["Sword"].hitboxes[this.id + "1"] = {
                x: this.x - Math.cos(this.r) * this.size * 6/3, 
                y: this.y  - Math.sin(this.r) * this.size * 6/3, 
                s: this.size/3,
                refer: this,
                type: "enemy",
            };
            hitboxGroups["Sword"].hitboxes[this.id + "2"] = {
                x: this.x - Math.cos(this.r) * this.size * 8/3, 
                y: this.y  - Math.sin(this.r) * this.size * 8/3, 
                s: this.size/2,
                refer: this,
                type: "enemy",
            };
            hitboxGroups["Sword"].hitboxes[this.id + "3"] = {
                x: this.x - Math.cos(this.r) * this.size * 22/6, 
                y: this.y  - Math.sin(this.r) * this.size * 22/6, 
                s: this.size/2,
                refer: this,
                type: "enemy",
            };
            hitboxGroups["Sword"].hitboxes[this.id + "4"] = {
                x: this.x - Math.cos(this.r) * this.size * 28/6, 
                y: this.y  - Math.sin(this.r) * this.size * 28/6, 
                s: this.size/2,
                refer: this,
                type: "enemy",
            };
        break;
    }
    hitboxGroups["Enemies"].hitboxes[this.id] = {
        x: this.x,
        y: this.y,
        s: this.size,
        type: "enemy",
        refer: this,
    }
}
Enemy.prototype.die = function() {
    if(this.health <= 0) {
        delete hitboxGroups["Enemies"].hitboxes[this.id]
        delete hitboxGroups["Sword"].hitboxes[this.id + "1"]
        delete hitboxGroups["Sword"].hitboxes[this.id + "2"]
        delete hitboxGroups["Sword"].hitboxes[this.id + "3"]
        delete hitboxGroups["Sword"].hitboxes[this.id + "4"]
        return true;
    }
    return false;
}

player = new Player();
enemies = [];
hitboxGroups = {
    "Enemies": new hitboxGroup({}, function(h1, h2) {
        if(h2.type === "enemy") {
            if(h1 !== h2) {
                let r = Math.atan2(h1.y - h2.y, h1.x - h2.x);
                let distance = dist(h1.x, h1.y, h2.x, h2.y);
                h2.refer.aX-=Math.cos(r) * (h1.s + h2.s + 15 - distance) * 0.1;
                h2.refer.aY-=Math.sin(r) * (h1.s + h2.s + 15 - distance) * 0.1;
                h1.refer.aX+=Math.cos(r) * (h1.s + h2.s + 15 - distance) * 0.1;
                h1.refer.aY+=Math.sin(r) * (h1.s + h2.s + 15 - distance) * 0.1;
            }
        }
    }),
    "Player": new hitboxGroup({}, function(h1, h2) {
        
    }),
    "Sword": new hitboxGroup({}, function(h1, h2) {
        if(h2.type === "enemy" && h1.type === "ally") {
            let r = Math.atan2(h1.y - h2.y, h1.x - h2.x)
            h2.refer.aX-=Math.cos(r) * weaponStats[h1.refer.equipped].kb * (1 + h1.refer.swing * 10);
            h2.refer.aY-=Math.sin(r) * weaponStats[h1.refer.equipped].kb * (1 + h1.refer.swing * 10);
            h2.refer.health-=(weaponStats[h1.refer.equipped].dmg + h1.refer.swing * 10);
        } else if(h2.type === "player" && h1.type === "enemy") {
            let r = Math.atan2(h1.y - h2.y, h1.x - h2.x)
            h2.refer.aX-=Math.cos(r) * weaponStats[h1.refer.equipped].kb * (1 + h1.refer.swing * 10);
            h2.refer.aY-=Math.sin(r) * weaponStats[h1.refer.equipped].kb * (1 + h1.refer.swing * 10);
            h2.refer.health-=(weaponStats[h1.refer.equipped].dmg + h1.refer.swing * 10);
        }
    })
}
for(let i = 0; i < 10; i++) {
    enemies.push(new Enemy(-800 + 500 * Math.random(), -400 + 800 * Math.random(), "Goblin", "E" + i))
}

for(let i = 0; i < Math.round(canvas.width * canvas.height)/6000; i++) {
    props.push(new prop(-100 + (canvas.width + 200) * Math.random(), -100 + (canvas.width + 200) * Math.random(), "grass"));
}

var update = setInterval(function() {
    ctx.translate(player.x, player.y)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(68, 163, 84)";
    ctx.fillRect(-canvas.width/2, -canvas.height/2, canvas.width * 2, canvas.height * 2)
    player.update();
    ctx.translate(-player.x, -player.y)
    for(var i = 0; i < props.length; i++) {
        props[i].update();
        props[i].draw();
    }
    player.draw();
    for(var i = 0; i < enemies.length; i++) {
        if(enemies[i] !== undefined) {
            if(enemies[i].die()) {
                enemies.splice(i, 1)
                continue;
            }
            enemies[i].update();
            enemies[i].draw();
        }
    }
    if(showHitbox) {
        hitboxGroups["Enemies"].draw();
        hitboxGroups["Sword"].draw();
        hitboxGroups["Player"].draw();
    }
    
    hitboxGroups["Sword"].checkCollision(hitboxGroups["Enemies"], {})
    hitboxGroups["Sword"].checkCollision(hitboxGroups["Player"], {})
    hitboxGroups["Enemies"].checkCollision(hitboxGroups["Enemies"], {padding: 15})
    frameCount+=1;
}, 20);
