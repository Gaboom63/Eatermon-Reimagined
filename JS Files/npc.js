// ==========================================
// npc.js - NPC Logic, Cutscenes, & Dialogue
// ==========================================

const loadedNPCImages = {};

const emoteImages = {
    exclamation: new Image()
};
emoteImages.exclamation.src = 'Images/UI/Emote_Exclamation.png'; // Update this path to match your folders!


function showEmote(npcName, type = 'exclamation') {
    let npc = currentMap.npcs.find(n => n.name === npcName);
    if (!npc) return;

    // Set the emote type and start time
    npc.emote = type;
    npc.emoteStartTime = Date.now();

    // Automatically remove the emote after 1.5 seconds (1500 ms)
    setTimeout(() => {
        // Only clear it if they are still showing THIS specific emote
        if (npc.emote === type) {
            npc.emote = null;
        }
    }, 1500);
}

function initNPCs() {
    if (!currentMap.npcs) return;
    for (let i = 0; i < currentMap.npcs.length; i++) {
        let npc = currentMap.npcs[i];
        npc.x = (npc.col * TILE_SIZE) + mapOffsetX;
        npc.y = (npc.row * TILE_SIZE) + mapOffsetY;
        npc.targetX = npc.x;
        npc.targetY = npc.y;
        npc.moving = false;
    }
}

function drawNPCs() {
    if (!currentMap.npcs) return; 

    for (let i = 0; i < currentMap.npcs.length; i++) {
        let npc = currentMap.npcs[i];

        if (!loadedNPCImages[npc.imageSrc]) {
            let img = new Image();
            img.src = npc.imageSrc;
            loadedNPCImages[npc.imageSrc] = img;
        }

        const npcDir = npc.direction !== undefined ? npc.direction : 0;
        const frameX = npc.moving ? currentFrame * TILE_SIZE : 0;

        // 1. Draw the NPC Body
        ctx.drawImage(
            loadedNPCImages[npc.imageSrc],
            frameX,                
            npcDir * TILE_SIZE,    
            TILE_SIZE,             
            TILE_SIZE,             
            Math.round(npc.x),     
            Math.round(npc.y),     
            TILE_SIZE * SCALE,     
            TILE_SIZE * SCALE      
        );

        // --- NEW: 2. Draw the Emote Balloon if they have one! ---
        if (npc.emote && emoteImages[npc.emote]) {
            // Calculate how long the emote has been on screen
            const elapsed = Date.now() - npc.emoteStartTime;
            
            // Create a smooth bouncing effect (moves up by 4-6 pixels)
            const bounce = Math.abs(Math.sin(elapsed / 150)) * 6;

            ctx.drawImage(
                emoteImages[npc.emote],
                0, 0, TILE_SIZE, TILE_SIZE, // Assuming your emote image is also 32x32
                Math.round(npc.x),
                // Draw it exactly one tile height ABOVE the NPC, minus the bounce!
                Math.round(npc.y) - (TILE_SIZE) - bounce, 
                TILE_SIZE * SCALE,
                TILE_SIZE * SCALE
            );
        }
    }
}

function updateNPCs(deltaTime) {
    if (!currentMap.npcs) return;
    const step = (MOVE_SPEED * deltaTime) / 1000;

    for (let i = 0; i < currentMap.npcs.length; i++) {
        let npc = currentMap.npcs[i];
        if (!npc.moving) continue;

        if (npc.x !== npc.targetX) {
            if (Math.abs(npc.targetX - npc.x) <= step) npc.x = npc.targetX;
            else npc.x += (npc.x < npc.targetX) ? step : -step;
        }

        if (npc.y !== npc.targetY) {
            if (Math.abs(npc.targetY - npc.y) <= step) npc.y = npc.targetY;
            else npc.y += (npc.y < npc.targetY) ? step : -step;
        }

        if (npc.x === npc.targetX && npc.y === npc.targetY) {
            npc.moving = false;
            npc.col = Math.round((npc.x - mapOffsetX) / TILE_SIZE);
            npc.row = Math.round((npc.y - mapOffsetY) / TILE_SIZE);

            if (npc.onReachTarget) {
                npc.onReachTarget();
                npc.onReachTarget = null;
            }
        }
    }
}

// --- Cutscene Functions ---
function moveNPC(npcName, dir, tilesToMove) {
    return new Promise(resolve => {
        let npc = currentMap.npcs.find(n => n.name === npcName);
        if (!npc) return resolve(); 

        npc.direction = dir;
        npc.moving = true;

        let dx = 0, dy = 0;
        if (dir === 0) dy = tilesToMove * TILE_SIZE;      
        else if (dir === 1) dy = -(tilesToMove * TILE_SIZE); 
        else if (dir === 2) dx = tilesToMove * TILE_SIZE;    
        else if (dir === 3) dx = -(tilesToMove * TILE_SIZE); 

        npc.targetX = npc.x + dx;
        npc.targetY = npc.y + dy;
        npc.onReachTarget = resolve; 
    });
}

async function moveToPlayer(npcName) {
    let npc = currentMap.npcs.find(n => n.name === npcName);
    if (!npc) return;

    inCutscene = true; 

    const playerCol = Math.round((player.x - mapOffsetX) / TILE_SIZE);
    const playerRow = Math.round((player.y - mapOffsetY) / TILE_SIZE);

    let diffCol = playerCol - npc.col;
    let diffRow = playerRow - npc.row;

    if (diffCol !== 0) {
        let isLastLeg = (diffRow === 0); 
        let dist = Math.abs(diffCol) - (isLastLeg ? 1 : 0);
        let dir = diffCol > 0 ? 2 : 3; 
        if (dist > 0) await moveNPC(npcName, dir, dist);
    }

    if (diffRow !== 0) {
        let dist = Math.abs(diffRow) - 1; 
        let dir = diffRow > 0 ? 0 : 1;    
        if (dist > 0) await moveNPC(npcName, dir, dist);
    }

    if (npc.col < playerCol) npc.direction = 2;      
    else if (npc.col > playerCol) npc.direction = 3; 
    else if (npc.row < playerRow) npc.direction = 0; 
    else if (npc.row > playerRow) npc.direction = 1; 
    
    inCutscene = false; 
}

async function playIntroCutscene() {
    inCutscene = true; 
    console.log("Mom enters the room...");
    showEmote("Mom", "exclamation");
    
    // 2. Wait a brief second for the player to see it before she moves
    await new Promise(resolve => setTimeout(resolve, 600));

    await moveNPC("Mom", 1, 3);
    currentMap.npcs.find(n => n.name === "Mom").direction = 0;
    console.log("Mom leaves...");
    // await moveNPC("Mom", 2, 2);
    inCutscene = false; 
}

// --- Text Box UI Logic ---
function loadTextBox(talkingIMG, talkingText) {
    let textContainer = document.getElementById('textContainer');
    let talkingImg = document.getElementById('talkingImg');
    let textElement = document.getElementById('mainTalkingBox');

    talkingImg.src = `${talkingIMG}`;
    textContainer.style.display = 'revert';

    if (typeInterval) clearInterval(typeInterval);
    textElement.innerHTML = "";

    fullDialogueText = talkingText;
    isTyping = true;

    let charIndex = 0;
    const typingSpeed = 30; 

    typeInterval = setInterval(() => {
        if (charIndex < fullDialogueText.length) {
            textElement.innerHTML += fullDialogueText.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(typeInterval);
            isTyping = false;
            textElement.innerHTML += ' <span class="dialogue-arrow">▼</span>';
        }
    }, typingSpeed);
}

function closeTextBox() {
    let textContainer = document.getElementById('textContainer');
    textContainer.style.display = 'none';
    inDialogue = false;
    if (typeInterval) clearInterval(typeInterval);
    isTyping = false;
}