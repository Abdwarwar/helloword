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
      this._props = {
        dataRefreshMode: "AlwaysRefresh",
      };
      console.log("Default Properties:", this._props);
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
      console.log("Rendering Widget with Properties:", this._props);

      // Check if the data source is bound
      if (!this._myDataSource) {
        this._root.innerHTML = `<p>Widget is initializing...</p>`;
        return;
      }

      // Check planning capabilities
      if (!this._myDataSource.isPlanningEnabled) {
        console.error("Planning is not enabled for this widget.");
        this._root.innerHTML = `<p>Planning is not enabled for the data source.</p>`;
        return;
      }

      // Check the state of the data source
      if (this._myDataSource.state !== "success") {
        console.log("Data source not ready. Rendering loading state.");
        this._root.innerHTML = `<p>Loading data...</p>`;
        return;
      }

      console.log("Data source ready. Rendering table.");

      // Extract dimensions and measures
      const dimensions = this._myDataSource.metadata.feeds.dimensions.values;
      const measures = this._myDataSource.metadata.feeds.measures.values;

      if (dimensions.length === 0 || measures.length === 0) {
        this._root.innerHTML = `<p>Please add Dimensions and Measures in the Builder Panel.</p>`;
        return;
      }

      // Fetch proper descriptions for dimensions and measures
      const dimensionHeaders = dimensions.map(
        (dim) => this._myDataSource.metadata.dimensions[dim]?.description || dim
      );
      const measureHeaders = measures.map(
        (measure) =>
          this._myDataSource.metadata.mainStructureMembers[measure]?.id || measure
      );

      // Prepare table data
      const tableData = this._myDataSource.data.map((row) => {
        const rowData = {};
        dimensions.forEach((dim) => {
          rowData[dim] = row[dim]?.label || "N/A";
        });
        measures.forEach((measureId) => {
          rowData[measureId] = row[measureId]?.raw || "N/A";
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
                      `<td contenteditable="true" data-row="${rowIndex}" data-measure="${measure}">${row[measure]}</td>`
                  )
                  .join("")}</tr>`
            )
            .join("")}
        </tbody>
      `;

      this._root.innerHTML = "";
      this._root.appendChild(table);

      // Add event listeners for editable cells
      this.addEditableListeners();
    }

    addEditableListeners() {
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
          this.pushDataToModel(rowIndex, measureId, newValue);
        });
      });
    }

    pushDataToModel(rowIndex, measureId, newValue) {
      if (!this._myDataSource) {
        console.error("Data source is not bound. Cannot push data.");
        return;
      }

      if (!this._myDataSource.isPlanningEnabled) {
        console.error("Planning is not enabled for this data source.");
        return;
      }

      const updatedData = {};
      updatedData[measureId] = newValue;

      const rowId = this._myDataSource.data[rowIndex]["ID"];
      const dataForUpdate = {
        ID: rowId, // Use the primary key of the row
        ...updatedData,
      };

      this._myDataSource
        .pushPlanningData([dataForUpdate])
        .then(() => {
          console.log(`Successfully pushed planning data for row ID ${rowId}`);
          this.refreshDataSource(); // Refresh the table to show the updated value
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
