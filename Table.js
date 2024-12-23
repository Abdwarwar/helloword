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
    <div id="root" style="width: 100%; height: 100%; overflow: auto;"></div>
  `;

  class CustomTableWidget extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(prepared.content.cloneNode(true));
      this._root = this._shadowRoot.getElementById("root");
      this._selectedRows = new Set(); // Track selected rows
      this._myDataSource = null;
      this._newRowsData = []; // Track newly added rows

      const addRowButton = this._shadowRoot.getElementById("addRowButton");
      addRowButton.addEventListener("click", () => this.addEmptyRow());
    }

    connectedCallback() {
      this.render();
    }

    set myDataSource(dataBinding) {
      this._myDataSource = dataBinding;
      this.render();
    }

    render() {
      if (!this._myDataSource || this._myDataSource.state !== "success") {
        this._root.innerHTML = `<p>Loading data...</p>`;
        return;
      }

      const dimensions = this.getDimensions();
      const measures = this.getMeasures();

      if (dimensions.length === 0 || measures.length === 0) {
        this._root.innerHTML = `<p>Please add Dimensions and Measures in the Builder Panel.</p>`;
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

      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.flexDirection = "column";

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
                `<tr data-row-index="${row.index}">
                  ${dimensions.map((dim) => `<td>${row[dim.id]}</td>`).join("")}
                  ${measures
                    .map(
                      (measure) =>
                        `<td class="editable" data-measure-id="${measure.id}">${row[measure.id]}</td>`
                    )
                    .join("")}
                </tr>`
            )
            .join("")}
        </tbody>
      `;
      container.appendChild(table);

      this._root.innerHTML = "";
      this._root.appendChild(container);

      this.attachRowSelectionListeners();
      this.makeMeasureCellsEditable();
    }

    attachRowSelectionListeners() {
      const rows = this._root.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        row.addEventListener("click", (event) => {
          const rowIndex = event.currentTarget.getAttribute("data-row-index");
          if (this._selectedRows.has(rowIndex)) {
            this._selectedRows.delete(rowIndex);
            event.currentTarget.classList.remove("selected");
          } else {
            this._selectedRows.add(rowIndex);
            event.currentTarget.classList.add("selected");
          }
          console.log(`Selected rows:`, Array.from(this._selectedRows));

          this.fireOnSelectEvent();
        });
      });
    }

    fireOnSelectEvent() {
      const event = new CustomEvent("onSelect", {
        detail: {
          selectedRows: Array.from(this._selectedRows),
        },
      });
      this.dispatchEvent(event);
    }

fireOnResultChange(detail) {
  const event = new CustomEvent("onResultChange", {
    detail, // Include the rowIndex, measureId, and newValue in the event
  });
  this.dispatchEvent(event);
  console.log("onResultChange triggered:", detail);
}



makeMeasureCellsEditable() {
  const rows = this._root.querySelectorAll("tbody tr");
  rows.forEach((row) => {
    const rowIndex = row.getAttribute("data-row-index");
    const cells = row.querySelectorAll("td.editable");

    cells.forEach((cell) => {
      const measureId = cell.getAttribute("data-measure-id");
      cell.contentEditable = "false"; // Disable editing by default

      // Enable editing on double-click
      cell.addEventListener("dblclick", () => {
        cell.contentEditable = "true";
        cell.focus();
      });

      // Save and disable editing on blur
      cell.addEventListener("blur", async (event) => {
        const newValue = parseFloat(cell.textContent.trim());
        cell.contentEditable = "false";

        if (!isNaN(newValue)) {
          console.log(`Row ${rowIndex}, Measure ${measureId} updated to: ${newValue}`);
          cell.setAttribute("data-measure-value", newValue); // Store the updated value

          // Update the data source if available
          const measureKey = this.getMeasures().find((measure) => measure.id === measureId)?.key;
          if (this._myDataSource?.data?.[rowIndex] && measureKey) {
            this._myDataSource.data[rowIndex][measureKey] = { raw: newValue };
          }

          // Trigger onResultChange
          this.fireOnResultChange({
            rowIndex,
            measureId,
            newValue,
          });
        } else {
          console.error("Invalid input, resetting value.");
          const measureKey = this.getMeasures().find((measure) => measure.id === measureId)?.key;
          cell.textContent =
            this._myDataSource?.data?.[rowIndex]?.[measureKey]?.raw || "N/A";
        }
      });
    });
  });
}




async fetchDimensionMembers(dimensionId, returnType = "id") {
  if (!this._myDataSource || !this._myDataSource.data) {
    console.error("Data source not available or data is missing.");
    return [];
  }

  try {
    const membersSet = new Set();
    this._myDataSource.data.forEach((row) => {
      const value = row[dimensionId]?.[returnType] || null;
      if (value) {
        membersSet.add(value);
      }
    });

    const members = Array.from(membersSet).map((member) => ({
      id: member,
      label: member, // For dropdowns, we can show `id` or `label`
    }));

    console.log(`Fetched members for dimension '${dimensionId}' (${returnType}):`, members);
    return members;
  } catch (error) {
    console.error("Error fetching dimension members:", error);
    return [];
  }
}

async addEmptyRow() {
  const table = this._root.querySelector("table tbody");
  if (!table) {
    console.error("Table body not found.");
    return;
  }

  const dimensions = this.getDimensions();
  const measures = this.getMeasures();
  const newRowIndex = table.rows.length;

  const newRow = document.createElement("tr");
  newRow.setAttribute("data-row-index", newRowIndex);
  newRow.classList.add("selected");

  // Populate dropdowns for dimensions
  for (const dim of dimensions) {
    const cell = document.createElement("td");
    cell.setAttribute("data-dimension-id", dim.id);

    const dropdown = document.createElement("select");

    // Fetch dimension members dynamically with `id` as default type
    const members = await this.fetchDimensionMembers(dim.key, "id");
    members.forEach((member) => {
      const option = document.createElement("option");
      option.value = member.id;
      option.textContent = member.label; // Show label (or description) in dropdown
      dropdown.appendChild(option);
    });

    dropdown.addEventListener("change", (event) => {
      console.log(`Dimension '${dim.id}' selected as ID: ${event.target.value}`);
      cell.setAttribute("data-dimension-value", event.target.value); // Store selected ID
    });

    cell.appendChild(dropdown);
    newRow.appendChild(cell);
  }

  // Add editable cells for measures
  measures.forEach((measure) => {
    const cell = document.createElement("td");
    cell.classList.add("editable");
    cell.setAttribute("data-measure-id", measure.id);

    cell.contentEditable = "true";
    cell.addEventListener("blur", (event) => {
      const value = parseFloat(event.target.textContent.trim());
      console.log(`Measure '${measure.id}' for new row updated to: ${value}`);
      cell.setAttribute("data-measure-value", isNaN(value) ? null : value); // Store edited value
    });

    newRow.appendChild(cell);
  });

  // Attach row click event for selection highlighting
  newRow.addEventListener("click", () => {
    table.querySelectorAll("tr").forEach((row) => row.classList.remove("selected"));
    newRow.classList.add("selected");
    this._selectedRows.add(newRowIndex);
    console.log(`New row selected: ${newRowIndex}`);
  });

  table.appendChild(newRow);
  console.log(`New row added: ${newRowIndex}`);
}

    updateMeasureValue(rowIndex, measureId, newValue) {
      if (!this._myDataSource || !this._myDataSource.data[rowIndex]) {
        console.error("Row data is not available for updating.");
        return;
      }

      // Update the measure value in the data source
      this._myDataSource.data[rowIndex][measureId] = { raw: newValue };
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
