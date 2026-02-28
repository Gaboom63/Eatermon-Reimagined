let battleButtons = document.getElementById('attackContainer');
let battleSubMenu = document.getElementById('attackSubContainers');
let subMenuText = document.getElementById('subMenuText');

let eatermon1 = document.getElementById('eatermon1');
let eatermon2 = document.getElementById('eatermon2');
let eatermon3 = document.getElementById('eatermon3');
let eatermon4 = document.getElementById('eatermon4');
let eatermon5 = document.getElementById('eatermon5');
let eatermon6 = document.getElementById('eatermon6');

let routeOne = [ // This is PURELY For example / testing and WILL be removed. 
    createEatermon('woodle'),
    createEatermon('tomadoodle'),
    createEatermon('pastmala')
];

let playerTeam = [
    createEatermon('wrapascal'),
    createEatermon('woodle')
];

let battleParty = [...playerTeam];
let findOpponet = Math.floor(Math.random() * (routeOne.length - routeOne.length, routeOne.length)) + routeOne.length - routeOne.length;

function Battle(route) {
    if (needsInit) {
        battleMenu.style.display = 'revert';

        playerName.innerHTML = `${battleParty[0].name}`;
        playerXP.innerHTML = `Level. ${battleParty[0].level}`;
        playerHPText.innerHTML = `${battleParty[0].hp} / ${player.team[0].maxHP}`;
        playerEatermonImg.src = `Images/Eatermons/${battleParty[0].name}.png`;
        playerHPBar.style.width = `${(battleParty[0].hp / battleParty[0].maxHP) * 100}%`;

        enemyName.innerHTML = `${routeOne[findOpponet].name}`;
        enemyXP.innerHTML = `Level. ${routeOne[findOpponet].level}`;
        enemyHPText.innerHTML = `${routeOne[findOpponet].hp} / ${routeOne[findOpponet].maxHP}`;
        enemyEatermonImg.src = `Images/Eatermons/${routeOne[findOpponet].name}.png`;
        enemyHPBar.style.width = `${(routeOne[findOpponet].hp / routeOne[findOpponet].maxHP) * 100}%`;

        battleTextbox.innerHTML = `GO ${battleParty[0].name}!`;
        setTimeout(() => {
            battleTextbox.innerHTML = `${player.name}'s ${battleParty[0].name} VS. ${routeOne[findOpponet].name}! <br> What will you do?`;
        }, 1000);
        needsInit = false;
        updatingStats = true;
        populateEatermonMenu();
    } else if (updatingStats && !needsInit) {
        playerHPText.innerHTML = `${battleParty[0].hp} / ${battleParty[0].maxHP}`;
        playerHPBar.style.width = `${(battleParty[0].hp / battleParty[0].maxHP) * 100}%`;

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

function showMenu(menuID) {
    switch (menuID) {
        case 'attack':
            battleButtons.style.display = 'none';
            subMenuText.innerHTML = '<u>Attacks</u>';
            battleSubMenu.style.display = 'revert';
            break;
        case 'bag':
            battleButtons.style.display = 'none';
            subMenuText.innerHTML = '<u>Bag</u>';
            battleSubMenu.style.display = 'revert';
            break;
        case 'eatermon':
            battleButtons.style.display = 'none';
            subMenuText.innerHTML = '<u>Eatermons</u>';
            battleSubMenu.style.display = 'revert';
            break;
        case 'run':
            // battleSubMenu.style.display = 'revert';
            break;
    }
}

function populateEatermonMenu() {
    let teamLength = playerTeam.length;
    switch (teamLength) {
        case 1:
            eatermon1.innerHTML = `${playerTeam[0].name}`;
            break;
        case 2:
            eatermon1.innerHTML = `${playerTeam[0].name}`;
            eatermon2.innerHTML = `${playerTeam[1].name}`;
            break;
        case 3:
            eatermon1.innerHTML = `${playerTeam[0].name}`;
            eatermon2.innerHTML = `${playerTeam[1].name}`;
            eatermon3.innerHTML = `${playerTeam[2].name}`;
            break;
        case 4:
            eatermon1.innerHTML = `${playerTeam[0].name}`;
            eatermon2.innerHTML = `${playerTeam[1].name}`;
            eatermon3.innerHTML = `${playerTeam[2].name}`;
            eatermon4.innerHTML = `${playerTeam[3].name}`;
            break;
        case 5:
            eatermon1.innerHTML = `${playerTeam[0].name}`;
            eatermon2.innerHTML = `${playerTeam[1].name}`;
            eatermon3.innerHTML = `${playerTeam[2].name}`;
            eatermon4.innerHTML = `${playerTeam[3].name}`;
            eatermon5.innerHTML = `${playerTeam[4].name}`;
            break;
        case 6:
            eatermon1.innerHTML = `${playerTeam[0].name}`;
            eatermon2.innerHTML = `${playerTeam[1].name}`;
            eatermon3.innerHTML = `${playerTeam[2].name}`;
            eatermon4.innerHTML = `${playerTeam[3].name}`;
            eatermon5.innerHTML = `${playerTeam[4].name}`;
            eatermon6.innerHTML = `${playerTeam[5].name}`;
            break;
        default:
            console.log("No Eatermons Exist In The Players Party! ERROR!");
            break;
    }
}

function setLeadEatermon(name) {
    const index = battleParty.findIndex(mon => mon.name === name);

    if (index > -1) {
        // Remove it from its current spot
        const [selectedMon] = battleParty.splice(index, 1);
        // Put it at the very front
        battleParty.unshift(selectedMon);
    }

    playerName.innerHTML = `${battleParty[0].name}`;
    playerXP.innerHTML = `Level. ${battleParty[0].level}`;
    playerHPText.innerHTML = `${battleParty[0].hp} / ${battleParty[0].maxHP}`;
    playerEatermonImg.src = `Images/Eatermons/${battleParty[0].name}.png`;
    playerHPBar.style.width = `${(battleParty[0].hp / battleParty[0].maxHP) * 100}%`;

    battleTextbox.innerHTML = `${player.name} Sent Out ${battleParty[0].name}!`;
    setTimeout(() => {
        battleTextbox.innerHTML = `${player.name}'s ${battleParty[0].name} VS. ${routeOne[findOpponet].name}! <br> What will you do?`;
    }, 1000);
    back();
}

function swapEatermon(eatermon) {
    switch (eatermon) {
        case 'eatermon1':
            setLeadEatermon(`${playerTeam[0].name}`);
            break;
        case 'eatermon2':
            setLeadEatermon(`${playerTeam[1].name}`);
            break;
        case 'eatermon3':
            setLeadEatermon(`${playerTeam[2].name}`);
            break;
        case 'eatermon4':
            setLeadEatermon(`${playerTeam[3].name}`);
            break;
        case 'eatermon5':
            setLeadEatermon(`${playerTeam[4].name}`);
            break;
        case 'eatermon6':
            setLeadEatermon(`${playerTeam[5].name}`);
            break;
        default:
            console.log("Did Not Find Any Eatermon In Party!");
            break;
    }
}

function back() {
    battleSubMenu.style.display = 'none';
    battleButtons.style.display = 'grid';
}