(function () {
  const prepared = document.createElement("template");
  prepared.innerHTML = `
    <style>
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f4f4f4; }
      tr:nth-child(even) { background-color: #f9f9f9; }
      tr.selected { background-color: #ffeb3b; }
      td.editable { background-color: #fff3e0; }
      button { margin-bottom: 10px; padding: 5px 10px; cursor: pointer; }
    </style>
    <div id="controls">
      <button id="addRowButton">Add New Row</button>
    </div>
    <div id="root" style="width: 100%; height: 100%; overflow: auto;">
      <div id="actualDataTable"></div>
      <h3>New Rows</h3>
      <div id="newRowsTable"></div>
    </div>
  `;

  class CustomTableWidget extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(prepared.content.cloneNode(true));
      this._actualDataTable = this._shadowRoot.getElementById("actualDataTable");
      this._newRowsTable = this._shadowRoot.getElementById("newRowsTable");
      this._addRowButton = this._shadowRoot.getElementById("addRowButton");
      this._selectedRows = new Set(); // Track selected rows
      this._myDataSource = null;

      // Event to add a new row
      this._addRowButton.addEventListener("click", () => this.addEmptyRow());
    }

    connectedCallback() {
      this.renderActualData();
    }

    set myDataSource(dataBinding) {
      this._myDataSource = dataBinding;
      this.renderActualData();
    }

    // Render Actual Data Table
    renderActualData() {
      if (!this._myDataSource || this._myDataSource.state !== "success") {
        this._actualDataTable.innerHTML = `<p>Loading data...</p>`;
        return;
      }

      const dimensions = this.getDimensions();
      const measures = this.getMeasures();

      if (dimensions.length === 0 || measures.length === 0) {
        this._actualDataTable.innerHTML = `<p>Please add Dimensions and Measures in the Builder Panel.</p>`;
        return;
      }

      console.log("Resolved Dimensions:", dimensions);
      console.log("Resolved Measures:", measures);

      const tableData = this._myDataSource.data.map((row, index) => ({
        index,
        ...dimensions.reduce((acc, dim) => {
          acc[dim.id] = row[dim.key]?.label || row[dim.key]?.id || "N/A";
          return acc;
        }, {}),
        ...measures.reduce((acc, measure) => {
          acc[measure.id] = row[measure.key]?.raw || row[measure.key]?.formatted || "N/A";
          return acc;
        }, {}),
      }));

      const table = document.createElement("table");
      table.innerHTML = `
        <thead>
          <tr>
            ${dimensions.map((dim) => `<th>${dim.description || dim.id}</th>`).join("")}
            ${measures.map((measure) => `<th>${measure.description || measure.id}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${tableData
            .map(
              (row) =>
                `<tr>
                  ${dimensions.map((dim) => `<td>${row[dim.id]}</td>`).join("")}
                  ${measures.map((measure) => `<td>${row[measure.id]}</td>`).join("")}
                </tr>`
            )
            .join("")}
        </tbody>
      `;
      this._actualDataTable.innerHTML = "";
      this._actualDataTable.appendChild(table);
    }

    // Add New Row Table
    async addEmptyRow() {
      const dimensions = this.getDimensions();
      const measures = this.getMeasures();

      const table = this._newRowsTable.querySelector("table tbody") || this.createNewRowsTable(dimensions, measures);

      const newRow = document.createElement("tr");

      // Add dropdowns for dimensions
      dimensions.forEach((dim) => {
        const cell = document.createElement("td");
        const dropdown = document.createElement("select");

        // Populate dropdown
        this.fetchDimensionMembers(dim.key).then((members) => {
          members.forEach((member) => {
            const option = document.createElement("option");
            option.value = member.id;
            option.textContent = member.label;
            dropdown.appendChild(option);
          });
        });

        dropdown.addEventListener("change", () => {
          console.log(`Dimension '${dim.id}' updated to ${dropdown.value}`);
        });

        cell.appendChild(dropdown);
        newRow.appendChild(cell);
      });

      // Add editable measure cells
      measures.forEach((measure) => {
        const cell = document.createElement("td");
        cell.contentEditable = "true";
        cell.addEventListener("blur", () => {
          console.log(`Measure '${measure.id}' updated to ${cell.textContent}`);
        });
        newRow.appendChild(cell);
      });

      table.appendChild(newRow);
    }

    createNewRowsTable(dimensions, measures) {
      const table = document.createElement("table");
      table.innerHTML = `
        <thead>
          <tr>
            ${dimensions.map((dim) => `<th>${dim.description || dim.id}</th>`).join("")}
            ${measures.map((measure) => `<th>${measure.description || measure.id}</th>`).join("")}
          </tr>
        </thead>
        <tbody></tbody>
      `;
      this._newRowsTable.innerHTML = "";
      this._newRowsTable.appendChild(table);
      return table.querySelector("tbody");
    }

    async fetchDimensionMembers(dimensionKey) {
      if (!this._myDataSource || !this._myDataSource.data) return [];
      const uniqueValues = [...new Set(this._myDataSource.data.map((row) => row[dimensionKey]?.id))];
      return uniqueValues.map((id) => ({ id, label: id }));
    }

    // Expose getSelections API
    getSelections() {
      try {
        if (!this._myDataSource || !this._myDataSource.data) {
          console.error("Data source is not bound or data is unavailable.");
          return [];
        }

        // Retrieve dimensions metadata
        const dimensions = this.getDimensions();
        const measures = this.getMeasures();

        // Retrieve selected rows' data
        const selectedData = Array.from(this._selectedRows).map((rowIndex) => {
          const row = this._myDataSource.data[rowIndex];
          if (!row) return null;

          const rowData = {};

          // Add dimension data
          dimensions.forEach((dim) => {
            rowData[dim.id] = {
              id: row[dim.key]?.id || null,
              label: row[dim.key]?.label || "N/A",
            };
          });

          // Add measure data with resolved names
          measures.forEach((measure) => {
            rowData[measure.id] = row[measure.id]?.raw || row[measure.id]?.value || null;
          });

          return rowData;
        });

        console.log("Selected data:", selectedData);
        return selectedData;
      } catch (error) {
        console.error("Error in getSelections:", error);
        return [];
      }
    }

getDimensions() {
  try {
    if (!this._myDataSource || !this._myDataSource.metadata) {
      console.error("Data source or metadata is unavailable.");
      return [];
    }

    // Resolve dimension keys from metadata
    const dimensionKeys = this._myDataSource.metadata.feeds.dimensions.values;

    const dimensions = dimensionKeys.map((key) => {
      const dimension = this._myDataSource.metadata.dimensions[key];
      if (!dimension) {
        console.warn(`Dimension key '${key}' not found in metadata.`);
        return { id: key, description: "Undefined Dimension", key }; // Placeholder
      }

      return {
        id: dimension.id || key, // Fallback to key if ID is missing
        description: dimension.description || dimension.id || key, // Fallback to ID or key
        key, // Original metadata key for matching rows
      };
    });

    console.log("Resolved Dimensions:", dimensions);
    return dimensions;
  } catch (error) {
    console.error("Error in getDimensions:", error);
    return [];
  }
}




getMeasures() {
  if (!this._myDataSource || !this._myDataSource.metadata) {
    console.error("Data source metadata is unavailable.");
    return [];
  }

  const measuresKeys = this._myDataSource.metadata.feeds.measures.values;

  const measures = measuresKeys.map((key) => {
    const measure = this._myDataSource.metadata.mainStructureMembers[key];
    if (!measure) {
      console.warn(`Measure with key '${key}' not found in metadata.`);
      return { id: key, key, description: key }; // Fallback
    }

    return {
      id: measure.id || key, // Use actual measure ID
      key,
      description: measure.description || measure.id || key, // Use actual description
    };
  });

  console.log("Resolved Measures:", measures);
  return measures;
}


    getSelectedRow() {
      try {
        // Return selected row indices as strings
        const selectedRowIndices = Array.from(this._selectedRows);
        console.log("Selected rows:", selectedRowIndices);
        return selectedRowIndices;
      } catch (error) {
        console.error("Error in getSelectedRow:", error);
        return [];
      }
    }

getDimensionSelected(dimensionId) {
  try {
    const table = this._root.querySelector("table tbody");
    if (!table) {
      console.error("Table body not found.");
      return [];
    }

    const dimensions = this.getDimensions();
    console.log("Selected Rows:", Array.from(this._selectedRows));
    console.log("Data Source Structure:", this._myDataSource?.data);

    const dimensionKey = dimensions.find((dim) => dim.id === dimensionId)?.key; // Match dimensionId to key
    if (!dimensionKey) {
      console.warn(`Dimension ID '${dimensionId}' not found in resolved dimensions.`);
      return [];
    }

    const dimensionValues = Array.from(this._selectedRows).map((rowIndex) => {
      const row = table.querySelector(`tr[data-row-index="${rowIndex}"]`);
      if (!row) {
        console.warn(`Row at index '${rowIndex}' not found in DOM.`);
        return null;
      }

      // For new rows
      const dynamicCell = row.querySelector(`td[data-dimension-id="${dimensionId}"]`);
      if (dynamicCell) {
        const value = dynamicCell.getAttribute("data-dimension-value") || null;
        console.log(`Dimension '${dimensionId}' for new row '${rowIndex}' has value: ${value}`);
        return value;
      }

      // For existing rows in the data source
      if (this._myDataSource?.data?.[rowIndex]) {
        const dataRow = this._myDataSource.data[rowIndex];
        console.log(`Data Row for '${rowIndex}':`, dataRow);

        const value = dataRow[dimensionKey]?.id || dataRow[dimensionKey]?.label || null;
        console.log(`Dimension '${dimensionId}' for data source row '${rowIndex}' has value: ${value}`);
        return value;
      }

      console.warn(`Dimension '${dimensionId}' not found for row '${rowIndex}'.`);
      return null;
    });

    const filteredValues = dimensionValues.filter((value) => value !== null);
    console.log(`Filtered dimension values for '${dimensionId}':`, filteredValues);
    return filteredValues;
  } catch (error) {
    console.error("Error in getDimensionSelected:", error);
    return [];
  }
}


    
getMeasureValues(measureId) {
  try {
    const table = this._root.querySelector("table tbody");
    if (!table) {
      console.error("Table body not found.");
      return [];
    }

    const measures = this.getMeasures();
    const selectedRows = Array.from(this._selectedRows);
    console.log("Selected Rows:", selectedRows);
    console.log("Data Source Structure:", this._myDataSource?.data);

    const measureKey = measures.find((measure) => measure.id === measureId)?.key; // Match measureId to key
    if (!measureKey) {
      console.warn(`Measure ID '${measureId}' not found in resolved measures.`);
      return [];
    }

    const measureValues = selectedRows.map((rowIndex) => {
      const row = table.querySelector(`tr[data-row-index="${rowIndex}"]`);
      if (!row) {
        console.warn(`Row at index '${rowIndex}' not found in DOM.`);
        return null;
      }

      // Always retrieve value from the DOM
      const cell = row.querySelector(`td[data-measure-id="${measureId}"]`);
      if (cell) {
        const domValue = parseFloat(cell.textContent.trim()) || null;
        if (!isNaN(domValue)) {
          console.log(`Measure '${measureId}' for row '${rowIndex}' (DOM) has value: ${domValue}`);
          return domValue;
        }
      }

      // Retrieve value from the data source as fallback
      if (this._myDataSource?.data?.[rowIndex]) {
        const dataRow = this._myDataSource.data[rowIndex];
        console.log(`Data Row for '${rowIndex}':`, dataRow);

        const value = dataRow[measureKey]?.raw ?? dataRow[measureKey]?.formatted ?? null;
        if (value !== null) {
          const parsedValue = parseFloat(value) || value; // Parse numeric string to float
          console.log(`Measure '${measureId}' for data source row '${rowIndex}' has value: ${parsedValue}`);
          return parsedValue;
        }
      }

      console.warn(`Measure '${measureId}' not found for row '${rowIndex}'.`);
      return null;
    });

    const filteredValues = measureValues.filter((value) => value !== null);
    console.log(`Filtered measure values for '${measureId}':`, filteredValues);
    return filteredValues;
  } catch (error) {
    console.error("Error in getMeasureValues:", error);
    return [];
  }
}

    }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
