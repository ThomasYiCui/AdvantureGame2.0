var canvas = document.getElementById("canvi");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 15;
canvas.height = window.innerHeight - 15;
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
var scene = "game";
var hitboxGroups;
var props = [];
var walls = [];
var projectiles = [];
var frameCount = 0;
var render = [];
var cam = {
    x: 0,
    y: 0,
}
var enemyNum = {
    "Goblin": 0,
    "Slime": 0,
}
var weaponStats = {
    "Basic Sword": {
        kb: 3,
        dmg: 0.4,
    }
}

var upgrades = {
    // Jack of All
    "Enchance": {func: function() {
        if(player.sp >= 2 && !player.upgrades["Enchance"]) {
            player.sp-=2;
            player.maxHealth*=1.2;
            player.health*=1.2;
            player.healthRegen*=1.2;
            player.maxMana*=1.2;
            player.mana*=1.2;
            player.manaRegen*=1.2;
            player.upgrades["Enchance"] = player.upgrades["Enchance"] + 1 || 1;
        }
    }, maxLvl: 5, spCost: 2, x: 0, y: -80, colorScheme: "jack", desc: "20% more max + regen health and mana"},
    
    // Health
    "Vitality": {func: function() {
        if(player.sp >= 1 && !player.upgrades["Vitality"]) {
            player.sp-=1;
            player.health*=1.2;
            player.maxHealth*=1.2;
            player.healthRegen*=1.2;
            player.upgrades["Vitality"] = player.upgrades["Vitality"] + 1 || 1;
        }
    }, maxLvl: 5, spCost: 1, x: 0, y: 40, colorScheme: "health", desc: "20% more max health and regen"},
    "Tank": {func: function() {
        if(player.sp >= 2 && !player.upgrades["Tank"]) {
            player.sp-=2;
            player.armor*=0.95;
            player.upgrades["Tank"] = player.upgrades["Tank"] + 1 || 1;
        }
    }, maxLvl: 5, spCost: 2, x: -40, y: 90, colorScheme: "health", connect: "Vitality", desc: "5% damage reduction"},
    "Regen": {func: function() {
        if(player.sp >= 2 && !player.upgrades["Regen"]) {
            player.sp-=2;
            player.healthRegen*=1.5;
            player.upgrades["Regen"] = player.upgrades["Regen"] + 1 || 1;
        }
    }, maxLvl: 5, spCost: 2, x: 40, y: 160, colorScheme: "health", connect: "Health Pool", desc: "50% more health regen"},
    "Tough Hide": {func: function() {
        if(player.sp >= 3 && !player.upgrades["Tough Hide"]) {
            player.sp-=3;
            player.armor*=0.9;
            player.upgrades["Tough Hide"] = player.upgrades["Tough Hide"] + 1 || 1;
        }
    }, maxLvl: 5, spCost: 3, x: -40, y: 160, colorScheme: "health", connect: "Tank", desc: "10% damage reduction"},
    "Strength": {func: function() {
        if(player.sp >= 1 && !player.upgrades["Strength"]) {
            player.sp-=1;
            player.strength*=1.1;
            player.upgrades["Strength"] = player.upgrades["Strength"] + 1 || 1;
        }
    }, maxLvl: 5, spCost: 1, x: -110, y: 160, colorScheme: "health", connect: "Tank", desc: "10% more melee damage"},
    "Health Pool": {func: function() {
        if(player.sp >= 2 && !player.upgrades["Health Pool"]) {
            player.sp-=2;
            player.health*=1.4;
            player.maxHealth*=1.4;
            player.upgrades["Health Pool"] = player.upgrades["Health Pool"] + 1 || 1;
        }
    }, maxLvl: 5, spCost: 2, x: 40, y: 90, colorScheme: "health", connect: "Vitality", desc: "40% more max health"},
    
    //Mobility
    "Dash": {func: function() {
        if(player.sp >= 2 && !player.upgrades["Dash"]) {
            player.sp-=2;
            player.upgrades["Dash"] = player.upgrades["Dash"] + 1 || 1;
        }
    }, maxLvl: 2, spCost: 2, x: -80, y: 0, colorScheme: "mobility", desc: "unlocks dashing: [Shift] to use"},
    
    // Mana
    "Mana": {func: function() {
        if(player.sp >= 1 && !player.upgrades["Mana"]) {
            player.sp-=1;
            player.mana*=1.2;
            player.maxMana*=1.2;
            player.manaRegen*=1.2;
            player.upgrades["Mana"] = player.upgrades["Mana"] + 1 || 1;
        }
    }, maxLvl: 5, spCost: 1, x: 80, y: 0, colorScheme: "mana", desc: "20% max mana and mana regen"},
    "Mana Regen": {func: function() {
        if(player.sp >= 2 && !player.upgrades["Mana Regen"]) {
            player.sp-=2;
            player.manaRegen*=1.5;
            player.upgrades["Mana Regen"] = player.upgrades["Mana Regen"] + 1 || 1;
        }
    }, maxLvl: 5, spCost: 2, x: 130, y: -40, colorScheme: "mana", connect: "Mana", desc: "50% more mana regen"},
    "Mana Pool": {func: function() {
        if(player.sp >= 2 && !player.upgrades["Mana"]) {
            player.sp-=2;
            player.mana*=1.4;
            player.maxMana*=1.4;
            player.upgrades["Mana Pool"] = player.upgrades["Mana Pool"] + 1 || 1;
        }
    }, maxLvl: 5, spCost: 2, x: 130, y: 40, colorScheme: "mana", connect: "Mana", desc: "40% more max mana"},
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}
function wrappedText(text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }

    ctx.fillText(line, x, y);
}
function button(x, y, w, h, func, opt) {
    if(!opt.upgradeButton && mouseX > x && mouseY > y && mouseX < x + w && mouseY < y + h || opt.upgradeButton && dist(mouseX, mouseY, x - cam.x, y - cam.y) < w) {
        if(clicked) {
            func(opt.args);
        }
        ctx.fillStyle = opt.hoverColor;
    } else if(opt.upgrade) {
        if(player.upgrades[opt.upgrade]) {
            ctx.fillStyle = opt.upgradeCol;
        } else {
            ctx.fillStyle = opt.color;
        }
    } else {
        ctx.fillStyle = opt.color;
    }
    if(opt.upgradeButton) {
        ctx.beginPath();
        ctx.ellipse(x - canvas.width/2, y - canvas.height/2, w, h, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = opt.txtColor;
        ctx.textAlign = "center";
        ctx.font = opt.txtSize + "px Arial"
        ctx.fillText(opt.txt, x - canvas.width/2, y + opt.yOffset - canvas.height/2);
    } else if(!opt.upgradeButton) {
        ctx.fillRect(x - canvas.width/2, y - canvas.height/2, w, h);
        ctx.fillStyle = opt.txtColor;
    ctx.textAlign = "center";
    ctx.font = opt.txtSize + "px Arial"
    ctx.fillText(opt.txt, x + w/2 - canvas.width/2, y + h/2 + opt.yOffset - canvas.height/2);
    }
}
function spawnEnemy() {
    for(let i = 0; i < 10 - enemyNum["Goblin"]; i++) {
        enemies.push(new Enemy(-2500 + 500 * Math.random(), -400 + 800 * Math.random(), "Goblin", "G" + i + "frame" + frameCount))
    }
    for(let i = 0; i < 10 - enemyNum["Slime"]; i++) {
        enemies.push(new Enemy(2500 - 500 * Math.random(), -400 + 800 * Math.random(), "Slime", "S" + i + "frame" + frameCount))
    }
}