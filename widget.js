var table = document.getElementById('yourTableId'); // Replace with your table ID or element selector

// Event listener for table cell edits
table.addEventListener('input', function (event) {
    // Check if the edit is in a valid cell (e.g., numeric data cell)
    var cell = event.target;
    if (cell.tagName === 'TD' && cell.contentEditable === 'true') {
        // Get the edited value and row data (modify as per your table structure)
        var newValue = parseFloat(cell.innerText); // Assuming numeric value
        var rowIndex = cell.parentElement.rowIndex;
        var columnIndex = cell.cellIndex;

        // Get the corresponding planning model and context
        var planningModel = getPlanningModel(); // Function to get the planning model
        var context = getContextForCell(rowIndex, columnIndex); // Function to get context for the edited cell

        // Call the writeBack API
        planningModel.writeBack(newValue, context)
            .then(function (response) {
                console.log('Write-back successful:', response);
            })
            .catch(function (error) {
                console.error('Error during write-back:', error);
            });
    }
});

// Function to get the planning model (adjust as per your system)
function getPlanningModel() {
    // This function should return the correct model that you're working with for planning
    return sap.ui.getCore().getModel('yourPlanningModel'); // Example: Replace 'yourPlanningModel' with your actual model name
}

// Function to get context for a specific table cell (e.g., row and column index)
function getContextForCell(row, col) {
    // This function should return the context (e.g., row ID, column ID) for the edited cell
    return {
        rowId: row,
        columnId: col
    };
}
