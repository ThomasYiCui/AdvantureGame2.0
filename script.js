player = new Player();
enemies = [];
events = [];
hitboxGroups = {
    "Walls": new hitboxGroup({}, function(h1, h2) {
        let dX = (h1.refer.x + h1.refer.w/2 - h2.refer.x)/h1.refer.w;
        let dY = (h1.refer.y + h1.refer.h/2 - h2.refer.y)/h1.refer.h;
        if(Math.abs(dX) > Math.abs(dY)) {
            if(dX < 0) {
                h2.refer.aX = Math.abs(h2.refer.aX);
                h2.refer.x = h1.refer.x + h1.refer.w + h2.refer.size;
            } else {
                h2.refer.aX = Math.abs(h2.refer.aX);
                h2.refer.x = h1.refer.x - h2.refer.size;
            }
        } else {
            if(dY < 0) {
                h2.refer.aY = Math.abs(h2.refer.aY);
                h2.refer.y = h1.refer.y + h1.refer.h + h2.refer.size;
            } else {
                h2.refer.aY = -Math.abs(h2.refer.aY);
                h2.refer.y = h1.refer.y - h2.refer.size;
            }
        }
    }),
    "Projectiles": new hitboxGroup({}, function(h1, h2) {
        if(h1.type !== h2.type) {
            h2.refer.health-=h1.refer.damage;
            h1.refer.lifeTime-=h1.refer.decay;
        }
    }),
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
                h2.refer.health-=h1.refer.dmg * h2.refer.armor;
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
            h2.refer.health-=(weaponStats[h1.refer.equipped].dmg + h1.refer.swing * 10) * h1.refer.strength * h2.refer.armor;
        }
    })
}
walls.push(new Wall(-500, -400, 50, 400, "wall", {color: "rgb(158, 105, 44)", id: "LeftGateTop"}));
walls.push(new Wall(-500, 150, 50, 400, "wall", {color: "rgb(158, 105, 44)", id: "LeftGateBottom"}));
walls.push(new Wall(-500, -450, 1000, 50, "wall", {color: "rgb(158, 105, 44)", id: "TopWall"}));
walls.push(new Wall(-500, 550, 1000, 50, "wall", {color: "rgb(158, 105, 44)", id: "BottomWall"}));
walls.push(new Wall(450, -400, 50, 400, "wall", {color: "rgb(158, 105, 44)", id: "RightGateTop"}));
walls.push(new Wall(450, 150, 50, 400, "wall", {color: "rgb(158, 105, 44)", id: "RightGateBottom"}));
walls.push(new Wall(-325, -350, 250, 250, "wall", {color: "rgb(158, 105, 44)", id: "ShopTopLeft"}));
walls.push(new Wall(50, -350, 250, 250, "wall", {color: "rgb(158, 105, 44)", id: "ShopTopRight"}));
walls.push(new Wall(-325, 250, 250, 250, "wall", {color: "rgb(158, 105, 44)", id: "ShopBottomLeft"}));
walls.push(new Wall(50, 250, 250, 250, "wall", {color: "rgb(158, 105, 44)", id: "ShopBottomRight"}));

events.push(new Event(-275, -100, 150, 50, function() {

    if(keys[32]) {
        scene = "shop"
        shopCam = {
            x: 0,
            y: 0,
        }
        ctx.translate(player.x, player.y)
        ctx.translate(-shopCam.x, -shopCam.y)
    }
}, {
    triggers: {
        type: "playerProximity",
    }
}))


for(let i = 0; i < Math.round(canvas.width * canvas.height)/8000; i++) {
    props.push(new prop(-100 - canvas.width/2 + (canvas.width + 200) * Math.random(), -100 - canvas.height/2 + (canvas.width + 200) * Math.random(), "grass"));
}
props.push(new prop(-650, -30, "signpost", {size: 13, txt: "Goblins", xOffset: -2, direction: "left"}));
props.push(new prop(650, -30, "signpost", {size: 13, txt: "Slimes", xOffset: 2, direction: "right"}));

ctx.translate(canvas.width/2, canvas.height/2)
var update = setInterval(function() {
    switch(scene) {
        case "game":
            spawnEnemy();
            for(let i in enemyNum) {
                enemyNum[i] = 0;
            }
            render = [];
            ctx.translate(player.x, player.y)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgb(68, 163, 84)";
            ctx.fillRect(-canvas.width/2, -canvas.height/2, canvas.width * 2, canvas.height * 2)
            player.update();
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
            for(var i = 0; i < projectiles.length; i++) {
                if(projectiles[i] !== undefined) {
                    if(projectiles[i].die()) {
                        projectiles.splice(i, 1);
                        continue;
                    }
                }
                projectiles[i].update();
            }
            hitboxGroups["Walls"].checkCollision(hitboxGroups["Enemies"], {})
            hitboxGroups["Walls"].checkCollision(hitboxGroups["Player"], {})
            ctx.translate(-player.x, -player.y)
            if(showHitbox) {
                hitboxGroups["Enemies"].draw();
                hitboxGroups["Sword"].draw();
                hitboxGroups["Player"].draw();
            }
            for(var i = 0; i < events.length; i++) {
                events[i].run();
            }
            hitboxGroups["Sword"].checkCollision(hitboxGroups["Enemies"], {})
            hitboxGroups["Sword"].checkCollision(hitboxGroups["Player"], {})
            hitboxGroups["Projectiles"].checkCollision(hitboxGroups["Enemies"], {})
            hitboxGroups["Projectiles"].checkCollision(hitboxGroups["Player"], {})
            hitboxGroups["Enemies"].checkCollision(hitboxGroups["Enemies"], {padding: 15})
            hitboxGroups["Enemies"].checkCollision(hitboxGroups["Player"], {padding: 15})
            render = render.concat(enemies).concat(props).concat(walls).concat(projectiles);
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
            ctx.fillRect(-canvas.width/2 + 10, canvas.height/2 - 112.5, 155, 25);
            ctx.fillStyle = "rgb(0, 219, 0)";
            ctx.fillRect(-canvas.width/2 + 12.5, canvas.height/2 - 110, 150 * player.health/player.maxHealth, 20)
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.fillRect(-canvas.width/2 + 10, canvas.height/2 - 85, 155, 25);
            ctx.fillStyle = "rgb(0, 0, 219)";
            ctx.fillRect(-canvas.width/2 + 12.5, canvas.height/2 - 82.5, 150 * player.mana/player.maxMana, 20)
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.fillRect(-canvas.width/2 + 10, canvas.height/2 - 57.5, 155, 25);
            ctx.fillStyle = "rgb(219, 219, 0)";
            ctx.fillRect(-canvas.width/2 + 12.5, canvas.height/2 - 55, 150 * player.exp/player.nxtLvlExp, 20)
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.fillRect(-canvas.width/2 + 10, canvas.height/2 - 30, 155, 25);
            ctx.fillStyle = "rgb(217, 141, 0)";
            ctx.fillRect(-canvas.width/2 + 12.5, canvas.height/2 - 27.5, 150 * player.stamina/player.maxStamina, 20)
            ctx.fillStyle = "rgb(255, 255, 255)"
            ctx.font = "17px Arial";
            ctx.textAlign = "center"
            ctx.fillText(Math.round(player.stamina * 2)/2 + "/" + Math.round(player.maxStamina * 2)/2, -canvas.width/2 + 85, canvas.height/2 - 11.5);
            ctx.fillText(Math.round(player.health * 2)/2 + "/" + Math.round(player.maxHealth * 2)/2, -canvas.width/2 + 85, canvas.height/2 - 94.5);
            ctx.fillText(Math.round(player.mana * 2)/2 + "/" + Math.round(player.maxMana * 2)/2, -canvas.width/2 + 85, canvas.height/2 - 66.5);
            ctx.fillText(Math.round(player.exp * 2)/2 + "/" + Math.round(player.nxtLvlExp * 2)/2, -canvas.width/2 + 85, canvas.height/2 - 38.5);
            ctx.textAlign = "left"
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.fillText("Level: " + player.lvl, -canvas.width/2 + 15, canvas.height/2 - 118.5);
            ctx.fillText("Gems: " + Math.round(player.displayGems), -canvas.width/2 + 10, -canvas.height/2 + 17);
            ctx.textAlign = "right";
            ctx.fillText("SP: " + player.sp, -canvas.width/2 + 160, canvas.height/2 - 118.5);
            //x, y, w, h, func, opt: {hoverColor, color, txtColor, txtSize, txt, args, yOffset}
            button(10, canvas.height - 160.5, 70, 25, function() {
                scene = "upgrade"
                ctx.translate(player.x, player.y)
                ctx.translate(-cam.x, -cam.y)
            }, {hoverColor: "rgb(100, 100, 100)", color: "rgb(150, 150, 150)", txtColor: "rgb(0, 0, 0)", txtSize: 15, txt: "Upgrade", args: undefined, yOffset: 5})
            ctx.translate(-player.x, -player.y)
        break;
        case "shop":
            ctx.translate(shopCam.x, shopCam.y)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgb(33, 33, 33)";
            ctx.fillRect(-canvas.width/2, -canvas.height/2, canvas.width * 2, canvas.height * 2)
            if(keys[87] || keys[38]) {
                //shopCam.y-=5;
            } else if((keys[83] || keys[40]) && shopCam.y + 5 <= 0) {
                //shopCam.y+=5;
            }
            ctx.translate(-shopCam.x, -shopCam.y)

            ctx.textAlign = "center"
            ctx.font = "40px Arial"
            ctx.fillStyle = "rgba(255, 255, 255, 1)"
            ctx.fillText("Blacksmith", 0, -canvas.height/2 + 35);

            button(10, 70, (canvas.width - 30)/2, 60, descWeapon, {hoverColor: "rgb(100, 100, 100)", color: "rgb(150, 150, 150)", txtColor: "rgb(0, 0, 0)", txtSize: 15, txt: "Basic Sword", cost: 0, swapEquip: true, args: undefined, yOffset: 5, desc: "A basic sword"})
            button(10, 140, (canvas.width - 30)/2, 60, descWeapon, 
                {hoverColor: "rgb(100, 100, 100)", color: "rgb(150, 150, 150)", txtColor: "rgb(0, 0, 0)", txtSize: 15, txt: "Spear", cost: 2000, swapEquip: true, args: undefined, yOffset: 5, desc: "A long ranged piercing weapon"})
            button(10, 210, (canvas.width - 30)/2, 60, descWeapon, {hoverColor: "rgb(100, 100, 100)", color: "rgb(150, 150, 150)", txtColor: "rgb(0, 0, 0)", txtSize: 15, txt: "Great Sword", cost: 2000, swapEquip: true, args: undefined, yOffset: 5, desc: "A bulky long but slower sword"})
            button(10, 280, (canvas.width - 30)/2, 60, descWeapon, {hoverColor: "rgb(100, 100, 100)", color: "rgb(150, 150, 150)", txtColor: "rgb(0, 0, 0)", txtSize: 15, txt: "Katana", cost: 2000, swapEquip: true, args: undefined, yOffset: 5, desc: "A quick fast sword perfect for parrying"})
            button(10, 350, (canvas.width - 30)/2, 60, descWeapon, {hoverColor: "rgb(100, 100, 100)", color: "rgb(150, 150, 150)", txtColor: "rgb(0, 0, 0)", txtSize: 15, txt: "Mace", cost: 2000, swapEquip: true, args: undefined, yOffset: 5, desc: "A great big heavy mace for staggering"})

            if(sceneOpt.desc) {
                ctx.fillStyle = "rgba(255, 255, 255, 1)";
                ctx.font = "15px Arial"
                ctx.textAlign = "left"
                wrappedText(sceneOpt.desc, 20, canvas.height/2 - 100, canvas.width/2, 20)
                button(10 + canvas.width/2, canvas.height - 70, (canvas.width - 30)/2, 60, buyWeapon, {hoverColor: "rgb(100, 100, 100)", color: "rgb(150, 150, 150)", txtColor: "rgb(0, 0, 0)", txtSize: 15, txt: "Buy", weapon: sceneOpt.name, cost: sceneOpt.cost, swapEquip: true, args: undefined, yOffset: 5})
                drawWeapon(0, 100, Math.PI * 0.75, 50, sceneOpt.name)
            }

            ctx.translate(shopCam.x, shopCam.y)
            button(10, 10, 40, 25, function() {
                scene = "game"
                ctx.translate(shopCam.x, shopCam.y)
                ctx.translate(-player.x, -player.y)
            }, {hoverColor: "rgb(100, 100, 100)", color: "rgb(150, 150, 150)", txtColor: "rgb(0, 0, 0)", txtSize: 15, txt: "Exit", args: undefined, yOffset: 5})
            ctx.translate(-shopCam.x, -shopCam.y)
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
            
            ctx.fillStyle = "rgb(201, 201, 201)"
            // hand
            ctx.beginPath();
            ctx.ellipse(0, 0, 5, 5, 0, 0, 2 * Math.PI);
            ctx.fill();
            for(let i in upgrades) {
                if(upgrades[i].connect) {
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = "rgb(194, 194, 194)"
                    ctx.beginPath(); 
                    ctx.moveTo(upgrades[i].x, upgrades[i].y); 
                    ctx.lineTo(upgrades[upgrades[i].connect].x, upgrades[upgrades[i].connect].y); 
                    ctx.stroke();
                } else {
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = "rgb(194, 194, 194)"
                    ctx.beginPath(); 
                    ctx.moveTo(upgrades[i].x, upgrades[i].y); 
                    ctx.lineTo(0, 0); 
                    ctx.stroke();
                }
            }
            for(let i in upgrades) {
                var colorScheme = [];
                switch(upgrades[i].colorScheme) {
                    case "jack":
                        colorScheme = ["rgb(224, 152, 224)", "rgb(219, 92, 219)", "rgb(219, 9, 215)"]
                    break;
                    case "mana":
                        colorScheme = ["rgb(161, 151, 222)", "rgb(94, 100, 217)", "rgb(11, 14, 217)"]
                    break;
                    case "health":
                        colorScheme = ["rgb(158, 222, 151)", "rgb(94, 217, 102)", "rgb(0, 179, 18)"]
                    break;
                    case "mobility":
                        colorScheme = ["rgb(222, 198, 151)", "rgb(217, 172, 94)", "rgb(230, 153, 0)"]
                    break;
                }
                button(canvas.width/2 + upgrades[i].x, canvas.height/2 + upgrades[i].y, 20, 20, upgrades[i].func, {hoverColor: colorScheme[1], color: colorScheme[0], txtColor: "rgb(0, 0, 0)", txtSize: 15, txt: upgrades[i].spCost, args: undefined, yOffset: 5, upgrade: i, upgradeCol: colorScheme[2], upgradeButton: true, desc: upgrades[i].desc, name: i})
            }
            for(var i in upgrades) {
                let opts = upgrades[i]
                if(dist(mouseX, mouseY, canvas.width/2 + opts.x - cam.x, canvas.height/2 + opts.y - cam.y) < 20) {
                    ctx.fillStyle = "rgb(150, 150, 150)"
                    ctx.fillRect(mouseX + cam.x - canvas.width/2, mouseY + cam.y - canvas.height/2, 150, 100)
                    ctx.fillStyle = "rgb(0, 0, 0)";
                    ctx.font = "20px Arial"
                    ctx.textAlign = "left"
                    ctx.fillText(i, mouseX + cam.x - canvas.width/2 + 2, mouseY + cam.y + 18 - canvas.height/2)
                    ctx.font = "15px Arial"
                    wrappedText(upgrades[i].desc, mouseX + cam.x - canvas.width/2 + 2, mouseY + cam.y + 38 - canvas.height/2, 140, 20)
                }
            }
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