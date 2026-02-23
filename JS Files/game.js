const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = {
    x: 0,
    y: 0,
    width: 32,
    height: 32
}

let isMovingLeft = false; 
let isMovingRight = false;

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') {
        isMovingLeft = true; 
    }

    if (e.key === 'ArrowRight') {
        isMovingRight = true;
    }
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    if (isMovingRight) {
        player.x += player.width;
        isMovingRight = false;
    }

    if(isMovingLeft) {
         player.x -= player.width;
        isMovingLeft = false;
    }

    requestAnimationFrame(gameLoop);
}
gameLoop();