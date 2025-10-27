function button(x, y, w, h, func, opt) {
    if(mouseX > x && mouseY > y && mouseX < x + w && mouseY < y + h) {
        ctx.fillStyle = opt.hoverColor;
        if(clicked) {
            func(opt.args);
        }
    } else if(opt.upgrade) {
        if(player.upgrades[opt.upgrade]) {
            ctx.fillStyle = opt.upgradeCol;
        } else {
            ctx.fillStyle = opt.color;
        }
    } else {
        ctx.fillStyle = opt.color;
    }
    ctx.fillRect(x - canvas.width/2, y - canvas.height/2, w, h);
    ctx.fillStyle = opt.txtColor;
    ctx.textAlign = "center";
    ctx.font = opt.txtSize + "px Arial"
    ctx.fillText(opt.txt, x + w/2 - canvas.width/2, y + h/2 + opt.yOffset - canvas.height/2);
}

player = new Player();
enemies = [];
hitboxGroups = {
    "Enemies": new hitboxGroup({}, function(h1, h2) {
        if(h2.type === h1.type) {
            if(h1 !== h2) {
                let r = Math.atan2(h1.y - h2.y, h1.x - h2.x);
                let distance = dist(h1.x, h1.y, h2.x, h2.y);
                h2.refer.aX-=Math.cos(r) * (h1.s + h2.s + 15 - distance) * 0.1;
                h2.refer.aY-=Math.sin(r) * (h1.s + h2.s + 15 - distance) * 0.1;
                h1.refer.aX+=Math.cos(r) * (h1.s + h2.s + 15 - distance) * 0.1;
                h1.refer.aY+=Math.sin(r) * (h1.s + h2.s + 15 - distance) * 0.1;
            }
        } else {
            if(h1 !== h2) {
                let r = Math.atan2(h1.y - h2.y, h1.x - h2.x);
                let distance = dist(h1.x, h1.y, h2.x, h2.y);
                h2.refer.aX-=Math.cos(r) * (h1.s + h2.s + 15 - distance) * 0.1;
                h2.refer.aY-=Math.sin(r) * (h1.s + h2.s + 15 - distance) * 0.1;
                h1.refer.aX+=Math.cos(r) * (h1.s + h2.s + 15 - distance) * 0.1;
                h1.refer.aY+=Math.sin(r) * (h1.s + h2.s + 15 - distance) * 0.1;
            }
            if(h1.options.dmgOnCollide && h1.refer.hitCD <= 0) {
                h2.refer.health-=h1.refer.dmg;
                h1.refer.hitCD = h1.refer.resetHitCD;
            }
        }
    }),
    "Player": new hitboxGroup({}, function(h1, h2) {
        
    }),
    "Sword": new hitboxGroup({}, function(h1, h2) {
        if(h2.type !== h1.type) {
            let r = Math.atan2(h1.y - h2.y, h1.x - h2.x)
            h2.refer.aX-=Math.cos(r) * weaponStats[h1.refer.equipped].kb * (1 + h1.refer.swing * 10);
            h2.refer.aY-=Math.sin(r) * weaponStats[h1.refer.equipped].kb * (1 + h1.refer.swing * 10);
            h2.refer.health-=(weaponStats[h1.refer.equipped].dmg + h1.refer.swing * 10) * h1.refer.strength;
        }
    })
}
for(let i = 0; i < 10; i++) {
    enemies.push(new Enemy(-1000 + 500 * Math.random(), -400 + 800 * Math.random(), "Goblin", "G" + i))
    enemies.push(new Enemy(1000 - 500 * Math.random(), -400 + 800 * Math.random(), "Slime", "S" + i))
}

for(let i = 0; i < Math.round(canvas.width * canvas.height)/8000; i++) {
    props.push(new prop(-100 - canvas.width/2 + (canvas.width + 200) * Math.random(), -100 - canvas.height/2 + (canvas.width + 200) * Math.random(), "grass"));
}
props.push(new prop(-150, 15, "signpost", {size: 13, txt: "Goblins", xOffset: -2, direction: "left"}));
props.push(new prop(150, 15, "signpost", {size: 13, txt: "Slimes", xOffset: 2, direction: "right"}));
ctx.translate(canvas.width/2, canvas.height/2)
var update = setInterval(function() {
    switch(scene) {
        case "game":
            render = [];
            ctx.translate(player.x, player.y)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgb(68, 163, 84)";
            ctx.fillRect(-canvas.width/2, -canvas.height/2, canvas.width * 2, canvas.height * 2)
            player.update();
            ctx.translate(-player.x, -player.y)
            for(var i = 0; i < props.length; i++) {
                props[i].update();
            }
            for(var i = 0; i < enemies.length; i++) {
                if(enemies[i] !== undefined) {
                    if(enemies[i].die()) {
                        enemies.splice(i, 1)
                        continue;
                    }
                    enemies[i].update();
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
            hitboxGroups["Enemies"].checkCollision(hitboxGroups["Player"], {padding: 15})
            render = render.concat(enemies).concat(props);
            render.push(player);
            render.sort(function(a, b) {
                return a.index - b.index;
            })
            for(let i = 0; i < render.length; i++) {
                if(render[i].item) {
                    render[i].item.drawEquipped();
                } else {
                    render[i].draw();
                }
            }
            ctx.translate(player.x, player.y)
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.fillRect(-canvas.width/2 + 10, canvas.height/2 - 110, 155, 25);
            ctx.fillStyle = "rgb(0, 219, 0)";
            ctx.fillRect(-canvas.width/2 + 12.5, canvas.height/2 - 107.5, 150 * player.health/player.maxHealth, 20)
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.fillRect(-canvas.width/2 + 10, canvas.height/2 - 82.5, 155, 25);
            ctx.fillStyle = "rgb(0, 0, 219)";
            ctx.fillRect(-canvas.width/2 + 12.5, canvas.height/2 - 80, 150 * player.mana/player.maxMana, 20)
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.fillRect(-canvas.width/2 + 10, canvas.height/2 - 55, 155, 25);
            ctx.fillStyle = "rgb(219, 219, 0)";
            ctx.fillRect(-canvas.width/2 + 12.5, canvas.height/2 - 52.5, 150 * player.exp/player.nxtLvlExp, 20)
            ctx.fillStyle = "rgb(255, 255, 255)"
            ctx.font = "17px Arial";
            ctx.textAlign = "center"
            ctx.fillText(Math.round(player.health * 2)/2 + "/" + Math.round(player.maxHealth * 2)/2, -canvas.width/2 + 85, canvas.height/2 - 92);
            ctx.fillText(Math.round(player.mana * 2)/2 + "/" + Math.round(player.maxMana * 2)/2, -canvas.width/2 + 85, canvas.height/2 - 64);
            ctx.fillText(Math.round(player.exp * 2)/2 + "/" + Math.round(player.nxtLvlExp * 2)/2, -canvas.width/2 + 85, canvas.height/2 - 36);
            ctx.textAlign = "left"
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.fillText("Level: " + player.lvl, -canvas.width/2 + 15, canvas.height/2 - 116);
            ctx.textAlign = "right";
            ctx.fillText("SP: " + player.sp, -canvas.width/2 + 160, canvas.height/2 - 116);
            //x, y, w, h, func, opt: {hoverColor, color, txtColor, txtSize, txt, args, yOffset}
            button(10, canvas.height - 158, 70, 25, function() {
                scene = "upgrade"
                ctx.translate(player.x, player.y)
                ctx.translate(-cam.x, -cam.y)
            }, {hoverColor: "rgb(100, 100, 100)", color: "rgb(150, 150, 150)", txtColor: "rgb(0, 0, 0)", txtSize: 15, txt: "Upgrade", args: undefined, yOffset: 5})
            ctx.translate(-player.x, -player.y)
        break;
        case "upgrade":
            ctx.translate(cam.x, cam.y)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgb(33, 33, 33)";
            ctx.fillRect(-canvas.width/2, -canvas.height/2, canvas.width * 2, canvas.height * 2)
            if(keys[87] || keys[38]) {
                cam.y-=5;
            } else if(keys[83] || keys[40]) {
                cam.y+=5;
            }
            if(keys[65] || keys[37]) {
                cam.x-=5;
            } else if(keys[68] || keys[39]) {
                cam.x+=5;
            }
            ctx.translate(-cam.x, -cam.y)
            button(canvas.width/2 - 55, canvas.height/2 - 20, 110, 40, function() {
                if(player.sp >= 1 && !player.upgrades["enchance"]) {
                    player.sp-=1;
                    player.upgrades["enchance"] = player.upgrades["enchance"] + 1 || 1;
                }
            }, {hoverColor: "rgb(100, 100, 100)", color: "rgb(150, 150, 150)", txtColor: "rgb(0, 0, 0)", txtSize: 15, txt: "Enchancement", args: undefined, yOffset: 5, upgrade: "enchancement", upgradeCol: "rgb(7, 220, 7)"})
            ctx.translate(cam.x, cam.y)
            button(10, 10, 40, 25, function() {
                scene = "game"
                ctx.translate(cam.x, cam.y)
                ctx.translate(-player.x, -player.y)
            }, {hoverColor: "rgb(100, 100, 100)", color: "rgb(150, 150, 150)", txtColor: "rgb(0, 0, 0)", txtSize: 15, txt: "Exit", args: undefined, yOffset: 5})
            ctx.fillStyle = "rgb(150, 150, 150)"
            ctx.fillRect(-canvas.width/2, canvas.height/2 - 45, 150, 45)
            ctx.textAlign = "left"
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.fillText("Level: " + player.lvl, -canvas.width/2 + 5, canvas.height/2 - 27.5);
            ctx.fillText("Skill Points: " + player.sp, -canvas.width/2 + 5, canvas.height/2 - 7.5);
            ctx.translate(-cam.x, -cam.y)
        break;
    }
    frameCount+=1;
    clicked = false;
}, 20);
