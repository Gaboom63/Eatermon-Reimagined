const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// This is all battle constants bellow
let inBattle = false;
let needsInit = true;
let updatingStats = false;
let battleEnding = false;

const battleMenu = document.getElementById('battleMenu');

const playerHPContiner = document.getElementById('playerHPContiner');
const playerName = document.getElementById('playerName');
const playerXP = document.getElementById('playerXP');
const playerHPText = document.getElementById('playerHP');
const playerEatermonImg = document.getElementById('playerEatermonImg');
const playerHPBar = document.getElementById('playerHPBar');

const enemyHPContiner = document.getElementById('enemyHPContiner');
const enemyName = document.getElementById('enemyName');
const enemyXP = document.getElementById('enemyXP');
const enemyHPText = document.getElementById('enemyHP');
const enemyEatermonImg = document.getElementById('enemyEatermonImg');
const enemyHPBar = document.getElementById('enemyHPBar');

const battleTextbox = document.getElementById('textbox');
// --------------------------

// Everything bellow is for movement
const FRAME_WIDTH = 32;
const FRAME_HEIGHT = 32;
const COLUMNS = 4;
const FRAME_SIZE = 32;  // The size of the character on the spritesheet
const TILE_SIZE = 32;   // The size of the grid and map tiles
const MOVE_SPEED = 180; // Doubled from 128 so it feels the same over larger tiles
const frameDelay = 64;  // 4 animation frames * 64ms = 256ms per full animation cycle
const SCALE = 2;

let direction = 0;
let currentFrame = 0;
let frameTimer = 0;
let lastTime = 0;
let moving = false;
let targetX = 0;
let targetY = 0;
// ---------------------- 

function Battle(route) { // Route could in the future determine the Eatermons available / the battle initiatied. 
    let findOpponet = Math.floor(Math.random() * (routeOne.length - routeOne.length, routeOne.length)) + routeOne.length - routeOne.length;
    if (needsInit) {
        battleMenu.style.display = 'revert';

        playerName.innerHTML = `${player.team[0].name}`; // Name
        playerXP.innerHTML = `Level. ${player.team[0].level}`; // Level. #
        playerHPText.innerHTML = `${player.team[0].hp} / ${player.team[0].maxHP}`;  // Hp / maxHp text
        playerEatermonImg.src = `Images/Eatermons/${player.team[0].name}.png`; // Image 
        playerHPBar.style.width = `${(player.team[0].hp / player.team[0].maxHP) * 100}%`; // Health Bar (Red). 

        enemyName.innerHTML = `${routeOne[findOpponet].name}`; // Name
        enemyXP.innerHTML = `Level. ${routeOne[findOpponet].level}`; // Level. #
        enemyHPText.innerHTML = `${routeOne[findOpponet].hp} / ${routeOne[findOpponet].maxHP}`;  // Hp / maxHp text
        enemyEatermonImg.src = `Images/Eatermons/${routeOne[findOpponet].name}.png` // Image 
        enemyHPBar.style.width = `${(routeOne[findOpponet].hp / routeOne[findOpponet].maxHP) * 100}%` // Health Bar (Red). 

        battleTextbox.innerHTML = `GO ${player.team[0].name}!`
        setTimeout(() => {
            battleTextbox.innerHTML = `${player.name}'s ${player.team[0].name} VS. ${routeOne[findOpponet].name}! <br> What will you do?`
        }, 1000);
        needsInit = false;
        updatingStats = true;
    } else if (updatingStats && !needsInit) {
        playerHPText.innerHTML = `${player.team[0].hp} / ${player.team[0].maxHP}`;
        playerHPBar.style.width = `${(player.team[0].hp / player.team[0].maxHP) * 100}%`;

        enemyHPText.innerHTML = `${routeOne[findOpponet].hp} / ${routeOne[findOpponet].maxHP}`;  // Hp / maxHp text
        enemyHPBar.style.width = `${(routeOne[findOpponet].hp / routeOne[findOpponet].maxHP) * 100}%`;

        if (player.team[0].hp === 0 || routeOne[findOpponet].hp === 0) { // Come back to this later. Make black out screen for player. 
            updatingStats = false;
            battleEnding = true;
        }
    } else if (battleEnding) {
        // Add Ending Logic in future. 
    }
}


function leaveBattle() {
    battleMenu.style.display = 'none';
}

let routeOne = [ // This is PURELY For example / testing and WILL be removed. 
    createEatermon('woodle'),
    createEatermon('tomadoodle'),
    createEatermon('pastmala')
]


let playerTeam = [
    createEatermon('woodle')
]

let player = {
    x: 0,
    y: 0,
    width: 32,
    height: 32,
    name: "Henry",
    team: playerTeam
}

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// When a key is pressed, mark it as true
document.addEventListener('keydown', e => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
});

// When a key is released, mark it as false
document.addEventListener('keyup', e => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

document.addEventListener('keydown', e => {
    // Prevent moving if already walking OR if in a battle
    if (moving || inBattle) return;

    if (e.key === 'ArrowDown') {
        direction = 0;
        startMove(0, TILE_SIZE);
    }
    if (e.key === 'ArrowUp') {
        direction = 1;
        startMove(0, -TILE_SIZE);
    }
    if (e.key === 'ArrowRight') {
        direction = 2;
        startMove(TILE_SIZE, 0);
    }
    if (e.key === 'ArrowLeft') {
        direction = 3;
        startMove(-TILE_SIZE, 0);
    }
});

function handleInput() {
    if (moving || inBattle) return;

    // Multiply TILE_SIZE by SCALE to match your 96px visual size
    const moveDistance = TILE_SIZE * SCALE;

    if (keys.ArrowDown) {
        direction = 0;
        startMove(0, moveDistance);
    } else if (keys.ArrowUp) {
        direction = 1;
        startMove(0, -moveDistance);
    } else if (keys.ArrowRight) {
        direction = 2;
        startMove(moveDistance, 0);
    } else if (keys.ArrowLeft) {
        direction = 3;
        startMove(-moveDistance, 0);
    }
}
function startMove(dx, dy) {
    moving = true;
    targetX = player.x + dx;
    targetY = player.y + dy;
}

function updateAnimation(deltaTime) {
    if (!moving) {
        currentFrame = 0; // Snap to idle frame
        frameTimer = 0;   // Reset the timer for the next time we move
        return;
    }

    frameTimer += deltaTime;

    if (frameTimer >= frameDelay) {
        currentFrame++;
        if (currentFrame >= 4) currentFrame = 0;
        frameTimer = 0;
    }
}

function updateMovement(deltaTime) {
    if (!moving) return;

    // How many pixels to move this frame based on time (ms)
    const step = (MOVE_SPEED * deltaTime) / 1000;

    // Handle X movement
    if (player.x !== targetX) {
        if (Math.abs(targetX - player.x) <= step) {
            player.x = targetX; // Snap to target to prevent overshooting
        } else {
            player.x += (player.x < targetX) ? step : -step;
        }
    }

    // Handle Y movement
    if (player.y !== targetY) {
        if (Math.abs(targetY - player.y) <= step) {
            player.y = targetY; // Snap to target to prevent overshooting
        } else {
            player.y += (player.y < targetY) ? step : -step;
        }
    }

    // Stop moving once we hit the exact target
    if (player.x === targetX && player.y === targetY) {
        moving = false;
    }
}

// Divide your CSS dimensions by your SCALE (3) to get the internal resolution
canvas.width = 342;
canvas.height = 186;

function drawPlayer() {
    const drawX = Math.round(player.x);
    const drawY = Math.round(player.y);

    ctx.drawImage(
        playerImg,
        currentFrame * TILE_SIZE,
        direction * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE,
        drawX,
        drawY,
        TILE_SIZE * SCALE,
        TILE_SIZE * SCALE
    );
}

let playerImg = new Image();
playerImg.src = 'Images/Player/Player.png';
ctx.imageSmoothingEnabled = false;

let lowerMapImg = new Image();
lowerMapImg.src = 'Images/Maps/lowerBedroom.png'
ctx.imageSmoothingEnabled = false;

let upperMapImg = new Image();
upperMapImg.src = 'Images/Maps/upperBedroom.png'
ctx.imageSmoothingEnabled = false;

function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (inBattle) {
        Battle();
    }

    handleInput();
    updateMovement(deltaTime);
    updateAnimation(deltaTime);

    // --- CAMERA LOGIC START ---
    ctx.save();

    const cameraX = (canvas.width / 2) - (player.x + (TILE_SIZE / 2));
    const cameraY = (canvas.height / 2) - (player.y + (TILE_SIZE / 2));

    ctx.translate(Math.floor(cameraX), Math.floor(cameraY));

    ctx.drawImage(lowerMapImg, -32, -32); // Draw Lower Map

    drawPlayer();

    ctx.drawImage(upperMapImg, -32, -32); 

    ctx.restore();

    requestAnimationFrame(gameLoop);
}

gameLoop();
