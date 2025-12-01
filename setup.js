var canvas = document.getElementById("canvi");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 10;
canvas.height = window.innerHeight - 10;
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
var scene = "spell book";
var teams = [];
var sceneOpt = {
    desc: undefined,
};
var hitboxGroups;
var props = [];
var walls = [];
var events = [];
var projectiles = [];
var frameCount = 0;
var render = [];
var cam = {
    x: 0,
    y: 0,
}
var shopCam = {
    x: 0,
    y: 0,
}
var enemyNum = {
    "Goblin": 0,
    "Slime": 0,
    "Troll": 0,
}
var spells = {
    "None": {
        desc: "No ability",
        cost: 0,
        func: function(info) {
            return "None"
        },
        reset: 1,
    },
    "Mana Pellet": {
        desc: "The basic starter bullet",
        cost: 1,
        func: function(info) {
            if(info.mana >= 1) {
                info.mana-=1;
                projectiles.push(new projectile(info.x - Math.cos(info.r) * info.size, info.y - Math.sin(info.r) * info.size, info.r, "Mana Pellet", {type: "ally", id: frameCount}))
            }
        },
        reset: 50,
    },
    "Mana Bullet": {
        desc: "A stronger, faster bullet with piercing cabilities",
        cost: 2,
        func: function(info) {
            if(info.mana >= 2) {
                info.mana-=2;
                projectiles.push(new projectile(info.x - Math.cos(info.r) * info.size, info.y - Math.sin(info.r) * info.size, info.r, "Mana Bullet", {type: "ally", id: frameCount}))
            }
        },
        reset: 40,
    },
    "Summon Slime": {
        desc: "Summon a slime to fight for you",
        cost: 5,
        func: function(info) {
            if(info.mana >= 5) {
                info.mana-=5;
                let r = info.r + Math.random() * Math.PI/4 - Math.PI/8
                let slime = new Enemy(info.x - 100 + Math.random() * 200, info.y - 100 + Math.random() * 200, "Slime", "PSS" + frameCount, "ally");
                slime.r = r;
                enemies.push(slime)
            }
        },
        reset: 40,
    },
    "Summon Goblin": {
        desc: "Summon a goblin to fight for you",
        cost: 10,
        func: function(info) {
            if(info.mana >= 10) {
                info.mana-=10;
                let r = info.r + Math.random() * Math.PI/4 - Math.PI/8
                let goblin = new Enemy(info.x - 100 + Math.random() * 200, info.y - 100 + Math.random() * 200, "Goblin", "PSG" + frameCount, "ally");
                goblin.r = r;
                enemies.push(goblin)
            }
        },
        reset: 40,
    },
    "Heal": {
        desc: "Heal 5 HP",
        cost: 5,
        func: function(info) {
            if(info.mana >= 5 && info.health + 5 <= info.maxHealth) {
                info.mana-=5;
                info.health+=5;
            }
        },
        reset: 50,
    },
}
var weaponStats = {
    "Basic Sword": {
        kb: 3,
        dmg: 0.4,
        spd: 4,
    },
    "Katana": {
        kb: 1,
        dmg: 0.25,
        spd: 6,
    },
    "Mace": {
        kb: 8,
        dmg: 1.75,
        spd: 3,
    },
    "Club": {
        kb: 12,
        dmg: 1,
        spd: 1,
    },
    "Spear": {
        kb: 0.5,
        dmg: 1.5,
        spd: 3,
    },
    "Great Sword": {
        kb: 6,
        dmg: 0.3,
        spd: 1.5,
    },
}

var upgrades = {
    // Jack of All
    "Enchance": {func: function() {
        if(player.sp >= 6 && !player.upgrades["Enchance"]) {
            player.sp-=6;
            player.maxHealth*=1.5;
            player.health*=1.5;
            player.healthRegen*=1.5;
            player.maxMana*=1.5;
            player.mana*=1.5;
            player.manaRegen*=1.5;
            player.upgrades["Enchance"] = player.upgrades["Enchance"] + 1 || 1;
        }
    }, maxLvl: 5, spCost: 6, x: 0, y: -80, colorScheme: "jack", desc: "50% more max + regen health and mana"},
    "Clerity": {func: function() {
        if(player.sp >= 5 && !player.upgrades["Clerity"]) {
            player.sp-=5;
            player.maxStamina*=1.4;
            player.stamina*=1.4;
            player.staminaRegen*=1.4;
            player.spd+=0.2;
            player.upgrades["Clerity"] = player.upgrades["Clerity"] + 1 || 1;
        }
    }, maxLvl: 5, spCost: 5, x: -40, y: -130, colorScheme: "jack", connect: "Enchance", desc: "40% more max + regen stamina and 0.2 more speed"},
    "Sturdy": {func: function() {
        if(player.sp >= 5 && !player.upgrades["Sturdy"]) {
            player.sp-=5;
            player.strength*=1.25;
            player.armor*=0.75;
            player.upgrades["Sturdy"] = player.upgrades["Sturdy"] + 1 || 1;
        }
    }, maxLvl: 5, spCost: 4, x: 40, y: -130, colorScheme: "jack", connect: "Enchance", desc: "25% damage reduction and melee damage"},
    // Health
    "Vitality": {func: function() {
        if(player.sp >= 2 && !player.upgrades["Vitality"]) {
            player.sp-=2;
            player.health*=1.2;
            player.maxHealth*=1.2;
            player.healthRegen*=1.2;
            player.upgrades["Vitality"] = player.upgrades["Vitality"] + 1 || 1;
        }
    }, maxLvl: 5, spCost: 2, x: 0, y: 40, colorScheme: "health", desc: "20% more max health and regen"},
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
    "Speed": {func: function() {
        if(player.sp >= 2 && !player.upgrades["Speed"]) {
            player.spd+=0.1;
            player.sp-=2;
            player.upgrades["Speed"] = player.upgrades["Speed"] + 1 || 1;
        }
    }, maxLvl: 2, spCost: 2, x: -130, y: -40, colorScheme: "mobility", connect: "Dash", desc: "Increases Speed by 0.1"},
    "Stamina": {func: function() {
        if(player.sp >= 2 && !player.upgrades["Stamina"]) {
            player.maxStamina*=1.2;
            player.stamina*=1.2;
            player.staminaRegen*=1.2;
            player.sp-=2;
            player.upgrades["Stamina"] = player.upgrades["Stamina"] + 1 || 1;
        }
    }, maxLvl: 2, spCost: 2, x: -130, y: 40, colorScheme: "mobility", connect: "Dash", desc: "20% increase in max stamina and regen"},
    "Max Stamina": {func: function() {
        if(player.sp >= 2 && !player.upgrades["Max Stamina"]) {
            player.maxStamina*=1.4;
            player.stamina*=1.4;
            player.sp-=2;
            player.upgrades["Max Stamina"] = player.upgrades["Max Stamina"] + 1 || 1;
        }
    }, maxLvl: 2, spCost: 2, x: -200, y: 40, colorScheme: "mobility", connect: "Stamina", desc: "40% increase in max stamina"},
    "Stamina Regen": {func: function() {
        if(player.sp >= 2 && !player.upgrades["Stamina Regen"]) {
            player.staminaRegen*=1.4;
            player.sp-=2;
            player.upgrades["Stamina Regen"] = player.upgrades["Stamina Regen"] + 1 || 1;
        }
    }, maxLvl: 2, spCost: 2, x: -200, y: 110, colorScheme: "mobility", connect: "Stamina", desc: "40% increase in stamina regen"},
    
    // Mana
    "Mana": {func: function() {
        if(player.sp >= 2 && !player.upgrades["Mana"]) {
            player.sp-=2;
            player.mana*=1.2;
            player.maxMana*=1.2;
            player.manaRegen*=1.2;
            player.upgrades["Mana"] = player.upgrades["Mana"] + 1 || 1;
        }
    }, maxLvl: 5, spCost: 2, x: 80, y: 0, colorScheme: "mana", desc: "20% max mana and mana regen"},
    "Mana Regen": {func: function() {
        if(player.sp >= 2 && !player.upgrades["Mana Regen"]) {
            player.sp-=2;
            player.manaRegen*=1.5;
            player.upgrades["Mana Regen"] = player.upgrades["Mana Regen"] + 1 || 1;
        }
    }, maxLvl: 5, spCost: 2, x: 130, y: -40, colorScheme: "mana", connect: "Mana", desc: "50% more mana regen"},
    "Mana Pool": {func: function() {
        if(player.sp >= 2 && !player.upgrades["Mana Pool"]) {
            player.sp-=2;
            player.mana*=1.4;
            player.maxMana*=1.4;
            player.upgrades["Mana Pool"] = player.upgrades["Mana Pool"] + 1 || 1;
        }
    }, maxLvl: 5, spCost: 2, x: 130, y: 40, colorScheme: "mana", connect: "Mana", desc: "40% more max mana"},
    "Spell Slot F": {func: function() {
        if(player.sp >= 4 && !player.upgrades["Spell Slot F"]) {
            player.sp-=4;
            player.upgrades["Spell Slot F"] = player.upgrades["Spell Slot F"] + 1 || 1;
        }
    }, maxLvl: 1, spCost: 4, x: 200, y: 40, colorScheme: "mana", connect: "Mana Pool", desc: "Unlocks another Spell Slot: [F]"},
    "Spell Slot T": {func: function() {
        if(player.sp >= 4 && !player.upgrades["Spell Slot T"]) {
            player.sp-=4;
            player.upgrades["Spell Slot T"] = player.upgrades["Spell Slot T"] + 1 || 1;
        }
    }, maxLvl: 1, spCost: 4, x: 200, y: -40, colorScheme: "mana", connect: "Mana Regen", desc: "Unlocks another Spell Slot: [T]"},
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
function drawWeapon(x, y, r, s, type) {
    switch(type) {
        case "Basic Sword":
            ctx.fillStyle = "rgb(252, 219, 154)";
            ctx.beginPath();
            ctx.ellipse(x - Math.cos(r) * s * 2, y  - Math.sin(r) * s * 2, s/3, s/3, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.lineWidth = s/3;
            ctx.strokeStyle = "rgb(171, 86, 0)"
            ctx.beginPath(); 
            ctx.moveTo(x - Math.cos(r) * (s * 1.5), y - Math.sin(r) * (s * 1.5)); 
            ctx.lineTo(x - Math.cos(r) * (s * 2.5), y - Math.sin(r) * (s * 2.5)); 
            ctx.stroke();
            ctx.lineWidth = s * 0.75;
            ctx.beginPath(); 
            ctx.moveTo(x - Math.cos(r) * (s * 2.5), y - Math.sin(r) * (s * 2.5)); 
            ctx.lineTo(x - Math.cos(r) * (s * 2.8), y - Math.sin(r) * (s * 2.8)); 
            ctx.stroke(); 
            ctx.strokeStyle = "rgb(209, 209, 209)"
            ctx.lineWidth = s * 0.6;
            ctx.beginPath(); 
            ctx.moveTo(x - Math.cos(r) * (6.02 * s), y - Math.sin(r) * (6.02 * s)); 
            ctx.lineTo(x - Math.cos(r) * (2.8 * s), y - Math.sin(r) * (2.8 * s)); 
            ctx.stroke();
            
            // tip
            ctx.fillStyle = "rgb(209, 209, 209)"
            ctx.beginPath();
            ctx.moveTo(x - Math.cos(r) * 6 * s - Math.cos(r + Math.PI/2) * s * 0.3, y - Math.sin(r) * 6 * s - Math.sin(r + Math.PI/2) * s * 0.3);
            ctx.lineTo(x - Math.cos(r) * s * 6.6, y - Math.sin(r) * s * 6.6);
            ctx.lineTo(x - Math.cos(r) * 6 * s + Math.cos(r + Math.PI/2) * s * 0.3, y - Math.sin(r) * 6 * s + Math.sin(r + Math.PI/2) * s * 0.3);
            ctx.fill();
        break;
        case "Spear":
            ctx.fillStyle = "rgb(252, 219, 154)";
            ctx.beginPath();
            ctx.ellipse(x - Math.cos(r) * s * 2, y  - Math.sin(r) * s * 2, s/3, s/3, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.lineWidth = s/3;
            ctx.strokeStyle = "rgb(171, 86, 0)"
            ctx.beginPath(); 
            ctx.moveTo(x - Math.cos(r) * (s * 1.5), y - Math.sin(r) * (s * 1.5)); 
            ctx.lineTo(x - Math.cos(r) * (s * 18/3), y - Math.sin(r) * (s * 18/3)); 
            ctx.stroke();
            ctx.fillStyle = "rgb(209, 209, 209)"
            ctx.beginPath();
            ctx.moveTo(x - Math.cos(r) * s * 6 - Math.cos(r + Math.PI/2) * s * 0.3, y - Math.sin(r) * 6 * s - Math.sin(r + Math.PI/2) * s * 0.3);
            ctx.lineTo(x - Math.cos(r) * s * 6.7, y - Math.sin(r) * 6.7 * s);
            ctx.lineTo(x - Math.cos(r) * 6 * s + Math.cos(r + Math.PI/2) * s * 0.3, y - Math.sin(r) * 6 * s + Math.sin(r + Math.PI/2) * s * 0.3);
            ctx.fill();
        break;
        case "Great Sword":
            ctx.fillStyle = "rgb(252, 219, 154)";
            ctx.beginPath();
            ctx.ellipse(x - Math.cos(r) * s * 2, y  - Math.sin(r) * s * 2, s/3, s/3, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.lineWidth = s/3;
            ctx.strokeStyle = "rgb(171, 86, 0)"
            ctx.beginPath(); 
            ctx.moveTo(x - Math.cos(r) * (s * 1.5), y - Math.sin(r) * (s * 1.5)); 
            ctx.lineTo(x - Math.cos(r) * (s * 2.5), y - Math.sin(r) * (s * 2.5)); 
            ctx.stroke();
            ctx.lineWidth = s * 0.75;
            ctx.beginPath(); 
            ctx.moveTo(x - Math.cos(r) * (s * 2.5), y - Math.sin(r) * (s * 2.5)); 
            ctx.lineTo(x - Math.cos(r) * (s * 2.8), y - Math.sin(r) * (s * 2.8)); 
            ctx.stroke(); 
            ctx.strokeStyle = "rgb(209, 209, 209)"
            ctx.lineWidth = s * 1.2;
            ctx.beginPath(); 
            ctx.moveTo(x - Math.cos(r) * (8.22 * s), y - Math.sin(r) * (8.22 * s)); 
            ctx.lineTo(x - Math.cos(r) * (2.8 * s), y - Math.sin(r) * (2.8 * s)); 
            ctx.stroke();
            
            // tip
            ctx.fillStyle = "rgb(209, 209, 209)"
            ctx.beginPath();
            ctx.moveTo(x - Math.cos(r) * 8.2 * s - Math.cos(r + Math.PI/2) * s * 0.6, y - Math.sin(r) * 8.2 * s - Math.sin(r + Math.PI/2) * s * 0.6);
            ctx.lineTo(x - Math.cos(r) * s * 9.5, y - Math.sin(r) * s * 9.5);
            ctx.lineTo(x - Math.cos(r) * 8.2 * s + Math.cos(r + Math.PI/2) * s * 0.6, y - Math.sin(r) * 8.2 * s + Math.sin(r + Math.PI/2) * s * 0.6);
            ctx.fill();
        break;
        case "Katana":
            ctx.fillStyle = "rgb(252, 219, 154)";
            ctx.beginPath();
            ctx.ellipse(x - Math.cos(r) * s * 2, y  - Math.sin(r) * s * 2, s/3, s/3, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.lineWidth = s/4;
            ctx.strokeStyle = "rgb(171, 86, 0)"
            ctx.beginPath(); 
            ctx.moveTo(x - Math.cos(r) * (s * 1.5), y - Math.sin(r) * (s * 1.5)); 
            ctx.lineTo(x - Math.cos(r) * (s * 2.5), y - Math.sin(r) * (s * 2.5)); 
            ctx.stroke();
            ctx.lineWidth = s * 0.5;
            ctx.beginPath(); 
            ctx.moveTo(x - Math.cos(r) * (s * 2.5), y - Math.sin(r) * (s * 2.5)); 
            ctx.lineTo(x - Math.cos(r) * (s * 2.8), y - Math.sin(r) * (s * 2.8)); 
            ctx.stroke(); 
            ctx.strokeStyle = "rgb(209, 209, 209)"
            ctx.lineWidth = s * 0.4;
            ctx.beginPath(); 
            ctx.moveTo(x - Math.cos(r) * (7.02 * s), y - Math.sin(r) * (7.02 * s)); 
            ctx.lineTo(x - Math.cos(r) * (2.8 * s), y - Math.sin(r) * (2.8 * s)); 
            ctx.stroke();
            
            // tip
            ctx.fillStyle = "rgb(209, 209, 209)"
            ctx.beginPath();
            ctx.moveTo(x - Math.cos(r) * 7 * s - Math.cos(r + Math.PI/2) * s * 0.2, y - Math.sin(r) * 7 * s - Math.sin(r + Math.PI/2) * s * 0.2);
            ctx.lineTo(x - Math.cos(r) * s * 7.6 - Math.cos(r + Math.PI/2) * s * 0.2, y - Math.sin(r) * s * 7.6 - Math.sin(r + Math.PI/2) * s * 0.2);
            ctx.lineTo(x - Math.cos(r) * 7 * s + Math.cos(r + Math.PI/2) * s * 0.2, y - Math.sin(r) * 7 * s + Math.sin(r + Math.PI/2) * s * 0.2);
            ctx.fill();
        break;
        case "Mace":
            ctx.fillStyle = "rgb(252, 219, 154)";
            ctx.beginPath();
            ctx.ellipse(x - Math.cos(r) * s * 2, y  - Math.sin(r) * s * 2, s/3, s/3, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.lineWidth = s/3;
            ctx.strokeStyle = "rgb(171, 86, 0)"
            ctx.beginPath(); 
            ctx.moveTo(x - Math.cos(r) * (s * 1.5), y - Math.sin(r) * (s * 1.5)); 
            ctx.lineTo(x - Math.cos(r) * (s * 15/3), y - Math.sin(r) * (s * 15/3)); 
            ctx.stroke();
            ctx.fillStyle = "rgb(159, 159, 159)"
            ctx.beginPath();
            ctx.ellipse(x - Math.cos(r) * (s * 15/3), y - Math.sin(r) * (s * 15/3), s, s, 0, 0, Math.PI * 2)
            ctx.fill();
        break;
        case "Club":
            ctx.fillStyle = "rgb(252, 219, 154)";
            ctx.beginPath();
            ctx.ellipse(x - Math.cos(r) * s * 2, y  - Math.sin(r) * s * 2, s/3, s/3, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.lineWidth = s/2;
            ctx.strokeStyle = "rgb(171, 86, 0)"
            ctx.beginPath(); 
            ctx.moveTo(x - Math.cos(r) * (s * 1.5), y - Math.sin(r) * (s * 1.5)); 
            ctx.lineTo(x - Math.cos(r) * (s * 7.2), y - Math.sin(r) * (s * 7.2)); 
            ctx.stroke();
        break;
    }
}
function button(x, y, w, h, func, opt) {
    if(!opt.upgradeButton && mouseX > x && mouseY > y && mouseX < x + w && mouseY < y + h || opt.upgradeButton && dist(mouseX, mouseY, x - cam.x, y - cam.y) < w) {
        if(clicked) {
            if(opt.desc) {
                console.log("wsg")
                func(opt.txt, opt.cost, opt.desc)
            } else if(opt.swapEquip) {
                func(opt.weapon, opt.cost)
            } else {
                func(opt.args)
            }
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
    if(opt.swapEquip || opt.swapSpell) {
         if(player.equipped === opt.txt) {
            opt.txt = opt.txt + " [Equipped]";
        } else if(player.equipped === opt.weapon) {
            opt.txt = opt.weapon + " [Equipped]";
        } else if(player.owned.includes(opt.txt) || player.spells.includes(opt.txt)) {
            opt.txt = opt.txt + " [Owned]";
        } else if(player.owned.includes(opt.weapon) || player.spells.includes(opt.weapon)) {
            opt.txt = opt.weapon + " [Owned]"
        } else {
            if(opt.weapon) {
                opt.txt = opt.txt + " " + opt.weapon + " [" + opt.cost + "]";
            } else {
                opt.txt = opt.txt + " [" + opt.cost + "]";
            }
        }
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
        enemies.push(new Enemy(-2500 + 500 * Math.random(), -400 + 800 * Math.random(), "Goblin", "G" + i + "frame" + frameCount, "enemy", {spawnTime: 1000}))
    }
    for(let i = 0; i < 1 - enemyNum["Troll"]; i++) {
        enemies.push(new Enemy(-4000 + 500 * Math.random(), -400 + 800 * Math.random(), "Troll", "T" + i + "frame" + frameCount, "enemy", {spawnTime: 10000}))
    }
    for(let i = 0; i < 1 - enemyNum["King Slime"]; i++) {
        enemies.push(new Enemy(4000 - 500 * Math.random(), -400 + 800 * Math.random(), "Troll", "T" + i + "frame" + frameCount, "enemy", {spawnTime: 10000}))
    }
    for(let i = 0; i < 10 - enemyNum["Slime"]; i++) {
        enemies.push(new Enemy(2500 - 500 * Math.random(), -400 + 800 * Math.random(), "Slime", "S" + i + "frame" + frameCount, "enemy", {spawnTime: 1000}))
    }
}
function descWeapon(weaponName, cost, desc) {
    sceneOpt = {
        name: weaponName,
        cost: cost,
        desc: desc,
        shop: sceneOpt.shop,
    }
}
function swapSpell(spellName, cost) {
    if(!player.spells.includes(spellName) && player.gems >= cost) {
        player.gems-=cost;
        player.spells.push(spellName);
    }
}
function buyWeapon(weaponName, cost) {
    if(player.owned.includes(weaponName)) {
        player.equipped = weaponName;
    } else if(player.gems >= cost) {
        player.gems-=cost;
        player.equipped = weaponName;
        player.owned.push(weaponName);
    }
}