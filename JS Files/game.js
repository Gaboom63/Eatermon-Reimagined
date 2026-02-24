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

let isMovingLeft = false;
let isMovingRight = false;
let isMovingUp = false;
let isMovingDown = false;

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') {
        isMovingLeft = true;
    }

    if (e.key === 'ArrowRight') {
        isMovingRight = true;
    }

    if (e.key === 'ArrowDown') {
        isMovingDown = true;
    }

    if (e.key === 'ArrowUp') {
        isMovingUp = true;
    }
});

function leaveBattle() {
    battleMenu.style.display = 'none';
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    if (isMovingRight) {
        player.x += player.width;
        isMovingRight = false;
    }

    if (isMovingLeft) {
        player.x -= player.width;
        isMovingLeft = false;
    }

    if (isMovingDown) {
        player.y += player.height;
        isMovingDown = false;
    }

    if (isMovingUp) {
        player.y -= player.height;
        isMovingUp = false;
    }

    if (inBattle) {
        Battle();
    }

    requestAnimationFrame(gameLoop);
}
gameLoop();
