const mapOffsetX = -32;
const mapOffsetY = -32;

let currentMap = MAPS[1]; // <--- THIS WILL BE A GIANT IMPORTANT PART OF EVERYTHING LOL


// Function to draw the floor/background layer (under the player)
function drawLowerMap(ctx) {
    let lowerImg = new Image();
    lowerImg.src = `${currentMap.lowerSrc}`;
    ctx.drawImage(lowerImg, mapOffsetX, mapOffsetY);
}

// Function to draw the foreground layer (over the player)
function drawUpperMap(ctx) {
    let upperImg = new Image();
    upperImg.src = `${currentMap.upperSrc}`;
    ctx.drawImage(upperImg, mapOffsetX, mapOffsetY);
}

// This function checks if a specific column (x) and row (y) is a wall
function isSolid(col, row) {
    if (row < 0 || row >= currentMap.barrierGrid.length ||
        col < 0 || col >= currentMap.barrierGrid[0].length) {
        return true;
    }

    // 1. Check for physical walls in the array
    if (currentMap.barrierGrid[row][col] === 1) {
        return true;
    }

    // 2. Check if an NPC is standing on this tile
    if (currentMap.npcs) {
        for (let i = 0; i < currentMap.npcs.length; i++) {
            let npc = currentMap.npcs[i];
            if (npc.col === col && npc.row === row) {
                return true; // The NPC acts as a solid wall!
            }
        }
    }

    return false; // Tile is empty, you can walk!
}

function drawDebugGrid(ctx, gridSize) {
    ctx.lineWidth = 1;

    for (let row = 0; row < currentMap.barrierGrid.length; row++) {
        for (let col = 0; col < currentMap.barrierGrid[row].length; col++) {

            const tile = currentMap.barrierGrid[row][col];
            const x = (col * gridSize) + mapOffsetX;
            const y = (row * gridSize) + mapOffsetY;

            if (tile === 1) {
                // Red for Solid Walls
                ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
                ctx.fillRect(x, y, gridSize, gridSize);
                ctx.strokeRect(x, y, gridSize, gridSize);
            } else if (tile === 2) {
                // Yellow for Event Spaces
                ctx.fillStyle = 'rgba(255, 255, 0, 0.4)';
                ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
                ctx.fillRect(x, y, gridSize, gridSize);
                ctx.strokeRect(x, y, gridSize, gridSize);
            }
        }
    }
}

function transitionMaps(destination) {
    currentMap = MAPS[destination];
    initNPCs();
}

function coords() {
    console.log(`X : ${player.x / 32} Y: ${player.y / 32}`);
}

function mapSwitch() {
    const currentCol = Math.round((player.x - mapOffsetX) / TILE_SIZE);
    const currentRow = Math.round((player.y - mapOffsetY) / TILE_SIZE);

    if (player.x === targetX && player.y === targetY) {
        moving = false;

        const tileData = currentMap.barrierGrid[currentRow][currentCol];

        if (currentMap.barrierGrid[currentRow][currentCol] === 2) {
            console.log("You stepped on a yellow event space!");
        }

        if (typeof tileData === 'string') {
            switch (tileData) {
                case 'HOME_BEDROOM_TO_HOME_LIVING_ROOM':
                    // Map ID 1, spawn at Column 9, Row 2
                    warpToNewMap(1, 9, 2);
                    break;

                case 'LIVING_ROOM_TO_HOME_BEDROOM':
                    warpToNewMap(0, 3, 5);
                    break;

                case 'LIVING_ROOM_TO_HOME_TOWN':
                    warpToNewMap(2, 1, 13);
                    break;

                case 'HOME_TOWN_TO_HOME_LIVING_ROOM':
                    warpToNewMap(1, 5, 9);
                    break;

                case 'HOME_TOWN_TO_ROUTE_ONE':
                    warpToNewMap(3, 2, 28);
                    break;

                case 'ROUTE_ONE_TO_HOME_TOWN':
                    warpToNewMap(2, 13, 1);
                    break;

                default:
                    console.log("Stepped on unknown event string:", tileData);
                    break;
            }
        }
    }
}

function warpToNewMap(destinationMapId, spawnCol, spawnRow) {
    const fadeScreen = document.getElementById('fadeScreen');

    // 1. Freeze the player so they can't walk during the transition
    inCutscene = true;

    // 2. Trigger the CSS fade-to-black
    fadeScreen.classList.add('fade-black');

    // 3. Wait 500ms for the screen to go completely black
    setTimeout(() => {

        // --- DO THE SNEAKY MAP SWAP IN THE DARK ---
        currentMap = MAPS[destinationMapId];
        setPlayerPosition(spawnCol, spawnRow);

        // Initialize the NPCs for the new room!
        if (typeof initNPCs === "function") initNPCs();

        // 4. Fade back to the game
        fadeScreen.classList.remove('fade-black');

        // 5. Wait another 500ms for the fade-in to finish before unfreezing
        setTimeout(() => {
            inCutscene = false;
        }, 500);

    }, 500); // 500ms perfectly matches your CSS transition time
}