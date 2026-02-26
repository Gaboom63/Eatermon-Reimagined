// ==========================================
// battle.js - Combat and Encounter Logic
// ==========================================

let routeOne = [ // This is PURELY For example / testing and WILL be removed. 
    createEatermon('woodle'),
    createEatermon('tomadoodle'),
    createEatermon('pastmala')
];

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