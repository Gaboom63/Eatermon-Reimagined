const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 342;
canvas.height = 186;
ctx.imageSmoothingEnabled = false; // Keeps pixel art crisp

// --------------------------
// Battle Constants & Elements
// --------------------------
let inBattle = false;
let needsInit = true;
let updatingStats = false;
let battleEnding = false;
let isDebugMode = true; // Set to true to see the collision blocks on start

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
// Movement Constants & State
// --------------------------
const FRAME_WIDTH = 32;
const FRAME_HEIGHT = 32;
const COLUMNS = 4;
const FRAME_SIZE = 32;  // The size of the character on the spritesheet
const TILE_SIZE = 32;   // The size of the grid and map tiles
const MOVE_SPEED = 180; // Adjusted for snappy movement
const frameDelay = 64;  // 4 animation frames * 64ms = 256ms per full cycle
const SCALE = 2;        // JS Scale multiplier for 64px movement steps

let direction = 0;
let currentFrame = 0;
let frameTimer = 0;
let lastTime = 0;
let moving = false;
let targetX = 0;
let targetY = 0;

// --------------------------
// Player & Battle Logic
// --------------------------

function loadTextBox(talkingIMG) {
    let textContainer = document.getElementById('textContainer');
    let talkingImg = document.getElementById('talkingImg'); 
    talkingImg.src = `${talkingIMG}`; 
    textContainer.style.display = 'revert';
}

let routeOne = [ // This is PURELY For example / testing and WILL be removed. 
    createEatermon('woodle'),
    createEatermon('tomadoodle'),
    createEatermon('pastmala')
];

let playerTeam = [
    createEatermon('woodle')
];

let player = {
    x: 0, // MUST Update X / Y in 32 px increments, so x: 32 = x: 1 (y: 32 = y: 1)
    y: 0,
    width: 32,
    height: 32,
    name: "Henry",
    team: playerTeam,
    talkingImg: 'Images/Talking-Players/Player_TALKING.png'
};

function Battle(route) {
    let findOpponet = Math.floor(Math.random() * (routeOne.length - routeOne.length, routeOne.length)) + routeOne.length - routeOne.length;
    if (needsInit) {
        battleMenu.style.display = 'revert';

        playerName.innerHTML = `${player.team[0].name}`;
        playerXP.innerHTML = `Level. ${player.team[0].level}`;
        playerHPText.innerHTML = `${player.team[0].hp} / ${player.team[0].maxHP}`;
        playerEatermonImg.src = `Images/Eatermons/${player.team[0].name}.png`;
        playerHPBar.style.width = `${(player.team[0].hp / player.team[0].maxHP) * 100}%`;

        enemyName.innerHTML = `${routeOne[findOpponet].name}`;
        enemyXP.innerHTML = `Level. ${routeOne[findOpponet].level}`;
        enemyHPText.innerHTML = `${routeOne[findOpponet].hp} / ${routeOne[findOpponet].maxHP}`;
        enemyEatermonImg.src = `Images/Eatermons/${routeOne[findOpponet].name}.png`;
        enemyHPBar.style.width = `${(routeOne[findOpponet].hp / routeOne[findOpponet].maxHP) * 100}%`;

        battleTextbox.innerHTML = `GO ${player.team[0].name}!`;
        setTimeout(() => {
            battleTextbox.innerHTML = `${player.name}'s ${player.team[0].name} VS. ${routeOne[findOpponet].name}! <br> What will you do?`;
        }, 1000);
        needsInit = false;
        updatingStats = true;
    } else if (updatingStats && !needsInit) {
        playerHPText.innerHTML = `${player.team[0].hp} / ${player.team[0].maxHP}`;
        playerHPBar.style.width = `${(player.team[0].hp / player.team[0].maxHP) * 100}%`;

        enemyHPText.innerHTML = `${routeOne[findOpponet].hp} / ${routeOne[findOpponet].maxHP}`;
        enemyHPBar.style.width = `${(routeOne[findOpponet].hp / routeOne[findOpponet].maxHP) * 100}%`;

        if (player.team[0].hp === 0 || routeOne[findOpponet].hp === 0) {
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

// --------------------------
// Movement & Animation Functions
// --------------------------
function startMove(dx, dy) {
    moving = true;
    targetX = player.x + dx;
    targetY = player.y + dy;
}

function updateAnimation(deltaTime) {
    if (!moving) {
        currentFrame = 0; // Snap to idle frame
        frameTimer = 0;   // Reset the timer
        return;
    }

    frameTimer += deltaTime;

    if (frameTimer >= frameDelay) {
        currentFrame++;
        if (currentFrame >= COLUMNS) currentFrame = 0;
        frameTimer = 0;
    }
}

function updateMovement(deltaTime) {
    if (!moving) return;

    const step = (MOVE_SPEED * deltaTime) / 1000;

    if (player.x !== targetX) {
        if (Math.abs(targetX - player.x) <= step) {
            player.x = targetX;
        } else {
            player.x += (player.x < targetX) ? step : -step;
        }
    }

    if (player.y !== targetY) {
        if (Math.abs(targetY - player.y) <= step) {
            player.y = targetY;
        } else {
            player.y += (player.y < targetY) ? step : -step;
        }
    }

    if (player.x === targetX && player.y === targetY) {
        moving = false;
    }
}

// --------------------------
// Drawing Logic
// --------------------------
let playerImg = new Image();
playerImg.src = 'Images/Player/Player.png';

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

// --------------------------
// Main Game Loop
// --------------------------
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

    // --- CAMERA LOGIC ---
    ctx.save();

    // Calculate camera offset to center the player
    const cameraX = (canvas.width / 2) - (player.x + ((TILE_SIZE * SCALE) / 2));
    const cameraY = (canvas.height / 2) - (player.y + ((TILE_SIZE * SCALE) / 2));

    ctx.translate(Math.floor(cameraX), Math.floor(cameraY));

    // Draw Map & Player (Using functions imported from map.js)
    drawLowerMap(ctx);
    drawPlayer();
    drawUpperMap(ctx);

    if (isDebugMode) {
        drawDebugGrid(ctx, TILE_SIZE);
    }

    if (player.x === targetX && player.y === targetY) {
        moving = false;

        // Calculate the exact grid column and row we just landed on
        // (Remembering to subtract the map offset!)
        const currentCol = Math.round((player.x - mapOffsetX) / TILE_SIZE);
        const currentRow = Math.round((player.y - mapOffsetY) / TILE_SIZE);

        // Check if the space we just landed on is an event (2)
        if (currentMap.barrierGrid[currentRow][currentCol] === 2) {
            console.log("You stepped on a yellow event space!");
        }
    }

    ctx.restore();

    requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);