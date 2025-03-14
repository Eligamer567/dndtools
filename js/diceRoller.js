let diceMap = {}; // Stores current dice selection
let presets = {}; // Stores saved presets
let selectedPreset = ""; // Tracks which preset is active

function addDice() {
    let diceType = parseInt(document.getElementById("dice").value);

    if (diceMap[diceType]) {
        diceMap[diceType]++;
    } else {
        diceMap[diceType] = 1;
    }

    selectedPreset = ""; // Reset preset selection
    updateDiceList();
}

function removeDice(diceType, amount) {
    if (amount === undefined) {
        if (diceMap[diceType] > 1) {
            diceMap[diceType]--;
        } else {
            delete diceMap[diceType];
        }
    } else {
        delete diceMap[diceType];
    }

    selectedPreset = ""; // Reset preset selection
    updateDiceList();
}

function updateDiceList() {
    let listElement = document.getElementById("selected-dice");
    listElement.innerHTML = "";

    Object.keys(diceMap).forEach(dice => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `D${dice} (x${diceMap[dice]}) 
            <button onclick="removeDice(${dice})">Remove</button> 
            <button onclick="removeDice(${dice}, 'all')">Remove All</button>`;
        listElement.appendChild(listItem);
    });

    updatePresetLabel();
}

function rollDice() {
    let rolls = [];
    let total = 0;

    Object.keys(diceMap).forEach(dice => {
        let count = diceMap[dice];
        let diceRolls = [];

        for (let i = 0; i < count; i++) {
            let roll = Math.floor(Math.random() * dice) + 1;
            diceRolls.push(roll);
            total += roll;
        }

        rolls.push(`D${dice} (x${count}): [${diceRolls.join(", ")}]`);
    });

    document.getElementById("result").innerHTML = `
        Rolls: ${rolls.join("<br>")}
        <br>Total: <strong>${total}</strong>
    `;
}

// Save the current dice setup as a preset
function savePreset() {
    let presetName = prompt("Enter a name for the preset:");
    if (!presetName) return;

    presets[presetName] = { ...diceMap };
    updatePresetDropdown();
}

// Load a preset into the dice roller
function loadPreset(name) {
    if (name === "") {
        diceMap = {};
        selectedPreset = "";
    } else if (presets[name]) {
        diceMap = { ...presets[name] };
        selectedPreset = name;
    }

    updateDiceList();
}

// Export presets as a JSON file
function exportPresets() {
    let dataStr = JSON.stringify(presets, null, 2);
    let blob = new Blob([dataStr], { type: "application/json" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "dice_presets.json";
    a.click();
}

// Import presets from a JSON file
function importPresets(event) {
    let file = event.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function(e) {
        presets = JSON.parse(e.target.result);
        updatePresetDropdown();
    };
    reader.readAsText(file);
}

// Update preset dropdown
function updatePresetDropdown() {
    let presetDropdown = document.getElementById("preset-dropdown");
    presetDropdown.innerHTML = "<option value=''>None</option>";

    Object.keys(presets).forEach(name => {
        let option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        presetDropdown.appendChild(option);
    });

    updatePresetLabel();
}

// Update the preset label to show the selected preset
function updatePresetLabel() {
    let label = document.getElementById("selected-preset-label");
    label.textContent = selectedPreset ? `Selected: ${selectedPreset}` : "Selected: None";
}
