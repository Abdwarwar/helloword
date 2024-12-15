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

    makeMeasureCellsEditable() {
      const rows = this._root.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        const rowIndex = row.getAttribute("data-row-index");
        const cells = row.querySelectorAll("td.editable");
        cells.forEach((cell) => {
          const measureId = cell.getAttribute("data-measure-id");
          cell.contentEditable = "true";

          cell.addEventListener("blur", async (event) => {
            const newValue = parseFloat(cell.textContent.trim());

            if (!isNaN(newValue)) {
              console.log(`Row ${rowIndex}, Measure ${measureId} updated to: ${newValue}`);

              const dimensions = this.getDimensions();
              const rowData = this._myDataSource.data[rowIndex];
              if (!rowData) {
                console.error("Row data not found for index:", rowIndex);
                return;
              }

              const userInput = {
                "@MeasureDimension": measureId,
                ...dimensions.reduce((acc, dim) => {
                  acc[dim.id] = rowData[dim.key]?.id || "N/A";
                  return acc;
                }, {}),
              };

              try {
                const planning = await this._myDataSource.getPlanning();
                if (!planning) {
                  console.error("Planning API is not available for this data source.");
                  return;
                }

                await planning.setUserInput(userInput, newValue);
                await planning.submitData();
                console.log("Data successfully written back to the model.");

                this._myDataSource.refreshData();
              } catch (error) {
                console.error("Error submitting data to the model:", error);
              }
            } else {
              console.error("Invalid input, resetting value.");
              cell.textContent = rowData[measureId]?.raw || "N/A";
            }
          });
        });
      });
    }

async fetchDimensionMembers(dimensionKey) {
  if (!this._myDataSource || !this._myDataSource.metadata) {
    console.error("Data source or metadata is unavailable.");
    return [];
  }

  console.log("Attempting to fetch members for dimension:", dimensionKey);

  try {
    // Try using the API if available
    const planning = await this._myDataSource.getPlanning();
    if (planning?.getDimensionMembers) {
      const dimensionMembers = await planning.getDimensionMembers(dimensionKey);
      console.log(`Fetched dimension members via API for '${dimensionKey}':`, dimensionMembers);
      return dimensionMembers.map(member => ({ id: member.id, label: member.label }));
    }
  } catch (apiError) {
    console.warn(`getDimensionMembers API unavailable for '${dimensionKey}'. Attempting fallback.`, apiError);
  }

  // Fallback to metadata members
  const metadataDimension = this._myDataSource.metadata.dimensions[dimensionKey];
  if (metadataDimension?.values) {
    console.log(`Fetched dimension members from metadata for '${dimensionKey}':`, metadataDimension.values);
    return metadataDimension.values.map(value => ({ id: value.id || value, label: value.label || value }));
  }

  // Fallback to data source rows
  const fallbackMembers = new Set();
  this._myDataSource.data.forEach(row => {
    const value = row[dimensionKey]?.id || row[dimensionKey]?.label || null;
    if (value) fallbackMembers.add(value);
  });

  const membersArray = Array.from(fallbackMembers).map(id => ({ id, label: id }));
  console.log(`Manually fetched members for '${dimensionKey}':`, membersArray);

  return membersArray;
}


async addEmptyRow() {
  const table = this._root.querySelector("table tbody");
  if (!table) return;

  const dimensions = this.getDimensions();
  const measures = this.getMeasures();
  const newRowIndex = table.rows.length;

  const newRow = document.createElement("tr");
  newRow.setAttribute("data-row-index", newRowIndex);
  newRow.classList.add("selected");

  for (const dim of dimensions) {
    const cell = document.createElement("td");
    const dropdown = document.createElement("select");

    const members = await this.fetchDimensionMembers(dim.key);
    members.forEach(member => {
      const option = document.createElement("option");
      option.value = member.id;
      option.textContent = member.label;
      dropdown.appendChild(option);
    });

    dropdown.addEventListener("change", event => {
      cell.setAttribute("data-dimension-value", event.target.value);
    });

    cell.appendChild(dropdown);
    newRow.appendChild(cell);
  }

  measures.forEach(measure => {
    const cell = document.createElement("td");
    cell.classList.add("editable");
    cell.contentEditable = "true";
    newRow.appendChild(cell);
  });

  table.appendChild(newRow);
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
  if (!this._myDataSource || !this._myDataSource.metadata) {
    console.error("Data source metadata is unavailable.");
    return [];
  }

  const dimensionsKeys = this._myDataSource.metadata.feeds.dimensions.values;

  const dimensions = dimensionsKeys.map((key) => {
    const dimension = this._myDataSource.metadata.dimensions[key];
    if (!dimension) {
      console.warn(`Dimension with key '${key}' not found in metadata.`);
      return { id: key, key, description: key }; // Fallback
    }

    return {
      id: dimension.id || key, // Use actual dimension ID
      key,
      description: dimension.description || dimension.id || key, // Use actual description
    };
  });

  console.log("Resolved Dimensions:", dimensions);
  return dimensions;
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

    const selectedRows = Array.from(this._selectedRows);
    const dimensionValues = selectedRows.map((rowIndex) => {
      const row = table.querySelector(`tr[data-row-index="${rowIndex}"]`);
      if (!row) {
        console.warn(`Row at index '${rowIndex}' not found in DOM.`);
        return null;
      }

      const cell = row.querySelector(`td[data-dimension-id="${dimensionId}"]`);
      if (cell) {
        // For dynamically added rows, retrieve data from attributes
        const value = cell.getAttribute("data-dimension-value") || null;
        console.log(`Dimension '${dimensionId}' for row '${rowIndex}' (new row) has value: ${value}`);
        return value;
      } else if (this._myDataSource) {
        // For rows from the data source
        const rowData = this._myDataSource.data[rowIndex];
        const value = rowData?.[dimensionId]?.id || rowData?.[dimensionId]?.label || null;
        console.log(`Dimension '${dimensionId}' for row '${rowIndex}' (data source) has value: ${value}`);
        return value;
      }

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

    const selectedRows = Array.from(this._selectedRows);
    const measureValues = selectedRows.map((rowIndex) => {
      const row = table.querySelector(`tr[data-row-index="${rowIndex}"]`);
      if (!row) {
        console.warn(`Row at index '${rowIndex}' not found in DOM.`);
        return null;
      }

      const cell = row.querySelector(`td[data-measure-id="${measureId}"]`);
      if (cell) {
        // Retrieve value from dynamically added rows
        const value = parseFloat(cell.getAttribute("data-measure-value")) || null;
        console.log(`Measure '${measureId}' for row '${rowIndex}' (new row) has value: ${value}`);
        return value;
      } else if (this._myDataSource) {
        // Retrieve value from rows in the data source
        const rowData = this._myDataSource.data[rowIndex];
        const value = rowData?.[measureId]?.raw || rowData?.[measureId]?.formatted || null;
        console.log(`Measure '${measureId}' for row '${rowIndex}' (data source) has value: ${value}`);
        return value;
      }

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
