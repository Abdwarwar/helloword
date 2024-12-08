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

  // Debug logs to verify data source and planning object
  console.log("Data Source Object:", this._myDataSource);
  console.log("Planning Object:", this._myDataSource?.getPlanning?.());
  
  const dimensions = this.getDimensions();
  const measures = this.getMeasures();

  if (dimensions.length === 0 || measures.length === 0) {
    this._root.innerHTML = `<p>Please add Dimensions and Measures in the Builder Panel.</p>`;
    return;
  }

  console.log("Resolved Dimensions:", dimensions);
  console.log("Resolved Measures:", measures);

  // Render the table...
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

      cell.addEventListener("blur", async (event) => {
        const newValue = parseFloat(cell.textContent.trim());

        if (!isNaN(newValue)) {
          console.log(`Row ${rowIndex}, Measure ${measureId} updated to: ${newValue}`);

          // Debug logs to check data source and planning object
          console.log("Data Source Object:", this._myDataSource);
          console.log("Planning Object:", this._myDataSource?.getPlanning?.());

          // Proceed with planning logic
          const planning = this._myDataSource?.getPlanning?.();
          if (!planning) {
            console.error("Planning API is not available for this data source.");
            return;
          }

          try {
            const dimensions = this.getDimensions();
            const rowData = this._myDataSource.data[rowIndex];
            const userInput = {
              "@MeasureDimension": measureId,
              ...dimensions.reduce((acc, dim) => {
                acc[dim.id] = rowData[dim.key]?.id || null;
                return acc;
              }, {}),
              Version: "public.Budget",
            };

            await planning.setUserInput(userInput, newValue);
            await planning.submitData();
            console.log("Data successfully written back to the model.");
            this._myDataSource.refreshData();
          } catch (error) {
            console.error("Error submitting data to the model:", error);
          }
        } else {
          console.error("Invalid input, resetting value.");
          cell.textContent = this._myDataSource.data[rowIndex][measureId]?.raw || "N/A";
        }
      });
    });
  });
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
