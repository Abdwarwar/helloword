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
  `;

  class CustomTableWidget extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(prepared.content.cloneNode(true));
      this._root = this._shadowRoot.getElementById("root");
      this._selectedRows = new Set(); // Track selected rows
      this._myDataSource = null;
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
    this._root.innerHTML = `<p>No dimensions or measures found.</p>`;
    return;
  }

  console.log("Resolved Dimensions:", dimensions);
  console.log("Resolved Measures:", measures);

  const tableData = this._myDataSource.data.map((row, index) => ({
    index,
    ...dimensions.reduce((acc, dim) => {
      acc[dim.id] = row[dim.key]?.label || "N/A";
      return acc;
    }, {}),
    ...measures.reduce((acc, measure) => {
      acc[measure.id] = row[measure.key]?.raw || "N/A";
      return acc;
    }, {}),
  }));

  console.log("Table Data:", tableData);

  // Render the table
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
                `<td class="editable" data-measure-id="${measure.id}" contenteditable="true">${row[measure.id]}</td>`
            )
            .join("")}
        </tr>`
    )
    .join("")}
</tbody>

  `;

  this._root.innerHTML = "";
  this._root.appendChild(table);
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
        });
      });
    }

makeMeasureCellsEditable() {
  const rows = this._root.querySelectorAll("tbody tr");
  rows.forEach((row) => {
    const rowIndex = row.getAttribute("data-row-index");
    const cells = row.querySelectorAll("td.editable");

    cells.forEach((cell) => {
      const measureId = cell.getAttribute("data-measure-id");
      cell.contentEditable = "true";

      // Handle blur event to capture the new value
      cell.addEventListener("blur", async (event) => {
        const newValue = parseFloat(cell.textContent.trim());

        if (!isNaN(newValue)) {
          console.log(`Row ${rowIndex}, Measure ${measureId} updated to: ${newValue}`);

          const dimensions = this.getDimensions();
          const rowData = this._myDataSource.data[rowIndex];
          const Projects = this.getDimensionSelected("DIM_RCU_PROJECT");
          const Audit_Trail = this.getDimensionSelected("DIM_RCU_AUDIT_TRAIL");

          console.log("Projects:", Projects);
          console.log("Audit_Trail:", Audit_Trail);

          // Construct user input for planning
          const cash = {
            "@MeasureDimension": "Cash",
            "DIM_RCU_PROJECT": Projects[rowIndex] || null,
            "DIM_RCU_AUDIT_TRAIL": Audit_Trail[rowIndex] || null,
            "Version": "public.Budget", // Adjust based on your model
          };

          console.log("Constructed User Input for Planning:", cash);

          const planning = this._myDataSource?.getPlanning?.();
          if (!planning) {
            console.error("Planning API is not available for this data source.");
            return;
          }

          try {
            // Set user input and submit data
            await planning.setUserInput(cash, newValue);
            console.log("User input set successfully:", cash, "New Value:", newValue);

            await planning.submitData();
            console.log("Data successfully written back to the model.");

            this._myDataSource.refreshData();
          } catch (error) {
            console.error("Error during setUserInput or submitData:", error);
          }
        } else {
          console.error("Invalid input, resetting value.");
          cell.textContent = this._myDataSource.data[rowIndex][measureId]?.raw || "N/A";
        }
      });
    });
  });
}

// Helper function to get selected rows for a given dimension
getDimensionSelected(dimensionId) {
  try {
    if (!this._myDataSource || !this._myDataSource.data) {
      console.error("Data source is not bound or data is unavailable.");
      return [];
    }

    const dimensions = this.getDimensions();
    const selectedDimension = dimensions.find((dim) => dim.id === dimensionId);

    if (!selectedDimension) {
      console.error(`Dimension with ID '${dimensionId}' not found.`);
      return [];
    }

    // Retrieve selected rows' data
    const selectedMembers = this._myDataSource.data.map((row) => {
      if (!row || !row[selectedDimension.key]) return null;
      return row[selectedDimension.key]?.id || null;
    });

    console.log(`Selected members for dimension '${dimensionId}':`, selectedMembers);
    return selectedMembers.filter((member) => member !== null);
  } catch (error) {
    console.error("Error in getDimensionSelected:", error);
    return [];
  }
}


    getDimensions() {
      if (!this._myDataSource || !this._myDataSource.metadata) {
        console.error("Data source metadata is unavailable.");
        return [];
      }

      const dimensionsKeys = this._myDataSource.metadata.feeds.dimensions.values;

      return dimensionsKeys.map((key) => {
        const dimension = this._myDataSource.metadata.dimensions[key];
        return {
          id: dimension.id,
          key,
          description: dimension.description || dimension.id || key,
        };
      });
    }

    getMeasures() {
      if (!this._myDataSource || !this._myDataSource.metadata) {
        console.error("Data source metadata is unavailable.");
        return [];
      }

      const measuresKeys = this._myDataSource.metadata.feeds.measures.values;

      return measuresKeys.map((key) => {
        const measure = this._myDataSource.metadata.mainStructureMembers[key];
        return {
          id: measure.id,
          key,
          description: measure.description || measure.id || key,
        };
      });
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
