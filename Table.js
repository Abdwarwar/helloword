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
    </style>
    <div id="root" style="width: 100%; height: 100%; overflow: auto;"></div>
    <button id="addRowButton" style="margin-bottom: 10px;">Add New Row</button>
  `;

  class CustomTableWidget extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(prepared.content.cloneNode(true));
      this._root = this._shadowRoot.getElementById("root");
      this._selectedRows = new Set(); // Track selected rows
      this._myDataSource = null;
      this._addRowButton = this._shadowRoot.getElementById("addRowButton");
      this._addRowButton.addEventListener("click", () => this.addEmptyRow());
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

  // Create a container for the button and table
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexDirection = "column";

  // Add the button
  const button = document.createElement("button");
  button.id = "addRowButton";
  button.textContent = "Add New Row";
  button.style.marginBottom = "10px";
  button.addEventListener("click", () => this.addEmptyRow());
  container.appendChild(button);

  // Create the table
  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        ${dimensions.map((dim) => `<th>${dim.description || dim.id}</th>`).join("")}
        ${measures.map((measure) => `<th>${measure.description || measure.id}</th>`).join("")}
      </tr>
    </thead>
    <tbody>
      ${this._myDataSource.data
        .map(
          (row, index) =>
            `<tr data-row-index="${index}">
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

  this._root.innerHTML = ""; // Clear the root element
  this._root.appendChild(container);

  // Attach event listeners
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

          // Fire the onSelect event
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

          // Handle cell value changes on blur
          cell.addEventListener("blur", async (event) => {
            const newValue = parseFloat(cell.textContent.trim());

            if (!isNaN(newValue)) {
              console.log(`Row ${rowIndex}, Measure ${measureId} updated to: ${newValue}`);

              // Retrieve the dimensions for this row
              const dimensions = this.getDimensions();
              const rowData = this._myDataSource.data[rowIndex];
              if (!rowData) {
                console.error("Row data not found for index:", rowIndex);
                return;
              }

              // Build the SAC planning input object
              const userInput = {
                "@MeasureDimension": measureId,
                ...dimensions.reduce((acc, dim) => {
                  acc[dim.id] = rowData[dim.key]?.id || "N/A";
                  return acc;
                }, {}),
              };

              try {
                // Retrieve the planning object
                const planning = await this._myDataSource.getPlanning();
                if (!planning) {
                  console.error("Planning API is not available for this data source.");
                  return;
                }

                // Write back to the model
                await planning.setUserInput(userInput, newValue);
                await planning.submitData();
                console.log("Data successfully written back to the model.");

                // Optionally refresh the data source to reflect changes
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

    addEmptyRow() {
      const table = this._root.querySelector("table tbody");
      if (!table) {
        console.error("Table body not found.");
        return;
      }

      const dimensions = this.getDimensions();
      const measures = this.getMeasures();
      const newRowIndex = table.rows.length; // Calculate the new row index

      // Create a new row
      const newRow = document.createElement("tr");
      newRow.setAttribute("data-row-index", newRowIndex);

      // Add empty cells for dimensions
      dimensions.forEach((dim) => {
        const cell = document.createElement("td");
        cell.classList.add("editable");
        cell.setAttribute("data-dimension-id", dim.id);
        cell.contentEditable = "true";
        cell.addEventListener("blur", (event) => {
          const value = event.target.textContent.trim();
          console.log(`Updated Dimension ${dim.id}: ${value}`);
          // Store the value as needed
        });
        newRow.appendChild(cell);
      });

      // Add empty cells for measures
      measures.forEach((measure) => {
        const cell = document.createElement("td");
        cell.classList.add("editable");
        cell.setAttribute("data-measure-id", measure.id);
        cell.contentEditable = "true";
        cell.addEventListener("blur", (event) => {
          const value = parseFloat(event.target.textContent.trim());
          if (!isNaN(value)) {
            console.log(`Updated Measure ${measure.id}: ${value}`);
            // Store the value as needed
          } else {
            console.error("Invalid value for measure.");
            cell.textContent = ""; // Reset invalid value
          }
        });
        newRow.appendChild(cell);
      });

      // Append the new row to the table
      table.appendChild(newRow);
      console.log("New row added:", newRow);
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
        if (!this._myDataSource || !this._myDataSource.data) {
          console.error("Data source is not bound or data is unavailable.");
          return [];
        }

        // Retrieve dimensions metadata
        const dimensions = this.getDimensions();
        const selectedDimension = dimensions.find((dim) => dim.id === dimensionId);

        if (!selectedDimension) {
          console.error(`Dimension with ID '${dimensionId}' not found.`);
          return [];
        }

        // Retrieve selected rows' data
        const selectedMembers = Array.from(this._selectedRows).map((rowIndex) => {
          const row = this._myDataSource.data[rowIndex];
          if (!row || !row[selectedDimension.key]) return null;

          return row[selectedDimension.key]?.id || null;
        });

        // Filter out any null values
        const filteredMembers = selectedMembers.filter((member) => member !== null);

        console.log(`Selected members for dimension '${dimensionId}':`, filteredMembers);
        return filteredMembers;
      } catch (error) {
        console.error("Error in getDimensionSelected:", error);
        return [];
      }
    }

getMeasureValues(measureId) {
  try {
    if (!this._myDataSource || !this._myDataSource.data) {
      console.error("Data source is not bound or data is unavailable.");
      return [];
    }

    const measures = this.getMeasures();
    const selectedMeasure = measures.find((measure) => measure.id === measureId);

    if (!selectedMeasure) {
      console.error(`Measure with ID '${measureId}' not found.`);
      return [];
    }

    console.log("Selected Measure Metadata:", selectedMeasure);

    // Access the table rows and cells to retrieve edited values
    const table = this._root.querySelector("table");
    if (!table) {
      console.error("Table element not found in the widget.");
      return [];
    }

    const rows = Array.from(table.querySelectorAll("tbody tr"));
    const editedValues = Array.from(this._selectedRows).map((rowIndex) => {
      const row = rows[rowIndex];
      if (!row) {
        console.warn(`Row at index '${rowIndex}' is undefined in the DOM.`);
        return null;
      }

      // Find the cell corresponding to the measure
      const measureIndex = measures.findIndex((measure) => measure.id === measureId);
      if (measureIndex === -1) {
        console.warn(`Measure '${measureId}' not found in table headers.`);
        return null;
      }

      const cell = row.cells[measureIndex + this.getDimensions().length]; // Adjust for dimension columns
      if (!cell) {
        console.warn(`Cell for measure '${measureId}' not found in row '${rowIndex}'.`);
        return null;
      }

      const editedValue = cell.textContent.trim(); // Get the edited value
      console.log(`Edited value for measure '${measureId}' in row '${rowIndex}':`, editedValue);

      return editedValue || null;
    });

    // Filter out null or empty values
    const filteredValues = editedValues.filter((value) => value !== null);

    console.log(`Edited values for measure '${measureId}' as strings:`, filteredValues);
    return filteredValues;
  } catch (error) {
    console.error("Error in getEditedMeasureValues:", error);
    return [];
  }
}


  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
