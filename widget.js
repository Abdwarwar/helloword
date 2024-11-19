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

      // Initialize default properties
      this._props = {};
      console.log("Widget initialized with default properties.");
    }

    connectedCallback() {
      console.log("Widget Connected to DOM");
      this.render();
    }

    set myDataSource(dataBinding) {
      this._myDataSource = dataBinding;
      this.render();
    }

    render() {
      console.log("Rendering Widget");

      // Check if the data source is bound
      if (!this._myDataSource) {
        this._root.innerHTML = `<p>Widget is initializing...</p>`;
        return;
      }

      // Check the state of the data source
      if (this._myDataSource.state !== "success") {
        console.log("Data source not ready. Rendering loading state.");
        this._root.innerHTML = `<p>Loading data...</p>`;
        return;
      }

      console.log("Data source ready. Rendering table.");

      // Extract dimensions and resolved measures
      const dimensions = this._myDataSource.metadata.feeds.dimensions.values;
      const measures = this.resolveMeasureIds();

      if (dimensions.length === 0 || measures.length === 0) {
        this._root.innerHTML = `<p>Please add Dimensions and Measures in the Builder Panel.</p>`;
        return;
      }

      const dimensionHeaders = dimensions.map(
        (dim) => this._myDataSource.metadata.dimensions[dim]?.description || dim
      );
      const measureHeaders = measures.map((measure) => measure.description);

      const tableData = this._myDataSource.data.map((row) => {
        const rowData = {};
        dimensions.forEach((dim) => {
          rowData[dim] = row[dim]?.label || "N/A";
        });
        measures.forEach((measure) => {
          rowData[measure.id] = row[measure.id]?.raw || "N/A";
        });
        return rowData;
      });

      if (tableData.length === 0) {
        this._root.innerHTML = `<p>No data available to display.</p>`;
        return;
      }

      const table = document.createElement("table");

      const headerRow = `
        <tr>${dimensionHeaders.map((dim) => `<th>${dim}</th>`).join("")}
        ${measureHeaders.map((measure) => `<th>${measure}</th>`).join("")}</tr>
      `;

      table.innerHTML = `
        <thead>${headerRow}</thead>
        <tbody>
          ${tableData
            .map(
              (row, rowIndex) =>
                `<tr>${dimensions
                  .map((dim) => `<td>${row[dim]}</td>`)
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

    resolveMeasureIds() {
      // Resolve measures to their proper metadata IDs
      const measuresFeed = this._myDataSource.metadata.feeds.measures.values;
      return measuresFeed.map((measureKey) => ({
        id: this._myDataSource.metadata.mainStructureMembers[measureKey]?.id || measureKey,
        description:
          this._myDataSource.metadata.mainStructureMembers[measureKey]?.description || measureKey,
      }));
    }

    addEditableListeners(dimensions, measures) {
      const cells = this._root.querySelectorAll('td[contenteditable="true"]');
      cells.forEach((cell) => {
        cell.addEventListener("blur", (event) => {
          const rowIndex = event.target.getAttribute("data-row");
          const measureId = event.target.getAttribute("data-measure");
          const newValue = parseFloat(event.target.textContent.trim());

          console.log(
            `Updating measure '${measureId}' for row ${rowIndex} with value: ${newValue}`
          );

          // Push updated value to SAC model
          this.pushDataToModel(rowIndex, measureId, newValue, dimensions, measures);
        });
      });
    }

    pushDataToModel(rowIndex, measureId, newValue, dimensions) {
      if (!this._myDataSource) {
        console.error("Data source is not bound. Cannot push data.");
        return;
      }

      if (!this._myDataSource.isPlanningEnabled) {
        console.error("Planning is not enabled for this data source.");
        return;
      }

      // Prepare the updated data structure for pushPlanningData
      const dimensionValues = dimensions.map((dim) => ({
        dimension: dim,
        value: this._myDataSource.data[rowIndex][dim]?.id || null,
      }));

      const updatedData = {
        measure: measureId,
        value: newValue,
        dimensionValues,
      };

      this._myDataSource
        .pushPlanningData([updatedData])
        .then(() => {
          console.log(`Successfully pushed planning data for row ${rowIndex}`);
          this.refreshDataSource();
        })
        .catch((error) => {
          console.error("Error pushing planning data to SAC model:", error);
        });
    }

    refreshDataSource() {
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
