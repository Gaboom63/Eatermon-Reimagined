class Eatermon {
    constructor(data) {
        this.name = data.name;
        this.level = 1;
        this.hp = data.baseHP;
        this.maxHP = data.maxHP; 
        this.attack = data.baseAttack;
    }

    levelUp() {
        this.level++;
        this.hp += 5;
        this.maxHP += 5;  
        this.attack += 2;
    }
}

const eatermonData = [
    { id: "allahdoodle", name: "Allahdoodle", baseHP: 20, baseAttack: 5, maxHP: 20 },
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
    { id: "legalpot", name: "Legal Pot", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "marchmadmuffin", name: "March Mad-Muffin", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "meatymalt", name: "Meaty Malt", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "pancoook", name: "Pancoook", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "pastmala", name: "Pastmala", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "poporlation", name: "Poporlation", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "purpletrips", name: "Purple Trips", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "sirpit", name: "Sir Pit", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "sober", name: "Sober", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "tomadoodle", name: "Tomadoodle", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "tomaloudle", name: "Tomaloudle", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "voladorio", name: "Voladorio", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "waffitoff", name: "WaffItOff", baseHP: 20, baseAttack: 5, maxHP: 20 },
    { id: "woodle", name: "Woodle", baseHP: 20, baseAttack: 5, maxHP: 20 },
    // { id: "", name: "", baseHP: 20, baseAttack: 5 },
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
