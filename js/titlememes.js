const titles = {
    0: "          D&D tools",
    1: "news ticker?",
    2: "¿por qué no?",
    3: "sorry, wrong language",
    4: "don't close this tab",
    5: "jojo reference",
    6: "random kobold",
    7: "cat.",
    8: ".......................................",
    9: "i should add more to this",
    10: "but im lazy",
    11: "fun fact:",
    12: "theirs 10 dragon types",
    13: "i.... think",
    14: "maybe more",
    15: "way more with homebrew",
    16: "are you even reading this",
    17: ".... .. .-.. .-.. --- / .-- --- .-. .-.. -...",
    18: "get me outta here",
    19: "never gonna give you up.",
    20: "stop reading me",
    21: ".",
    22: ".",
    23: ".",
    24: ".",
    25: ".",
    26: ".",
    27: ".",
    28: "fine you win",
    29: "my   ky is brokn, plas hlp",
    30: "I CAST FIREBALL",
    31: "wait thats a rouge",
    32: "ah ****",
    33: "i cant count",
    34: "and rally nd a nw kyboard",
    35: "the cat rturnd",
    36: "yay",
    37: "ah he left",
};

// Combine all titles into one large string with blank characters between each title.
const combinedTitles = Object.values(titles).join("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀"); // Adds a blank character (⠀) between each title.

let index = 0;
let titleWindow = ""; // Holds the current 15-character window of the title.

function scrollTitle() {
    // Skip spaces at the current index
    while (
        combinedTitles[index] === " " || 
        combinedTitles[index] === "." || 
        combinedTitles[index] === "i" ||
        combinedTitles[index] === "l" ||
        combinedTitles[index] === "j" ||
        combinedTitles[index] === "'") {
        index++; // Move past the space
    }

    // Get a 15-character substring starting at the current index
    titleWindow = combinedTitles.slice(index, index + 30);

    // Update the document title
    document.title = titleWindow;

    // If we've gone past the end of the combinedTitles string, reset to the beginning
    if (index + 30 > combinedTitles.length) {
        index = 0; // Restart at the beginning
    } else {
        index++; // Move to the next character to scroll
    }
}

// Start the scrolling animation with a 200ms delay per window update.
setInterval(scrollTitle, 200);