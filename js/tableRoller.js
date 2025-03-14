// Number of entries per page
const ENTRIES_PER_PAGE = 10;
const TEXT_CHAR_LIMIT = 50; // Max length of the displayed text

// Track the current page
let currentPage = 1;
let previousPage = null;  // Track previous page for navigation

// Function to update the displayed table entries based on the current page
function updateTableEntries() {
    const dropdown = document.getElementById("table-dropdown");
    const selectedTable = dropdown.value;
    if(selectedTable == "Select a table"){
        selectedTable = "";
    }
    if (!selectedTable) return;

    const table = window.tables[selectedTable];
    const tableContents = document.getElementById("table-contents");

    // Calculate the start and end indexes for the current page
    const startIndex = (currentPage - 1) * ENTRIES_PER_PAGE;
    const endIndex = startIndex + ENTRIES_PER_PAGE;

    // Get the entries for the current page
    const pageEntries = table.entries.slice(startIndex, endIndex);

    // Clear current table contents and display new entries
    if(currentPage!=1){
    tableContents.innerHTML = `<h3>  ${selectedTable.replace("_", " ")} Entries (Page ${currentPage})</h3><ul>`;
    } else {
        tableContents.innerHTML = `<h3>  ${selectedTable.replace("_", " ")} Entries</h3><ul>`;
    }
    // Update the table entries with the new "Edit" and "View Full" button
    pageEntries.forEach((entry, index) => {
        const truncatedEntry = entry.length > TEXT_CHAR_LIMIT ? entry.slice(0, TEXT_CHAR_LIMIT) + "..." : entry;
        tableContents.innerHTML += `
            <li>
                <span>${truncatedEntry}</span>
                <button class="view-full-button" onclick="viewFullText(${startIndex + index})">View Full</button>
                <button class="edit-button" onclick="editEntry(${startIndex + index})">Edit</button>
            </li>
        `;
    });

    tableContents.innerHTML += "</ul>";

    // Update page navigation buttons
    updatePageNavigation(table);
}
// Function to edit an entry
function editEntry(entryIndex) {
    const dropdown = document.getElementById("table-dropdown");
    const selectedTable = dropdown.value;
    if(selectedTable == "Select a table"){
        selectedTable = undefined;
    }
    const table = window.tables[selectedTable];

    // Get the current entry
    const entry = table.entries[entryIndex];
    
    // Replace the entry with an input field for editing
    const tableContents = document.getElementById("table-contents");
    tableContents.innerHTML = `
        <h3>Edit Entry</h3>
        <textarea id="edit-entry-text">${entry}</textarea>
        <button onclick="saveEditedEntry(${entryIndex})">Save</button>
        <button onclick="cancelEdit()">Cancel</button>
    `;
}

// Function to save the edited entry
function saveEditedEntry(entryIndex) {
    const dropdown = document.getElementById("table-dropdown");
    const selectedTable = dropdown.value;
    if(selectedTable == "Select a table"){
        selectedTable = undefined;
    }
    const table = window.tables[selectedTable];

    // Get the new entry text
    const editedText = document.getElementById("edit-entry-text").value;

    // Save the updated entry back to the table
    table.entries[entryIndex] = editedText;

    // Refresh the table contents to show the updated entry
    updateTableEntries();
}

// Function to cancel editing
function cancelEdit() {
    updateTableEntries();
}

// Function to update the page navigation controls
function updatePageNavigation(table) {
    const navigation = document.getElementById("page-navigation");
    const totalPages = Math.ceil(table.entries.length / ENTRIES_PER_PAGE);

    // Disable/enable the navigation buttons based on the current page
    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    // Update page label ("Page 1 of 10")
    const pageLabel = document.getElementById("page-label");
    pageLabel.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Function to go to the next page
function nextPage() {
    const dropdown = document.getElementById("table-dropdown");
    const selectedTable = dropdown.value;
    const table = window.tables[selectedTable];

    if (currentPage < Math.ceil(table.entries.length / ENTRIES_PER_PAGE)) {
        previousPage = currentPage;
        currentPage++;
        updateTableEntries();
    }
}

// Function to go to the previous page
function prevPage() {
    const dropdown = document.getElementById("table-dropdown");
    const selectedTable = dropdown.value;
    if(selectedTable == "Select a table"){
        selectedTable = undefined;
    }
    const table = window.tables[selectedTable];

    if (currentPage > 1) {
        previousPage = currentPage;
        currentPage--;
        updateTableEntries();
    }
}

// Function to view the full text of a specific entry
function viewFullText(entryIndex) {
    const dropdown = document.getElementById("table-dropdown");
    const selectedTable = dropdown.value;
    if(selectedTable == "Select a table"){
        selectedTable = undefined;
    }
    const table = window.tables[selectedTable];
    
    const fullText = table.entries[entryIndex];
    previousPage = currentPage;  // Save the current page before viewing full text
    currentPage = -1;  // Use -1 to indicate viewing the full text

    const tableContents = document.getElementById("table-contents");
    tableContents.innerHTML = `<h3>Full Text</h3><p>${fullText}</p>`;
    tableContents.innerHTML += '<button onclick="goBack()">Back to Previous Page</button>';
}

// Function to go back to the previous page
function goBack() {
    currentPage = previousPage;
    updateTableEntries();
}

// Function to load the selected table's contents
function loadTable() {
    const dropdown = document.getElementById("table-dropdown");
    const selectedTable = dropdown.value;

    if (selectedTable != "Select a table") {
        const table = window.tables[selectedTable];
        console.log(table); // Log the table object to inspect its structure
        
        if (table && Array.isArray(table.entries)) {
            currentPage = 1; // Reset to page 1 whenever a new table is selected
            updateTableEntries();
        } else {
            document.getElementById("table-contents").innerHTML = "<p>No valid entries found for this table.</p>";
        }
    } else {
        document.getElementById("table-contents").innerHTML = "";
    }
}

// Function to roll the table
function rollTable() {
    const dropdown = document.getElementById("table-dropdown");
    const selectedTable = dropdown.value;
    
    if (selectedTable) {
        const table = window.tables[selectedTable];
        const randomIndex = Math.floor(Math.random() * table.entries.length);
        const result = table.entries[randomIndex];
        
        const tableContents = document.getElementById("table-contents");
        tableContents.innerHTML = `<h3>You rolled on ${selectedTable.replace("_", " ")}:</h3><p>${result}</p>`;
    } else {
        document.getElementById("table-contents").innerHTML = "<p>Please select a table to roll on.</p>";
    }
}

// Event listener for rolling the selected table
document.getElementById("roll-table").addEventListener("click", rollTable);

// Event listeners for page navigation
document.getElementById("next-page").addEventListener("click", nextPage);
document.getElementById("prev-page").addEventListener("click", prevPage);

// Fetch the table data from the JSON file
fetch('json/tables.json')
    .then(response => response.json())
    .then(data => {
        window.tables = data;  // Save fetched data in a global variable
        populateTableDropdown();   // Populate dropdown after fetching
    })
    .catch(error => {
        console.error("Error loading tables.json:", error);
    });

// Populate the dropdown with table names
function populateTableDropdown() {
    let dropdown = document.getElementById("table-dropdown");
    dropdown.innerHTML = ""; // Clear previous options

    if (window.tables) {
        Object.keys(window.tables).forEach(table => {
            let option = document.createElement("option");
            option.value = table;
            option.textContent = table.replace("_", " "); // Format name
            dropdown.appendChild(option);
        });
    } else {
        dropdown.innerHTML = '<option value="">No tables available</option>';
    }
}

// Function to save the current table to local storage
function saveTable() {
    const dropdown = document.getElementById("table-dropdown");
    const selectedTable = dropdown.value;
    if (!selectedTable || selectedTable === "Select a table") {
        alert("Please select a table to save.");
        return;
    }

    localStorage.setItem(`table_${selectedTable}`, JSON.stringify(window.tables[selectedTable]));
    alert(`Table "${selectedTable}" saved successfully.`);
}

// Function to load the selected table from local storage
function loadTableFromStorage() {
    const dropdown = document.getElementById("table-dropdown");
    const selectedTable = dropdown.value;
    if (!selectedTable || selectedTable === "Select a table") {
        alert("Please select a table to load.");
        return;
    }

    const savedTable = localStorage.getItem(`table_${selectedTable}`);
    if (savedTable) {
        window.tables[selectedTable] = JSON.parse(savedTable);
        updateTableEntries();
        alert(`Table "${selectedTable}" loaded successfully.`);
    } else {
        alert("No saved data found for this table.");
    }
}

// Function to export the current table as a JSON file
function exportTable() {
    const dropdown = document.getElementById("table-dropdown");
    const selectedTable = dropdown.value;
    if (!selectedTable || selectedTable === "Select a table") {
        alert("Please select a table to export.");
        return;
    }

    let fileName = prompt("Enter filename:", `${selectedTable}_table.json`);
    if (!fileName) return;

    if (!fileName.endsWith(".json")) {
        fileName += ".json";
    }

    const dataStr = JSON.stringify({ [selectedTable]: window.tables[selectedTable] }, null, 4);
    const blob = new Blob([dataStr], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
}



// Initialize the page
window.onload = function() {
    if (window.tables) {
        populateTableDropdown();
    }
};
