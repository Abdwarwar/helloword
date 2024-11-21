(function () {
  const prepared = document.createElement("template");
  prepared.innerHTML = `
    <style>
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f4f4f4; }
      tr:nth-child(even) { background-color: #f9f9f9; }
      tr.selected { background-color: #ffeb3b; }
      .button-cell button { padding: 5px 10px; cursor: pointer; }
    </style>
    <div id="root" style="width: 100%; height: 100%; overflow: auto;"></div>
  `;

  class CustomTableWidget extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(prepared.content.cloneNode(true));
      this._root = this._shadowRoot.getElementById("root");
      this._myDataSource = null; // Initialize the data source
    }

    connectedCallback() {
      console.log("Widget Connected to DOM");
      this.render();
    }

    // Bind Data Source
    set myDataSource(dataBinding) {
      console.log("Data binding received:", dataBinding);
      this._myDataSource = dataBinding;
      this.render();
    }

    render() {
      if (!this._myDataSource) {
        this._root.innerHTML = `<p>Data source not yet initialized...</p>`;
        return;
      }

      if (this._myDataSource.state !== "success") {
        this._root.innerHTML = `<p>Loading data...</p>`;
        return;
      }

      const dimensions = this.getDimensions();
      const measures = this.getMeasures();

      if (dimensions.length === 0 || measures.length === 0) {
        this._root.innerHTML = `<p>Please add Dimensions and Measures in the Builder Panel.</p>`;
        return;
      }

      const dimensionHeaders = dimensions.map((dim) => dim.description || dim.id);
      const measureHeaders = measures.map((measure) => measure.description || measure.id);

      const tableData = this._myDataSource.data.map((row) => {
        const rowData = {};
        dimensions.forEach((dim) => {
          rowData[dim.id] = row[dim.key]?.label || "N/A";
        });
        measures.forEach((measure) => {
          rowData[measure.id] = row[measure.key]?.raw || "N/A";
        });
        return rowData;
      });

      if (tableData.length === 0) {
        this._root.innerHTML = `<p>No data available to display.</p>`;
        return;
      }

      const table = document.createElement("table");
      table.innerHTML = `
        <thead>
          <tr>
            ${dimensionHeaders.map((dim) => `<th>${dim}</th>`).join("")}
            ${measureHeaders.map((measure) => `<th>${measure}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${tableData
            .map(
              (row, rowIndex) =>
                `<tr>${dimensions
                  .map((dim) => `<td>${row[dim.id]}</td>`)
                  .join("")}${measures
                  .map(
                    (measure) =>
                      `<td contenteditable="true" data-row="${rowIndex}" data-measure="${measure.id}">${row[measure.id]}</td>`
                  )
                  .join("")}</tr>`
            )
            .join("")}
        </tbody>
      `;

      this._root.innerHTML = "";
      this._root.appendChild(table);

      // Add event listeners for editable cells
      this.addEditableListeners(dimensions, measures);
    }

    // Get Dimensions
    getDimensions() {
      if (!this._myDataSource || !this._myDataSource.metadata) {
        console.error("Data binding or metadata not available.");
        return [];
      }
      const dimensionKeys = this._myDataSource.metadata.feeds.dimensions.values;
      return dimensionKeys.map((key) => {
        const dimension = this._myDataSource.metadata.dimensions[key];
        return {
          id: dimension.id,
          key,
          description: dimension.description || dimension.id,
        };
      });
    }

    // Get Measures
    getMeasures() {
      if (!this._myDataSource || !this._myDataSource.metadata) {
        console.error("Data binding or metadata not available.");
        return [];
      }
      const measureKeys = this._myDataSource.metadata.feeds.measures.values;
      return measureKeys.map((key) => {
        const measure = this._myDataSource.metadata.mainStructureMembers[key];
        return {
          id: measure.id,
          key,
          description: measure.description || measure.id,
        };
      });
    }

    // Add Editable Listeners for Cells
    addEditableListeners(dimensions, measures) {
      const cells = this._root.querySelectorAll('td[contenteditable="true"]');
      cells.forEach((cell) => {
        cell.addEventListener("blur", (event) => {
          const rowIndex = event.target.getAttribute("data-row");
          const measureId = event.target.getAttribute("data-measure");
          const newValue = parseFloat(event.target.textContent.trim());
          console.log(`Updating measure '${measureId}' for row ${rowIndex} with value: ${newValue}`);
          // Push updated value to the model
          this.pushDataToModel(rowIndex, measureId, newValue, dimensions);
        });
      });
    }

    // Push Data to Model
    pushDataToModel(rowIndex, measureId, newValue, dimensions) {
      if (!this._myDataSource || !this._myDataSource.isPlanningEnabled) {
        console.error("Planning is not enabled or data source is not bound.");
        return;
      }

      const dimensionValues = dimensions.map((dim) => ({
        dimension: dim.id,
        value: this._myDataSource.data[rowIndex][dim.key]?.id || null,
      }));

      const planningPayload = {
        measure: measureId,
        value: newValue,
        dimensionValues,
      };

      this._myDataSource
        .updatePlanningData(planningPayload)
        .then(() => {
          console.log("Planning data pushed successfully.");
          this._myDataSource.submitPlanningData().then(() => {
            console.log("Planning data submitted successfully.");
            this.refreshDataSource();
          });
        })
        .catch((error) => {
          console.error("Error pushing planning data:", error);
        });
    }

    // Refresh Data Source
    refreshDataSource() {
      if (!this._myDataSource) return;
      this._myDataSource
        .refresh()
        .then(() => {
          console.log("Data source refreshed successfully.");
          this.render();
        })
        .catch((error) => {
          console.error("Error refreshing data source:", error);
        });
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
