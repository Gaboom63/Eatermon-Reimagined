// ==========================================
// main.js - Core Engine and Game Loop
// ==========================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 342;
canvas.height = 186;
ctx.imageSmoothingEnabled = false; 

// --- HTML Elements ---
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

// --- Global States & Variables ---
let inBattle = false;
let needsInit = true;
let updatingStats = false;
let battleEnding = false;
let isDebugMode = true; 
let inCutscene = false; 
let inDialogue = false;
let currentTalkingNPC = null; 
let currentDialogueIndex = 0; 
let isTyping = false;
let typeInterval = null;
let fullDialogueText = ""; 

// --- Movement Constants ---
const FRAME_WIDTH = 32;
const FRAME_HEIGHT = 32;
const COLUMNS = 4;
const FRAME_SIZE = 32;  
const TILE_SIZE = 32;   
const MOVE_SPEED = 180; 
const frameDelay = 64;  
const SCALE = 2;        

let direction = 0;
let currentFrame = 0;
let frameTimer = 0;
let lastTime = 0;
let moving = false;
let targetX = 0;
let targetY = 0;

// --- Player Initialization ---
let playerTeam = [ createEatermon('woodle') ];
const startCol = 1;
const startRow = 1;

let player = {
    // Assuming mapOffsetX and mapOffsetY are defined in your map.js file!
    x: (startCol * TILE_SIZE) + mapOffsetX,
    y: (startRow * TILE_SIZE) + mapOffsetY, 
    width: 32,
    height: 32,
    name: "Henry",
    team: playerTeam,
    talkingImg: 'Images/Talking-Players/Player_TALKING.png'
};

let playerImg = new Image();
playerImg.src = 'Images/Player/Player.png';

function setPlayerPosition(col, row) {
    player.x = (col * TILE_SIZE) + mapOffsetX;
    player.y = (row * TILE_SIZE) + mapOffsetY;
    targetX = player.x;
    targetY = player.y;
    moving = false; 
}

// --- Input Handling ---
// [!!! PASTE YOUR keydown, keyup, and handleInput() FUNCTIONS HERE !!!]


// --- Movement & Animation ---
function startMove(dx, dy) {
    moving = true;
    targetX = player.x + dx;
    targetY = player.y + dy;
}

function updateAnimation(deltaTime) {
    if (!moving) {
        currentFrame = 0; 
        frameTimer = 0;   
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
        if (Math.abs(targetX - player.x) <= step) player.x = targetX;
        else player.x += (player.x < targetX) ? step : -step;
    }

    if (player.y !== targetY) {
        if (Math.abs(targetY - player.y) <= step) player.y = targetY;
        else player.y += (player.y < targetY) ? step : -step;
    }

    if (player.x === targetX && player.y === targetY) moving = false;
}

function drawPlayer() {
    ctx.drawImage(
        playerImg,
        currentFrame * TILE_SIZE,
        direction * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE,
        Math.round(player.x),
        Math.round(player.y),
        TILE_SIZE * SCALE,
        TILE_SIZE * SCALE
    );
}

// --- Core Game Loop ---
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
    updateNPCs(deltaTime); 

    ctx.save();

    const renderX = Math.round(player.x);
    const renderY = Math.round(player.y);
    const cameraX = (canvas.width / 2) - (renderX + ((TILE_SIZE * SCALE) / 2));
    const cameraY = (canvas.height / 2) - (renderY + ((TILE_SIZE * SCALE) / 2));

    ctx.translate(cameraX | 0, cameraY | 0); 
    
    // Draw calls (assuming map functions are in map.js)
    if (typeof drawLowerMap === "function") drawLowerMap(ctx);
    drawNPCs(); 
    drawPlayer();
    if (typeof drawUpperMap === "function") drawUpperMap(ctx);

    if (isDebugMode && typeof drawDebugGrid === "function") {
        drawDebugGrid(ctx, TILE_SIZE);
    }

    // Checking door transitions (assuming mapSwitch is in map.js or similar)
    if (typeof mapSwitch === "function") mapSwitch();

    ctx.restore();

    requestAnimationFrame(gameLoop);
}

// Start everything up!
if (typeof initNPCs === "function") initNPCs();
requestAnimationFrame(gameLoop);