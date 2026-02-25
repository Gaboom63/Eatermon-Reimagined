const mapOffsetX = -32;
const mapOffsetY = -32;

let currentMap = MAPS[0]; // <--- THIS WILL BE A GIANT IMPORTANT PART OF EVERYTHING LOL


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
    // 1. Check if the player is trying to walk completely off the map grid
    if (row < 0 || row >= currentMap.barrierGrid.length || col < 0 || col >= currentMap.barrierGrid[0].length) {
        return true; // Treat out-of-bounds as a wall
    }
    // 2. Check the grid array. If it's a 1, it's solid!
    return currentMap.barrierGrid[row][col] === 1;
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