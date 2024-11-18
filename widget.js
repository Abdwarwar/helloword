class CustomTableWidget {
  constructor() {
    this._root = document.getElementById("table-container");
    this._myDataSource = {}; // Your data source should be set here
    this.render();
  }

  render() {
    const dimensions = ['dimensions_0', 'dimensions_1']; // Example dimensions
    const measures = ['measures_0', 'measures_1']; // Example measures

    // Map your data source to table data
    const tableData = this._myDataSource.data.map((row, index) => {
      const rowData = {};
      dimensions.forEach((dim) => {
        rowData[dim] = row[dim]?.label || "N/A";
      });
      measures.forEach((measureId) => {
        rowData[measureId] = row[measureId]?.raw || "N/A";
      });
      rowData['rowId'] = index; // Unique ID for each row (use index or a unique identifier)
      return rowData;
    });

    // Build table header
    const dimensionHeaders = dimensions.map(dim => dim); // Headers from dimensions
    const measureHeaders = measures.map(measure => measure); // Headers from measures
    const headerRow = ` 
      <tr>${dimensionHeaders.map(header => `<th>${header}</th>`).join("")}
      ${measureHeaders.map(header => `<th>${header}</th>`).join("")}</tr>`;

    // Create the table element
    const table = document.createElement("table");
    table.innerHTML = `
      <thead>${headerRow}</thead>
      <tbody>
        ${tableData.map(
          (row) => `
            <tr data-row-id="${row.rowId}" onclick="this.handleRowSelection(event)">
              ${dimensions.map((dim) => `<td>${row[dim]}</td>`).join("")}
              ${measures.map((measureId) => `<td contenteditable="true" data-measure="${measureId}" data-row-id="${row.rowId}">${row[measureId]}</td>`).join("")}
            </tr>`
        ).join("")}
      </tbody>
    `;

    this._root.innerHTML = "";
    this._root.appendChild(table);
  }

  handleRowSelection(event) {
    const row = event.currentTarget;
    const rowId = row.getAttribute("data-row-id");

    if (rowId !== null) {
      console.log("Selected Row ID:", rowId);
      const selectedRow = this._myDataSource.data[rowId]; // Access the row data using rowId
      if (selectedRow) {
        console.log("Selected Row Data:", selectedRow);
        // Log each dimension and measure of the selected row
        Object.entries(selectedRow).forEach(([key, value]) => {
          console.log(`${key}: ${value}`);
        });
      } else {
        console.log("Row data not found for ID:", rowId);
      }
    } else {
      console.log("No row ID found.");
    }
  }
}

// Instantiate the widget class
const widget = new CustomTableWidget();
