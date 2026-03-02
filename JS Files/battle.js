let battleButtons = document.getElementById('attackContainer');
let battleSubMenu = document.getElementById('attackSubContainers');
let subMenuText = document.getElementById('subMenuText');
let eatermonMenuContainer = document.getElementById('eatermonMenuContainer');
let attackMenuContainer = document.getElementById('attackMenuContainer');

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
let findOpponet = Math.floor(Math.random() * routeOne.length);

function Battle(route) {
    if (needsInit) {
        battleMenu.style.display = 'revert';

        playerName.innerHTML = `${battleParty[0].name}`;
        playerXP.innerHTML = `Level. ${battleParty[0].level}`;
        playerHPText.innerHTML = `${battleParty[0].hp} / ${battleParty[0].maxHP}`;
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

// A quick helper function to make the game pause so the player can read text
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Pass in the actual move object the player clicked
async function executeTurn(playerMove) {
    // 1. Hide the attack menu so the player can't click twice!
    document.getElementById('attackContainer').style.display = 'none';

    let activePlayer = battleParty[0];
    let activeEnemy = routeOne[findOpponet];

    // If you fail to run, the enemy gets a free turn!
    let enemyMove;
    if (activeEnemy.moves && activeEnemy.moves.length > 0) {
        let randomMoveIndex = Math.floor(Math.random() * activeEnemy.moves.length);
        enemyMove = activeEnemy.moves[randomMoveIndex];
    } else {
        // FAILSAFE: If the enemy has no moves programmed yet, use Struggle!
        enemyMove = { name: "Struggle", power: 30, accuracy: 100, type: "Normal" };
    }

    // 3. Figure out who goes first based on Speed!
    let turnOrder = [];
    if (activePlayer.speed >= activeEnemy.speed) {
        turnOrder = [
            { attacker: activePlayer, defender: activeEnemy, move: playerMove, isPlayer: true },
            { attacker: activeEnemy, defender: activePlayer, move: enemyMove, isPlayer: false }
        ];
    } else {
        turnOrder = [
            { attacker: activeEnemy, defender: activePlayer, move: enemyMove, isPlayer: false },
            { attacker: activePlayer, defender: activeEnemy, move: playerMove, isPlayer: true }
        ];
    }

    // 4. Loop through the two attacks
    for (let i = 0; i < turnOrder.length; i++) {
        let action = turnOrder[i];

        // Skip the second attack if someone already fainted!
        if (action.attacker.hp <= 0) break;

        // Announce the attack
        battleTextbox.innerHTML = `${action.attacker.name} used ${action.move.name}!`;
        await wait(1500); // Wait 1.5 seconds so the player can read it

        // Calculate and apply damage
        let damage = calculateDamage(action.attacker, action.defender, action.move);
        action.defender.hp -= damage;
        if (action.defender.hp < 0) action.defender.hp = 0; // Don't let HP drop below 0

        // --- NEW: Trigger the white damage flash! ---
        // If the player is attacking, the enemy image flashes. Otherwise, the player image flashes.
        let defenderImg = action.isPlayer ? document.getElementById('enemyEatermonImg') : document.getElementById('playerEatermonImg');

        defenderImg.classList.add('damage-blink');

        // Wait 400ms for the CSS animation to finish
        await wait(400);

        // Remove the class so it can be used again next turn
        defenderImg.classList.remove('damage-blink');

        // Check for Type Effectiveness text!
        let effectiveness = getTypeMultiplier(action.move.type, action.defender.type);

        if (effectiveness >= 2.0) {
            battleTextbox.innerHTML = "It's super effective!";

            // --- NEW: SHAKE THE SCREEN! ---
            let menuDiv = document.getElementById('battleMenu');
            menuDiv.classList.add('shake-active');

            await wait(400); // Wait for the shake to finish
            menuDiv.classList.remove('shake-active'); // Reset it for next time

            await wait(800); // Wait the rest of the time so the player can read

        } else if (effectiveness <= 0.5) {
            battleTextbox.innerHTML = "It's not very effective...";
            await wait(1200);
        }

        // Update the Health Bars visually
        updateBattleUI();

        // Check for faints
        if (action.defender.hp === 0) {
            battleTextbox.innerHTML = `${action.defender.name} fainted!`;
            await wait(2000);

            endBattle(action.isPlayer ? "win" : "lose");
            return; // Stop the entire function right here
        }
    }

    // 5. If nobody fainted, the turn is over. Show the menu again!
    battleTextbox.innerHTML = `What will ${activePlayer.name} do?`;
    document.getElementById('attackContainer').style.display = 'grid';
}

function updateBattleUI() {
    let activePlayer = battleParty[0];
    let activeEnemy = routeOne[findOpponet];

    // Update Player HP Text and Bar
    document.getElementById('playerHP').innerHTML = `${activePlayer.hp} / ${activePlayer.maxHP}`;
    document.getElementById('playerHPBar').style.width = `${(activePlayer.hp / activePlayer.maxHP) * 100}%`;

    // Update Enemy HP Text and Bar
    document.getElementById('enemyHP').innerHTML = `${activeEnemy.hp} / ${activeEnemy.maxHP}`;
    document.getElementById('enemyHPBar').style.width = `${(activeEnemy.hp / activeEnemy.maxHP) * 100}%`;
}

function leaveBattle() {
    battleMenu.style.display = 'none';
}

async function attemptRun() {
    // Hide the menu immediately
    document.getElementById('battleMenu').style.display = 'none';

    let activePlayer = battleParty[0];
    let activeEnemy = routeOne[findOpponet];

    battleTextbox.innerHTML = `Got away safely!`;

    // The classic escape formula! 
    // If your speed is higher, you escape. 
    // If it's lower, you have a percentage chance to escape.
    let escapeOdds = (activePlayer.speed * 128) / activeEnemy.speed + 30; // The "+ 30" adds a flat 30% chance for fairness
    let randomRoll = Math.floor(Math.random() * 256);

    if (activePlayer.speed >= activeEnemy.speed || randomRoll < escapeOdds) {
        battleTextbox.innerHTML = `Got away safely!`;
        await wait(1500);

        // End the battle! (Assuming you will build this function next)
        endBattle("run");
    } else {
        battleTextbox.innerHTML = `Can't escape!`;
        await wait(1500);

        // If you fail to run, the enemy gets a free turn!
        let randomMoveIndex = Math.floor(Math.random() * activeEnemy.moves.length);
        let enemyMove = activeEnemy.moves[randomMoveIndex];

        battleTextbox.innerHTML = `${activeEnemy.name} used ${enemyMove.name}!`;
        await wait(1500);

        let damage = calculateDamage(activeEnemy, activePlayer, enemyMove);
        activePlayer.hp -= damage;
        if (activePlayer.hp < 0) activePlayer.hp = 0;

        updateBattleUI();

        if (activePlayer.hp === 0) {
            battleTextbox.innerHTML = `${activePlayer.name} fainted!`;
            await wait(2000);
            endBattle("lose");
            return;
        }

        // Return to the menu if you survived
        battleTextbox.innerHTML = `What will ${activePlayer.name} do?`;
        document.getElementById('battleMenu').style.display = 'revert';
    }
}

function showMenu(menuID) {
    switch (menuID) {
        case 'attack':
            populateAttackMenu();
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
            populateEatermonMenu();
            battleButtons.style.display = 'none';
            subMenuText.innerHTML = '<u>Eatermons</u>';
            battleSubMenu.style.display = 'revert';
            break;
        case 'run':
            attemptRun();
            break;
    }
}

function attack(selectedMove) {
    // Hide the submenus and return to the main battle UI
    back();

    // Fire the turn engine!
    executeTurn(selectedMove);
}

function getTypeMultiplier(attackType, defenderType) {
    // 1. Check if the attacking type exists in our chart at all
    if (typeChart[attackType]) {

        // 2. Check if the specific defender's type is listed under the attacker
        if (typeChart[attackType][defenderType] !== undefined) {

            // 3. Return the exact multiplier (e.g., 2.0 or 0.5)
            return typeChart[attackType][defenderType];
        }
    }

    // Default: If it's not listed, it's a normal 1x damage hit!
    return 1.0;
}

function calculateDamage(attacker, defender, move) {
    const levelFactor = (2 * attacker.level) / 5 + 2;
    const defenseStat = defender.defense > 0 ? defender.defense : 1;
    const statRatio = attacker.attack / defenseStat;

    let baseDamage = ((levelFactor * move.power * statRatio) / 50) + 2;

    const randomFactor = (Math.floor(Math.random() * 16) + 85) / 100;
    let criticalHit = 1;
    let typeEffectiveness = getTypeMultiplier(move.type, defender.type);

    // --- NEW: Calculate STAB (Same Type Attack Bonus) ---
    let stab = 1.0;
    // If the attacker's type perfectly matches the move's type, give a 50% boost!
    if (attacker.type === move.type) {
        stab = 1.5;
    }

    // Multiply everything together
    const modifier = randomFactor * criticalHit * typeEffectiveness * stab;

    let finalDamage = Math.floor(baseDamage * modifier);

    return Math.max(1, finalDamage);
}

function populateAttackMenu() {
    let moves = battleParty[0].moves;
    attackMenuContainer.style.display = 'grid';

    // 1. Hide all 4 buttons first (just in case the Eatermon only knows 2 moves!)
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`attack${i}`).style.display = 'none';
    }

    // 2. Loop through the moves they actually know
    for (let i = 0; i < moves.length; i++) {
        let btn = document.getElementById(`attack${i + 1}`);
        btn.innerHTML = moves[i].name;
        btn.style.display = 'block'; // Make it visible

        // 3. Attach the exact move data directly to the button!
        btn.onclick = () => attack(moves[i]);
    }
}

function populateEatermonMenu() {
    eatermonMenuContainer.style.display = 'grid';

    // Hide all 6 buttons first
    for (let i = 1; i <= 6; i++) {
        document.getElementById(`eatermon${i}`).style.display = 'none';
    }

    // Loop through the active battle party
    for (let i = 0; i < battleParty.length; i++) {
        let btn = document.getElementById(`eatermon${i + 1}`);
        btn.innerHTML = battleParty[i].name;
        btn.style.display = 'block';

        // Pass the battleParty index instead of a hardcoded string
        btn.onclick = () => swapEatermon(i);
    }
}

function swapEatermon(index) {
    // Prevent them from swapping to the Eatermon that is already fighting!
    if (index === 0) {
        console.log("That Eatermon is already in battle!");
        return;
    }

    // Grab the name of the monster at the requested index
    setLeadEatermon(battleParty[index].name);
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

function back() {
    battleSubMenu.style.display = 'none';
    battleButtons.style.display = 'grid';
    eatermonMenuContainer.style.display = 'none';
    attackMenuContainer.style.display = 'none';
}

async function triggerEncounter() {
    // 1. Freeze the player instantly
    inCutscene = true;
    moving = false;

    let fadeScreen = document.getElementById('fadeScreen');

    // 2. Start the flashing animation
    fadeScreen.classList.add('flash-active');

    // 3. Wait for the 1.5-second animation to finish on a solid black screen
    await wait(1500);

    // 4. Initialize the battle behind the black screen!
    inBattle = true;
    needsInit = true;

    // 5. Remove the flash class, which triggers your normal 0.5s fade-in
    fadeScreen.classList.remove('flash-active');

    // 6. Wait for the fade-in to finish before letting the player click menus
    await wait(500);
    inCutscene = false; // The player is technically frozen by inBattle anyway
}

async function endBattle(result) {
    // Hide all the attack menus 
    document.getElementById('battleMenu').style.display = 'none';

    if (result === "win") {
        battleTextbox.innerHTML = `You won! ${battleParty[0].name} gained 50 XP!`;
        await wait(2000);

        // (We will add the actual level-up math here later!)
    } else if (result === "lose") {
        battleTextbox.innerHTML = `You blacked out!`;
        await wait(2000);

        // Fully heal the team if you lose so you aren't stuck dead
        battleParty.forEach(mon => mon.hp = mon.maxHP);
    }
    // If result === "run", the text is already handled in attemptRun()

    // --- RESET THE BATTLE STATE ---
    inBattle = false;      // Tell the main game loop to stop drawing the battle
    needsInit = true;      // Make sure the next battle builds the UI from scratch
    updatingStats = false;

    // Clear the textbox for next time
    battleTextbox.innerHTML = "";

    // Heal the wild enemy back to full HP so it's ready for the next encounter
    routeOne[findOpponet].hp = routeOne[findOpponet].maxHP;

    // Randomize a NEW enemy for the next encounter!
    findOpponet = Math.floor(Math.random() * routeOne.length);
    document.getElementById('attackContainer').style.display = 'grid';
}