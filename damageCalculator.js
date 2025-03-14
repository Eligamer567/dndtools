// Store character data
let characterData = {};
let selectedCharacter = null;

// Load character data from JSON
fetch("json/characterData.json")
    .then(response => response.json())
    .then(data => {
        characterData = data;
        populateCharacterDropdown();
    })
    .catch(error => console.error("Error loading character data:", error));

// Populate the character dropdown
function populateCharacterDropdown() {
    let dropdown = document.getElementById("character-select");
    dropdown.innerHTML = '<option value="">-- Select --</option>'; 

    for (let character in characterData) {
        let option = document.createElement("option");
        option.value = character;
        option.textContent = character;
        dropdown.appendChild(option);
    }
}

// Handle character selection
function chooseCharacter() {
    let dropdown = document.getElementById("character-select");
    let choice = dropdown.value;

    if (choice && characterData[choice]) {
        selectedCharacter = characterData[choice];
        loadCharacterInfo();
        loadWeapons();
    } else {
        selectedCharacter = null;
        document.getElementById("character-stats").innerHTML = ""; 
        document.getElementById("weapon-list").innerHTML = ""; 
        document.getElementById("character-abilities").innerHTML = "";
    }
}

// Load full character info (stats, abilities, resistances, etc.)
function loadCharacterInfo() {
    let sc = selectedCharacter;
    if (!sc) return;

    let statsList = document.getElementById("character-stats");
    statsList.innerHTML = "<h3>Stats</h3>";
    statsList.innerHTML += `<p>Armor class: ${sc.stats.AC}, Hitpoints: ${sc.stats.Hitpoints}</p>`;
    statsList.innerHTML += `<p>Senses:${sc.stats.Senses}</p>`;
    statsList.innerHTML += `<p>Saving throws: ${sc.stats.Saving_throws}</p>`;
    statsList.innerHTML += `<p></p>`;
    statsList.innerHTML += `<p>
    Str: ${sc.mainstats.str},  
    Dex: ${sc.mainstats.dex}, 
    Con: ${sc.mainstats.con}, 
    Int: ${sc.mainstats.int}, 
    Wis: ${sc.mainstats.wis}, 
    Chr: ${sc.mainstats.chr} 
    </p>`;
    

    let abilitiesList = document.getElementById("character-abilities");
    abilitiesList.innerHTML = "";
    document.getElementById("damage-output").innerHTML = "Weapon stats & damage will appear here";

    if(sc.LengendaryActions){
    if(Object.keys(sc.LengendaryActions).length>0){
        abilitiesList.innerHTML = "<h3>Legendary Actions</h3>";
        for (let ability in selectedCharacter.LengendaryActions) {
            let value = selectedCharacter.LengendaryActions[ability];
            if (Array.isArray(value)) {
                abilitiesList.innerHTML += `<p><strong>${ability}:</strong> ${value.join(", ")}</p>`;
            } else {
                abilitiesList.innerHTML += `<p><strong>${ability}:</strong> ${value}</p>`;
            }
        }
    }
}
    abilitiesList.innerHTML += "<h3>Other abilities</h3>";
    for (let ability in selectedCharacter.extra) {
        let value = selectedCharacter.extra[ability];
        if (Array.isArray(value)) {
            abilitiesList.innerHTML += `<p><strong>${ability}:</strong> ${value.join(", ")}</p>`;
        } else {
            abilitiesList.innerHTML += `<p><strong>${ability}:</strong> ${value}</p>`;
        }
    }
}

// Load weapons as buttons
function loadWeapons() {
    let weaponList = document.getElementById("weapon-list");
    weaponList.innerHTML = ""; 

    if (!selectedCharacter) return;

    for (let weapon in selectedCharacter.weapons) {
        let li = document.createElement("li");
        li.textContent = weapon+" ";

        let useButton = document.createElement("button");
        useButton.textContent = "Use";
        useButton.onclick = () => calculateDamage(weapon);

        li.appendChild(useButton);
        weaponList.appendChild(li);
    }
}

// Calculate attack roll and damage
function calculateDamage(weaponName) {
    // Get weapon info
    if (!selectedCharacter) return;
    let weapon = selectedCharacter.weapons[weaponName];
    let area = document.getElementById("damage-output");
    if (!weapon) return;

    // Diffrent types are calculated/displayed diffrently. Types are Melee and AOE
    if (weapon.type === "AOE"){
        area.innerHTML = `<p>Range: ${weapon.range}</p>`;
        for (let hits in weapon.hits) {
            let hit = weapon.hits[hits];
            let damage = [];
            let totalDMG = 0;
            if(Object.keys(weapon.hits).length>1){
                area.innerHTML += `<h3>Hit ${hits}</h3>`;
            }
            if(hit.SavingThrow!="None"){
                area.innerHTML += `<p>Saving throw: DC ${hit.SavingThrow[0]} ${hit.SavingThrow[1]}, ${hit.SaveMulti} damage on success</p>`;
            }
            for (let i = 0; i < hit.BaseDMG[0]; i++) {
                let roll = Math.floor(Math.random() * hit.BaseDMG[1]) + 1;
                damage.push(roll);
                totalDMG += roll;
            }

            totalDMG += hit.BaseDMG[2];

            area.innerHTML += `<p>Base Damage: ${totalDMG} ${hit.type} damage (${hit.BaseDMG[0]}d${hit.BaseDMG[1]} + ${hit.BaseDMG[2]})</p>`;
            area.innerHTML += `<p>Damage rolls: [${damage.join(", ")}]</p>`;
            if(hit.extraEffect!="None"){
                area.innerHTML +=`<p>Extra effect: ${hit.extraEffect}</p>`;
            }
        }
    }
    if (weapon.type === "Melee"||weapon.type==="Ranged"){
        area.innerHTML = `<p>Range: ${weapon.range} Melee</p>`;
        for (let hits in weapon.hits) {
            let hit = weapon.hits[hits];
            let damage = [];
            let totalDMG = 0;
            if(Object.keys(weapon.hits).length>1){
                area.innerHTML += `<h3>Hit ${hits}</h3>`;
            }
            if(weapon.useStat === ""){
                let atk = Math.floor(Math.random() * 20) + 1;
                area.innerHTML += `Hit: ${atk+weapon.atkbonus} (${atk}+${weapon.atkbonus})`;
            }else{
                let atk = Math.floor(Math.random() * 20) + 1;
                let mod = Math.floor((selectedCharacter.mainstats[weapon.useStat]-10)/2)
                area.innerHTML += `Hit: ${atk+mod+weapon.atkbonus} (${atk}+${weapon.atkbonus}+${mod} ${weapon.useStat})`;
            }
            
            if(hit.SavingThrow!="None"&&hit.SavingThrow!="none"){
                area.innerHTML += `<p>Saving throw: DC ${hit.SavingThrow[0]} ${weapon.SavingThrow[1]}, ${hit.SaveMulti} damage on success</p>`;
            }
            for (let i = 0; i < hit.BaseDMG[0]; i++) {
                let roll = Math.floor(Math.random() * hit.BaseDMG[1]) + 1;
                damage.push(roll);
                totalDMG += roll;
            }

            totalDMG += hit.BaseDMG[2];

            area.innerHTML += `<p>Base Damage: ${totalDMG} ${hit.type} damage (${hit.BaseDMG[0]}d${hit.BaseDMG[1]} + ${hit.BaseDMG[2]})</p>`;
            area.innerHTML += `<p>Damage rolls: [${damage.join(", ")}]</p>`;
            if(hit.extraEffect!="None"){
                area.innerHTML +=`<p>Extra effect: ${hit.extraEffect}</p>`;
            }
        }
    }
}
