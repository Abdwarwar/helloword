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

      // Fetch measure names from metadata
      const measureHeaders = measures.map((measure) => {
        const measureObj = this._myDataSource.metadata.mainStructureMembers[measure];
        return measureObj ? measureObj.id : measure; // Use description if available
      });

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

      // Create header row with the correct names
      const headerRow = `
        <tr>
          ${dimensionHeaders.map((header) => `<th>${header}</th>`).join("")}
          ${measureHeaders.map((header) => `<th>${header}</th>`).join("")}
        </tr>
      `;

      // Create table body with data rows
      table.innerHTML = `
        <thead>${headerRow}</thead>
        <tbody>
          ${tableData.map((row) => `
            <tr>
              ${dimensions.map((dim) => `<td>${row[dim]}</td>`).join("")}
              ${measures.map((measure) => `<td>${row[measure]}</td>`).join("")}
            </tr>
          `).join("")}
        </tbody>
      `;

      // Clear existing content and add the new table
      this._root.innerHTML = "";
      this._root.appendChild(table);
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
