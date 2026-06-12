"use strict";
const mouseTarget = document.getElementById("mouseTarget");
const canvas = document.querySelector("canvas");
const drawingSurface = canvas.getContext("2d");
const rocketImage = new Image();
rocketImage.src = "./assets/rocket.png";
rocketImage.style.borderImage = "url('./assets/rocket.png') 30 30 round";
const bulletImage = new Image();
bulletImage.src = "./assets/bullet.png";
const alienImage = new Image();
alienImage.src = "./assets/alien.png";
const explosionImage = new Image();
explosionImage.src = "./assets/explosion.gif";
const meteorImages = [new Image(), new Image(), new Image(), new Image()];
meteorImages[0].src = "./assets/meteor.png";
meteorImages[0].rectCollide = { x: 0, y: 30, width: 50 };
meteorImages[1].src = "./assets/meteor2.png";
meteorImages[2].src = "./assets/meteor3.png";
meteorImages[3].src = "./assets/meteor4.png";
const trashImages = [new Image(), new Image(), new Image()];
trashImages[0].src = "./assets/Trash/trash1.png";
trashImages[1].src = "./assets/Trash/trash2.png";
trashImages[2].src = "./assets/Trash/trash3.png";
const explosionImages = [
    new Image(), new Image(), new Image(), new Image(),
    new Image(), new Image(), new Image(), new Image(),
    new Image(), new Image(), new Image(), new Image(),
    new Image(), new Image(), new Image(), new Image(),
    new Image()
];
explosionImages[0].src = "./assets/explosion-1/frame_00_delay-0.1s.png";
explosionImages[1].src = "./assets/explosion-1/frame_01_delay-0.1s.png";
explosionImages[2].src = "./assets/explosion-1/frame_02_delay-0.1s.png";
explosionImages[3].src = "./assets/explosion-1/frame_03_delay-0.1s.png";
explosionImages[4].src = "./assets/explosion-1/frame_04_delay-0.1s.png";
explosionImages[5].src = "./assets/explosion-1/frame_05_delay-0.1s.png";
explosionImages[6].src = "./assets/explosion-1/frame_06_delay-0.1s.png";
explosionImages[7].src = "./assets/explosion-1/frame_07_delay-0.1s.png";
explosionImages[8].src = "./assets/explosion-1/frame_08_delay-0.1s.png";
explosionImages[9].src = "./assets/explosion-1/frame_09_delay-0.1s.png";
explosionImages[10].src = "./assets/explosion-1/frame_10_delay-0.1s.png";
explosionImages[11].src = "./assets/explosion-1/frame_11_delay-0.1s.png";
explosionImages[12].src = "./assets/explosion-1/frame_12_delay-0.1s.png";
explosionImages[13].src = "./assets/explosion-1/frame_13_delay-0.1s.png";
explosionImages[14].src = "./assets/explosion-1/frame_14_delay-0.1s.png";
explosionImages[15].src = "./assets/explosion-1/frame_15_delay-0.1s.png";
explosionImages[16].src = "./assets/explosion-1/frame_16_delay-0.1s.png";
const triplePowerUp = new Image();
triplePowerUp.src = "./assets/missile-pod.png";
const shieldPowerUp = new Image();
shieldPowerUp.src = "./assets/shield.png";
const laserPowerUp = new Image();
laserPowerUp.src = "./assets/sinusoidal-beam.png";
const powerUpImages = {
    triple: triplePowerUp,
    shield: shieldPowerUp,
    laser: laserPowerUp
};
let trashCollected = 0;
let powerUp = null;
let powerUpTimer = 0;
let upgrades = {
    speed: { level: 0, cost: 5 },
    saver: { level: 0, cost: 5 },
    damage: { level: 0, cost: 5 },
    extraLife: { level: 0, cost: 5 }
};
let powerupMessage = null;
let gameState = "start";
let score = 0;
const scoreDisplay = document.getElementById("points");
const lifeText = document.getElementById("current-life");
const effectDisplay = document.getElementById("current-effect");
const rocket = { x: 200, y: 650, width: 80, height: 80, speedX: 0, speedY: 0, life: 3 };
let bullets = [];
let aliens = [];
let meteor = [];
let explosions = [];
let powerups = [];
let trashItems = [];
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;
const startBtn = {
    x: canvas.width / 2 - 100,
    y: canvas.height / 2 - 10,
    width: 200,
    height: 75
};
const pauseBtn = {
    x: canvas.width - 55,
    y: 10,
    width: 45,
    height: 45
};
let alienInterval;
let meteorInterval;
function updateUI() {
    scoreDisplay.innerHTML = `${score} 💥`;
    lifeText.innerHTML = `${rocket.life} ❤️`;
    if (powerUp === "triple") {
        effectDisplay.innerHTML = "Triple Shot";
    }
    else if (powerUp === "laser") {
        effectDisplay.innerHTML = "Laser";
    }
    else if (powerUp === "shield") {
        effectDisplay.innerHTML = "Bouclier";
    }
    else {
        effectDisplay.innerHTML = "Aucun";
    }
    document.getElementById("trash-count").innerHTML = `${trashCollected}`;
    updateUpgradeButtons();
}
function startGame() {
    rocket.life = 3;
    score = 0;
    trashCollected = 0;
    powerUp = null;
    powerUpTimer = 0;
    powerupMessage = null;
    rocket.x = 200;
    rocket.y = 650;
    bullets = [];
    aliens = [];
    meteor = [];
    explosions = [];
    powerups = [];
    trashItems = [];
    upgrades = {
        speed: { level: 0, cost: 5 },
        saver: { level: 0, cost: 5 },
        damage: { level: 0, cost: 5 },
        extraLife: { level: 0, cost: 5 }
    };
    updateUpgradeButtons();
    updateUI();
    gameState = "playing";
    clearInterval(alienInterval);
    clearInterval(meteorInterval);
    alienInterval = setInterval(() => {
        const count = 1 + Math.floor(score / 25);
        for (let i = 0; i < count; i++) {
            spawnRock();
        }
    }, Math.max(400, 1500 - score * 10));
    meteorInterval = setInterval(spawnMeteor, 2000);
}
canvas.addEventListener("click", function (e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (gameState === "start" || gameState === "lose") {
        if (x >= startBtn.x && x <= startBtn.x + startBtn.width &&
            y >= startBtn.y && y <= startBtn.y + startBtn.height) {
            startGame();
        }
    }
    if (gameState === "playing" || gameState === "paused") {
        if (x >= pauseBtn.x && x <= pauseBtn.x + pauseBtn.width &&
            y >= pauseBtn.y && y <= pauseBtn.y + pauseBtn.height) {
            gameState = gameState === "playing" ? "paused" : "playing";
        }
    }
});
window.addEventListener("keydown", function (e) {
    if (e.code === "KeyP") {
        if (gameState === "playing")
            gameState = "paused";
        else if (gameState === "paused")
            gameState = "playing";
        return;
    }
    if (gameState !== "playing")
        return;
    switch (e.code) {
        case "KeyW":
        case "ArrowUp":
            moveUp = true;
            break;
        case "KeyS":
        case "ArrowDown":
            moveDown = true;
            break;
        case "KeyA":
        case "ArrowLeft":
            moveLeft = true;
            break;
        case "KeyD":
        case "ArrowRight":
            moveRight = true;
            break;
        case "Space":
            e.preventDefault();
            shootBullet();
            break;
    }
}, false);
window.addEventListener("keyup", function (e) {
    switch (e.code) {
        case "KeyW":
        case "ArrowUp":
            moveUp = false;
            break;
        case "KeyS":
        case "ArrowDown":
            moveDown = false;
            break;
        case "KeyA":
        case "ArrowLeft":
            moveLeft = false;
            break;
        case "KeyD":
        case "ArrowRight":
            moveRight = false;
            break;
    }
}, false);
let initDone = false;
function init() {
    if (initDone)
        return;
    initDone = true;
    update();
}
rocketImage.onload = init;
if (rocketImage.complete)
    init();
function shootBullet() {
    switch (powerUp) {
        case "triple":
            bullets.push({ x: rocket.x + rocket.width / 2 - 10, y: rocket.y, width: 20, height: 20, speed: 7, speedX: 0 });
            bullets.push({ x: rocket.x + rocket.width / 2 - 10, y: rocket.y, width: 20, height: 20, speed: 7, speedX: -2 });
            bullets.push({ x: rocket.x + rocket.width / 2 - 10, y: rocket.y, width: 20, height: 20, speed: 7, speedX: 2 });
            break;
        case "laser":
            bullets.push({ x: rocket.x + rocket.width / 2 - 10, y: rocket.y, width: 40, height: 40, speed: 14, speedX: 0 });
            break;
        default:
            bullets.push({ x: rocket.x + rocket.width / 2 - 10, y: rocket.y, width: 20, height: 20, speed: 7, speedX: 0 });
            break;
    }
}
function spawnRock() {
    if (gameState !== "playing")
        return;
    const randomX = Math.floor(Math.random() * (canvas.width - 50));
    aliens.push({ x: randomX, y: -50, width: 50, height: 50, speed: 3 + score / 10 });
}
function spawnTrash(x, y) {
    const imgIndex = Math.floor(Math.random() * 3);
    trashItems.push({
        x: x, y: y, width: 35, height: 35, speed: 2, imgIndex: imgIndex
    });
}
function spawnMeteor() {
    if (gameState !== "playing")
        return;
    const randomX = Math.floor(Math.random() * (canvas.width - 50));
    const imgIndex = Math.floor(Math.random() * 4);
    meteor.push({
        x: randomX, y: -50, width: 50, height: 50,
        speed: 3 + score / 10, imgIndex: imgIndex, life: Math.floor(Math.random() * (8 - 4 + 1)) + 4,
    });
}
function spawnPowerUp(x, y) {
    const types = ["triple", "shield", "laser"];
    const type = types[Math.floor(Math.random() * types.length)];
    powerups.push({
        x: x, y: y, width: 40, height: 40, speed: 2, type: type
    });
}
function collectPowerUp(type) {
    const labels = {
        triple: "Triple Shot !",
        shield: "Bouclier !",
        laser: "Laser !"
    };
    powerUp = type;
    powerUpTimer = 600;
    powerupMessage = { text: labels[type], timer: 60 };
    updateUI();
}
class AnimateGif {
    imgs;
    index;
    px;
    py;
    width;
    height;
    finish;
    frameDelay;
    frameTick;
    constructor(imgArray, px, py, width, height) {
        this.imgs = imgArray;
        this.index = 0;
        this.px = px;
        this.py = py;
        this.width = width;
        this.height = height;
        this.finish = false;
        this.frameDelay = 3;
        this.frameTick = 0;
    }
    animate(ctx) {
        if (this.finish)
            return;
        ctx.drawImage(this.imgs[this.index], this.px, this.py, this.width, this.height);
        this.frameTick++;
        if (this.frameTick >= this.frameDelay) {
            this.frameTick = 0;
            this.index++;
            if (this.index >= this.imgs.length)
                this.finish = true;
        }
    }
}
function update() {
    window.requestAnimationFrame(update);
    if (gameState === "start") {
        renderStartScreen();
        return;
    }
    if (gameState === "paused") {
        renderPauseScreen();
        return;
    }
    if (gameState === "lose") {
        renderLoseScreen();
        return;
    }
    const spd = 5 + upgrades.speed.level;
    if (moveUp && !moveDown)
        rocket.speedY = -spd;
    else if (moveDown && !moveUp)
        rocket.speedY = spd;
    else
        rocket.speedY = 0;
    if (moveLeft && !moveRight)
        rocket.speedX = -spd;
    else if (moveRight && !moveLeft)
        rocket.speedX = spd;
    else
        rocket.speedX = 0;
    rocket.x += rocket.speedX;
    rocket.y += rocket.speedY;
    if (rocket.x < 0)
        rocket.x = 0;
    if (rocket.y < 0)
        rocket.y = 0;
    if (rocket.x + rocket.width > canvas.width)
        rocket.x = canvas.width - rocket.width;
    if (rocket.y + rocket.height > canvas.height)
        rocket.y = canvas.height - rocket.height;
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;
        bullets[i].x += bullets[i].speedX || 0;
        if (bullets[i].y < -20 || bullets[i].x < -20 || bullets[i].x > canvas.width + 20) {
            bullets.splice(i, 1);
        }
    }
    for (let j = aliens.length - 1; j >= 0; j--) {
        aliens[j].y += aliens[j].speed;
        if (aliens[j].y + aliens[j].height >= canvas.height) {
            if (upgrades.saver.level > 0) {
                upgrades.saver.level--;
                aliens.splice(j, 1);
                updateUpgradeButtons();
                powerupMessage = { text: "Saver utilisé !", timer: 60 };
            }
            else {
                gameState = "lose";
                return;
            }
        }
    }
    for (let t = trashItems.length - 1; t >= 0; t--) {
        trashItems[t].y += trashItems[t].speed;
        if (trashItems[t].y > canvas.height)
            trashItems.splice(t, 1);
    }
    for (let t = trashItems.length - 1; t >= 0; t--) {
        if (rocket.x < trashItems[t].x + trashItems[t].width &&
            rocket.x + rocket.width > trashItems[t].x &&
            rocket.y < trashItems[t].y + trashItems[t].height &&
            rocket.y + rocket.height > trashItems[t].y) {
            trashCollected++;
            updateUI();
            updateUI();
            trashItems.splice(t, 1);
        }
    }
    for (let m = meteor.length - 1; m >= 0; m--) {
        meteor[m].y += meteor[m].speed;
        if (meteor[m].y > canvas.height)
            meteor.splice(m, 1);
    }
    for (let p = powerups.length - 1; p >= 0; p--) {
        powerups[p].y += powerups[p].speed;
        if (powerups[p].y > canvas.height)
            powerups.splice(p, 1);
    }
    for (let e = explosions.length - 1; e >= 0; e--) {
        if (explosions[e].finish)
            explosions.splice(e, 1);
    }
    if (powerupMessage) {
        powerupMessage.timer--;
        if (powerupMessage.timer <= 0)
            powerupMessage = null;
    }
    if (powerUp) {
        powerUpTimer--;
        if (powerUpTimer <= 0) {
            powerUp = null;
            updateUI();
        }
    }
    for (let b = bullets.length - 1; b >= 0; b--) {
        for (let a = aliens.length - 1; a >= 0; a--) {
            if (bullets[b] && aliens[a] &&
                bullets[b].x < aliens[a].x + aliens[a].width &&
                bullets[b].x + bullets[b].width > aliens[a].x &&
                bullets[b].y < aliens[a].y + aliens[a].height &&
                bullets[b].y + bullets[b].height > aliens[a].y) {
                explosions.push(new AnimateGif(explosionImages, aliens[a].x, aliens[a].y, aliens[a].width, aliens[a].height));
                bullets.splice(b, 1);
                if (Math.random() < 0.7)
                    spawnTrash(aliens[a].x + aliens[a].width / 2 - 17, aliens[a].y);
                aliens.splice(a, 1);
                score++;
                updateUI();
                break;
            }
        }
        if (bullets[b]) {
            for (let mt = meteor.length - 1; mt >= 0; mt--) {
                if (bullets[b] && meteor[mt] &&
                    bullets[b].x < meteor[mt].x + meteor[mt].width &&
                    bullets[b].x + bullets[b].width > meteor[mt].x &&
                    bullets[b].y < meteor[mt].y + meteor[mt].height &&
                    bullets[b].y + bullets[b].height > meteor[mt].y) {
                    bullets.splice(b, 1);
                    meteor[mt].life--;
                    if (meteor[mt].life <= 0) {
                        explosions.push(new AnimateGif(explosionImages, meteor[mt].x, meteor[mt].y, meteor[mt].width, meteor[mt].height));
                        if (Math.random() < 0.6) {
                            spawnPowerUp(meteor[mt].x + meteor[mt].width / 2 - 20, meteor[mt].y);
                        }
                        meteor.splice(mt, 1);
                        score++;
                        updateUI();
                    }
                    break;
                }
            }
        }
    }
    for (let p = powerups.length - 1; p >= 0; p--) {
        if (rocket.x < powerups[p].x + powerups[p].width &&
            rocket.x + rocket.width > powerups[p].x &&
            rocket.y < powerups[p].y + powerups[p].height &&
            rocket.y + rocket.height > powerups[p].y) {
            collectPowerUp(powerups[p].type);
            powerups.splice(p, 1);
        }
    }
    for (let a = aliens.length - 1; a >= 0; a--) { //ANCHOR - Alien
        if (rocket.x < aliens[a].x + aliens[a].width &&
            rocket.x + rocket.width > aliens[a].x &&
            rocket.y < aliens[a].y + aliens[a].height &&
            rocket.y + rocket.height > aliens[a].y) {
            explosions.push(new AnimateGif(explosionImages, aliens[a].x, aliens[a].y, aliens[a].width, aliens[a].height));
            if (Math.random() < 0.7)
                spawnTrash(aliens[a].x + aliens[a].width / 2 - 17, aliens[a].y);
            aliens.splice(a, 1);
            if (powerUp !== "shield") {
                rocket.life--;
                updateUI();
                if (rocket.life <= 0) {
                    gameState = "lose";
                    return;
                }
            }
        }
    }
    for (let m = meteor.length - 1; m >= 0; m--) { //ANCHOR - Meteor
        if (rocket.x < meteor[m].x + meteor[m].width &&
            rocket.x + rocket.width > meteor[m].x &&
            rocket.y < meteor[m].y + meteor[m].height &&
            rocket.y + rocket.height > meteor[m].y) {
            explosions.push(new AnimateGif(explosionImages, meteor[m].x, meteor[m].y, meteor[m].width, meteor[m].height));
            meteor.splice(m, 1);
            if (powerUp !== "shield") {
                rocket.life--;
                updateUI();
                if (rocket.life <= 0) {
                    gameState = "lose";
                    return;
                }
            }
        }
    }
    render();
}
function render() {
    drawingSurface.clearRect(0, 0, canvas.width, canvas.height);
    drawingSurface.textAlign = "center";
    drawingSurface.drawImage(rocketImage, rocket.x, rocket.y, rocket.width, rocket.height);
    if (powerUp === "shield") {
        drawingSurface.strokeStyle = "cyan";
        drawingSurface.lineWidth = 3;
        drawingSurface.beginPath();
        drawingSurface.arc(rocket.x + rocket.width / 2, rocket.y + rocket.height / 2, rocket.width / 1.2, 0, Math.PI * 2);
        drawingSurface.stroke();
    }
    for (let i = 0; i < bullets.length; i++) {
        if (bulletImage.complete && bulletImage.naturalWidth !== 0) {
            drawingSurface.drawImage(bulletImage, bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
        }
        else {
            drawingSurface.fillStyle = "yellow";
            drawingSurface.fillRect(bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
        }
    }
    if (explosionImage.complete && explosionImage.naturalWidth !== 0) {
        for (let e = 0; e < explosions.length; e++) {
            explosions[e].animate(drawingSurface);
        }
    }
    else {
        drawingSurface.fillStyle = "orange";
        for (let e = 0; e < explosions.length; e++) {
            explosions[e].animate(drawingSurface);
        }
    }
    for (let p = 0; p < powerups.length; p++) {
        const pu = powerups[p];
        const puImg = powerUpImages[pu.type];
        if (puImg && puImg.complete && puImg.naturalWidth !== 0) {
            drawingSurface.drawImage(puImg, pu.x, pu.y, pu.width, pu.height);
        }
        else {
            drawingSurface.fillStyle = "gold";
            drawingSurface.fillRect(pu.x, pu.y, pu.width, pu.height);
        }
    }
    for (let j = 0; j < aliens.length; j++) {
        if (alienImage.complete && alienImage.naturalWidth !== 0) {
            drawingSurface.drawImage(alienImage, aliens[j].x, aliens[j].y, aliens[j].width, aliens[j].height);
        }
        else {
            drawingSurface.fillStyle = "red";
            drawingSurface.fillRect(aliens[j].x, aliens[j].y, aliens[j].width, aliens[j].height);
        }
    }
    for (let j = 0; j < meteor.length; j++) {
        const img = meteorImages[meteor[j].imgIndex];
        if (img && img.complete && img.naturalWidth !== 0) {
            drawingSurface.drawImage(img, meteor[j].x, meteor[j].y, meteor[j].width, meteor[j].height);
        }
        else {
            drawingSurface.fillStyle = "gray";
            drawingSurface.fillRect(meteor[j].x, meteor[j].y, meteor[j].width, meteor[j].height);
        }
    }
    for (let t = 0; t < trashItems.length; t++) {
        const tImg = trashImages[trashItems[t].imgIndex];
        if (tImg && tImg.complete && tImg.naturalWidth !== 0) {
            drawingSurface.drawImage(tImg, trashItems[t].x, trashItems[t].y, trashItems[t].width, trashItems[t].height);
        }
        else {
            drawingSurface.fillStyle = "brown";
            drawingSurface.fillRect(trashItems[t].x, trashItems[t].y, trashItems[t].width, trashItems[t].height);
        }
    }
    if (powerupMessage) {
        drawingSurface.save();
        drawingSurface.font = "bold 24px Arial";
        drawingSurface.fillStyle = "#ffffff";
        drawingSurface.fillText(powerupMessage.text, canvas.width / 2, canvas.height / 2);
        drawingSurface.restore();
    }
    drawingSurface.fillStyle = "rgba(0,0,0,0.5)";
    drawingSurface.beginPath();
    drawingSurface.roundRect(pauseBtn.x, pauseBtn.y, pauseBtn.width, pauseBtn.height, 8);
    drawingSurface.fill();
    drawingSurface.font = "28px Arial";
    drawingSurface.fillStyle = "white";
    if (gameState !== "paused") {
        drawingSurface.fillText("⏸", pauseBtn.x + pauseBtn.width / 2, pauseBtn.y + 33);
    }
}
mouseTarget.addEventListener("mouseleave", () => {
    if (gameState === "playing") {
        gameState = "paused";
    }
});
function buyUpgrade(type) {
    const upg = upgrades[type];
    if (trashCollected < upg.cost)
        return;
    trashCollected -= upg.cost;
    upg.level++;
    if (type === "extraLife") {
        rocket.life++;
    }
    document.getElementById("trash-count").innerHTML = `${trashCollected}`;
    updateUpgradeButtons();
    updateUI();
}
function updateUpgradeButtons() {
    document.getElementById("btn-speed").innerHTML =
        `<i class="bi bi-speedometer2"></i> Speed (Niv.${upgrades.speed.level}) — ${upgrades.speed.cost} <i class="bi bi-trash3-fill"></i>`;
    document.getElementById("btn-saver").innerHTML =
        `<i class="bi bi-shield-fill"></i> Saver (Niv.${upgrades.saver.level}) — ${upgrades.saver.cost} <i class="bi bi-trash3-fill"></i>`;
    document.getElementById("btn-damage").innerHTML =
        `<i class="bi bi-crosshair2"></i> Damage (Niv.${upgrades.damage.level}) — ${upgrades.damage.cost} <i class="bi bi-trash3-fill"></i>`;
    document.getElementById("btn-extralife").innerHTML =
        `<i class="bi bi-heart-fill"></i> Extra Life (Niv.${upgrades.extraLife.level}) — ${upgrades.extraLife.cost} <i class="bi bi-trash3-fill"></i>`;
    document.getElementById("btn-speed").disabled = trashCollected < upgrades.speed.cost;
    document.getElementById("btn-saver").disabled = trashCollected < upgrades.saver.cost;
    document.getElementById("btn-damage").disabled = trashCollected < upgrades.damage.cost;
    document.getElementById("btn-extralife").disabled = trashCollected < upgrades.extraLife.cost;
}
function renderStartScreen() {
    drawingSurface.clearRect(0, 0, canvas.width, canvas.height);
    drawingSurface.textAlign = "center";
    drawingSurface.fillStyle = "azure";
    drawingSurface.font = "bold 36px Arial";
    drawingSurface.fillText("Space Shooter", canvas.width / 2, canvas.height / 2 - 80);
    drawingSurface.font = "18px Arial";
    drawingSurface.fillStyle = "#aaccff";
    drawingSurface.fillText("Flèches pour bouger, Espace pour tirer", canvas.width / 2, canvas.height / 2 - 40);
    drawingSurface.fillStyle = "white";
    drawingSurface.fillRect(startBtn.x, startBtn.y, startBtn.width, startBtn.height);
    drawingSurface.fillStyle = "#001122";
    drawingSurface.font = "bold 22px Arial";
    drawingSurface.fillText("Start Game", canvas.width / 2, startBtn.y + 46);
}
function renderLoseScreen() {
    drawingSurface.clearRect(0, 0, canvas.width, canvas.height);
    drawingSurface.textAlign = "center";
    drawingSurface.fillStyle = "crimson";
    drawingSurface.font = "bold 42px Arial";
    drawingSurface.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 80);
    drawingSurface.font = "20px Arial";
    drawingSurface.fillStyle = "#aaccff";
    drawingSurface.fillText(`Score : ${score}`, canvas.width / 2, canvas.height / 2 - 30);
    drawingSurface.fillStyle = "white";
    drawingSurface.fillRect(startBtn.x, startBtn.y, startBtn.width, startBtn.height);
    drawingSurface.fillStyle = "#001122";
    drawingSurface.font = "bold 22px Arial";
    drawingSurface.fillText("Rejouer", canvas.width / 2, startBtn.y + 46);
}
function renderPauseScreen() {
    render();
    drawingSurface.fillStyle = "rgba(0, 0, 0, 0.55)";
    drawingSurface.fillRect(0, 0, canvas.width, canvas.height);
    drawingSurface.textAlign = "center";
    drawingSurface.fillStyle = "azure";
    drawingSurface.font = "bold 42px Arial";
    drawingSurface.fillText("PAUSE", canvas.width / 2, canvas.height / 2 - 30);
    drawingSurface.font = "18px Arial";
    drawingSurface.fillStyle = "white";
    drawingSurface.fillText("Clique sur ▶ ou appuie sur P pour reprendre", canvas.width / 2, canvas.height / 2 + 20);
    drawingSurface.fillStyle = "rgba(255,255,255,0.15)";
    drawingSurface.beginPath();
    drawingSurface.roundRect(pauseBtn.x, pauseBtn.y, pauseBtn.width, pauseBtn.height, 8);
    drawingSurface.fill();
    drawingSurface.font = "26px Arial";
    drawingSurface.fillStyle = "white";
    drawingSurface.fillText("▶", pauseBtn.x + pauseBtn.width / 2, pauseBtn.y + 32);
}
