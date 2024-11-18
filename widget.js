var getScriptPromisify = (src) => {
  return new Promise((resolve) => {
    $.getScript(src, resolve);
  });
};

(function () {
  const prepared = document.createElement("template");
  prepared.innerHTML = `
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f4f4f4;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
        </style>
        <div id="root" style="width: 100%; height: 100%; overflow: auto;">
        </div>
      `;

  class CustomTableWidget extends HTMLElement {
    constructor() {
      super();

      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(prepared.content.cloneNode(true));

      this._root = this._shadowRoot.getElementById("root");

      this._props = {};
    }

    onCustomWidgetResize(width, height) {
      this.render();
    }

    set myDataSource(dataBinding) {
      this._myDataSource = dataBinding;
      this.render();
    }

    async render() {
      if (!this._myDataSource) {
        this._root.innerHTML = `<p>No data source bound.</p>`;
        return;
      }

      console.log("Data Source Metadata:", this._myDataSource.metadata);
      console.log("Data Source Data:", this._myDataSource.data);

      if (this._myDataSource.state !== "success") {
        this._root.innerHTML = `<p>Loading data...</p>`;
        return;
      }

      const dimensions = this._myDataSource.metadata.feeds.dimensions.values;
      const measures = this._myDataSource.metadata.feeds.measures.values;

      if (dimensions.length === 0 || measures.length === 0) {
        this._root.innerHTML = `<p>Ensure dimensions and measures are configured in the model.</p>`;
        return;
      }

      // Get metadata names
      const dimensionHeaders = dimensions.map(
        (dim) => this._myDataSource.metadata.dimensions[dim]?.description || dim
      );
      const measureHeaders = measures.map(
        (measure) => this._myDataSource.metadata.mainStructureMembers[measure]?.id || measure
      );

      console.log("Dimension Headers:", dimensionHeaders);
      console.log("Measure Headers:", measureHeaders);

      // Map data to table rows
      const tableData = this._myDataSource.data.map((row) => {
        const rowData = {};
        dimensions.forEach((dim) => {
          rowData[dim] = row[dim]?.label || "N/A";
        });
        measures.forEach((measure) => {
          rowData[measure] = row[measure]?.raw || "N/A";
        });
        return rowData;
      });

      console.log("Mapped Table Data:", tableData);

      if (tableData.length === 0) {
        this._root.innerHTML = `<p>No data available to display.</p>`;
        return;
      }

      // Create table
      const table = document.createElement("table");

      // Create header
      const headerRow = `<tr>${dimensionHeaders
        .map((header) => `<th>${header}</th>`)
        .join("")}${measureHeaders
        .map((header) => `<th>${header}</th>`)
        .join("")}</tr>`;
      table.innerHTML = `
        <thead>${headerRow}</thead>
        <tbody>
          ${tableData
            .map(
              (row) =>
                `<tr>${dimensions
                  .map((dim) => `<td>${row[dim]}</td>`)
                  .join("")}${measures
                  .map((measure) => `<td contenteditable="true" data-measure="${measure}">${row[measure]}</td>`)
                  .join("")}</tr>`
            )
            .join("")}
        </tbody>
      `;

      // Clear existing content and add the table
      this._root.innerHTML = "";
      this._root.appendChild(table);

      // Add event listener for cell editing
      this._root.querySelectorAll("td[contenteditable]").forEach((cell) => {
        cell.addEventListener("input", this.handleCellEdit.bind(this));
      });
    }

    async handleCellEdit(event) {
      const cell = event.target;
      const measure = cell.getAttribute("data-measure");
      const newValue = cell.innerText;

      // Find row and measure in the data source
      const rowIndex = Array.from(cell.parentNode.parentNode.children).indexOf(cell.parentNode);
      const measureIndex = this._myDataSource.metadata.feeds.measures.values.indexOf(measure);

      if (measureIndex === -1) return;

      // Update the measure value
      const row = this._myDataSource.data[rowIndex];
      row[measure] = newValue;

      console.log(`Updated ${measure} in row ${rowIndex} to ${newValue}`);

      // Update backend and push data to the model (use SAC API for planning)
      try {
        await this.updatePlanningModel(rowIndex, measure, newValue);
      } catch (error) {
        console.error("Failed to update model:", error);
      }
    }

    async updatePlanningModel(rowIndex, measure, value) {
      const dataSourceId = this._myDataSource.id;
      const dimensionKeys = Object.keys(this._myDataSource.metadata.dimensions);
      const dimensionValues = this._myDataSource.metadata.feeds.dimensions.values;

      // Prepare payload for updating the model
      const payload = {
        cellData: [
          {
            dimensionKey: dimensionValues[0], // Adjust based on your actual model
            measureKey: measure,
            value: value,
            rowKey: rowIndex, // Adjust based on your actual model
          },
        ],
      };

      try {
        // Call SAC API to update planning model
        await this._myDataSource.writeCellData(payload); // Ensure this is the correct SAC API for write-back
        console.log("Planning model updated successfully");
      } catch (error) {
        console.error("Error while updating planning model:", error);
      }
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
