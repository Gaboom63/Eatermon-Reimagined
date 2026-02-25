const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false
};

document.addEventListener('keydown', e => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }

    if (e.key.toLowerCase() === 'b') {
        isDebugMode = !isDebugMode;
    }
});

document.addEventListener('keyup', e => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

function handleInput() {
    if (moving || inBattle) return;

    const moveDistance = TILE_SIZE;

    const currentCol = Math.round((player.x - mapOffsetX) / moveDistance);
    const currentRow = Math.round((player.y - mapOffsetY) / moveDistance);

    if (keys.ArrowDown || keys.s) {
        direction = 0;
        if (!isSolid(currentCol, currentRow + 1)) {
            startMove(0, moveDistance);
        }
    } else if (keys.ArrowUp || keys.w) {
        direction = 1;
        if (!isSolid(currentCol, currentRow - 1)) {
            startMove(0, -moveDistance);
        }
    } else if (keys.ArrowRight || keys.d) {
        direction = 2;
        if (!isSolid(currentCol + 1, currentRow)) {
            startMove(moveDistance, 0);
        }
    } else if (keys.ArrowLeft || keys.a) {
        direction = 3;
        if (!isSolid(currentCol - 1, currentRow)) {
            startMove(-moveDistance, 0);
        }
    }
}
