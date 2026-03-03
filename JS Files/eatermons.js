class Eatermon {
    constructor(data, startingLevel = 1) {
        this.name = data.name;
        this.level = startingLevel; 
        this.hp = data.baseHP;
        this.maxHP = data.maxHP;
        this.attack = data.baseAttack;
        
        // --- THE MISSING STATS (With built-in safety nets!) ---
        this.type = data.type || "Normal";    // If no type is set, it defaults to Normal
        this.defense = data.baseDefense || 5; // If no defense is set, it defaults to 5
        this.speed = data.baseSpeed || 10;    // If no speed is set, it defaults to 10

        this.moves = [];

        // --- Setup moves for wild encounters ---
        this.initializeMoves(data.learnset);
    }

    // Used ONLY when creating the Eatermon
    initializeMoves(learnset) {
        if (!learnset) return;

        let allAvailableMoves = [];

        for (let unlockLevel in learnset) {
            if (this.level >= parseInt(unlockLevel)) {
                let movesAtThisLevel = learnset[unlockLevel];

                if (!Array.isArray(movesAtThisLevel)) {
                    movesAtThisLevel = [movesAtThisLevel];
                }

                movesAtThisLevel.forEach(moveId => {
                    // Prevent duplicates
                    if (!allAvailableMoves.includes(moveId)) {
                        allAvailableMoves.push(moveId);
                    }
                });
            }
        }

        // Grab only the last 4 moves from the array
        let finalFourMoves = allAvailableMoves.slice(-4);

        // Save them to the Eatermon
        finalFourMoves.forEach(moveId => {
            // Also make sure the attack actually exists in your dictionary so it doesn't crash!
            if (attacksData[moveId]) {
                this.moves.push({ id: moveId, ...attacksData[moveId] });
            } else {
                console.warn(`Attack "${moveId}" is missing from attacksData!`);
            }
        });
    }

    levelUp(data) {
        this.level++;
        this.hp += 5;
        this.maxHP += 5;
        this.attack += 2;
        this.defense += 2; // Make sure defense grows too!
        this.speed += 2;   // Make sure speed grows too!

        // --- Check for newly unlocked moves ---
        if (data.learnset && data.learnset[this.level]) {
            let newMoves = data.learnset[this.level];

            newMoves.forEach(moveId => {
                if (this.moves.length < 4) {
                    // We have room! Learn it instantly.
                    console.log(`${this.name} learned ${attacksData[moveId].name}!`);
                    this.moves.push({ id: moveId, ...attacksData[moveId] });
                } else {
                    // Uh oh, we have 4 moves already!
                    console.log(`${this.name} wants to learn ${attacksData[moveId].name}, but already knows 4 moves!`);

                    // Here is where you will eventually call your UI function!
                    // promptForgetMoveUI(this, moveId);
                }
            });
        }
    }
}

const attacksData = {
    "scratch": { name: "Scratch", power: 10, accuracy: 100, type: "Normal" },
    "leaf_slap": { name: "Leaf Slap", power: 15, accuracy: 95, type: "Grass" },
    "sugar_rush": { name: "Sugar Rush", power: 12, accuracy: 100, type: "Sweet" },
    "debug_killer": {name: "Debug Killer", power: 10000, accuracy: 100, type: "Fire"}
};

const typeChart = {
    "Normal": {
        "Rock": 0.5,
        "Ghost": 0.0 // Immune!
    },
    "Fire": {
        "Grass": 2.0, // Super Effective!
        "Water": 0.5, // Not very effective...
        "Fire": 0.5
    },
    "Water": {
        "Fire": 2.0,
        "Grass": 0.5,
        "Water": 0.5
    },
    "Grass": {
        "Water": 2.0,
        "Fire": 0.5,
        "Grass": 0.5
    }
    // You can easily add "Spicy", "Sweet", or "Sour" here later!
};

const eatermonData = [
    { id: "allahdoodle", name: "Allahdoodle", baseHP: 20, baseAttack: 5, maxHP: 20,  },
    { id: "bagoh", name: "BagOh", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "banblast", name: "Ban Blast", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "bannano", name: "Bannano", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "barrytheberry", name: "Barry The Berry", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "clanatus", name: "C. lanatus", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "calamares", name: "Calamares", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "calamars", name: "Calamars", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "chivester", name: "Chivester", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "chivy", name: "Chivy", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "chrisp", name: "ChrisP", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "coreange", name: "Coreange", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "druewl", name: "Druewl", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "flopper", name: "Flopper", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "hank", name: "Hank", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "hardcorecorn", name: "Hardcore Corn", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "hhocolate", name: "Hhocolate", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "hiroshrooma", name: "Hiroshrooma", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "jamin", name: "Jamin", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "kalamar", name: "Kalamar", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "leafle", name: "Leafle", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "legalpot", name: "Legal Pot", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "marchmadmuffin", name: "March Mad-Muffin", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "meatymalt", name: "Meaty Malt", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "pancoook", name: "Pancoook", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "pastamala", name: "Pastamala", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "poporlation", name: "Poporlation", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "purpletrips", name: "Purple Trips", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "sirpit", name: "Sir Pit", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "sober", name: "Sober", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "terminanna", name: "Terminanna", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "tomadoodle", name: "Tomadoodle", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "tomaloudle", name: "Tomaloudle", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "voladorio", name: "Voladorio", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "waffitoff", name: "WaffItOff", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "woodle", name: "Woodle", type: "Grass", baseHP: 20, baseAttack: 5, maxHP: 20, baseSpeed: 5, learnset: { 1: ["scratch"] } },
    { id: "wrapascal", name: "Wrapascal", type: "Grass", baseHP: 100, baseAttack: 5, maxHP: 100, baseSpeed: 10, learnset: { 1: ["debug_killer"] }  },
    // { id: "", name: "", baseHP: 20, baseAttack: 5, maxHP: 20 },
];

const eatermonMap = Object.fromEntries(
    eatermonData.map(e => [e.id, e])
);

function createEatermon(id) {
    const data = eatermonMap[id];
    if (!data) throw new Error(`Eatermon ${id} not found`);
    return new Eatermon(data);
}

// team.push(createEatermon("woodle")); 
