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

      console.log("Data Source State:", this._myDataSource.state);
      console.log("Metadata Feeds:", this._myDataSource.metadata?.feeds);
      console.log("Data Source Content:", this._myDataSource.data);

      if (this._myDataSource.state !== "success") {
        this._root.innerHTML = `<p>Loading data...</p>`;
        return;
      }

      // Extract dimensions and measures from metadata
      const dimensions = this._myDataSource.metadata.feeds.dimensions.values;
      const measures = this._myDataSource.metadata.feeds.measures.values;

      // Check if dimensions and measures are present
      if (!dimensions.length || !measures.length) {
        this._root.innerHTML = `<p>Ensure dimensions and measures are configured correctly.</p>`;
        return;
      }

      // Prepare headers (just use dimension and measure names)
      const headers = [
        ...dimensions.map(dimension => dimension.name || `Dimension ${dimension.id}`),
        ...measures.map(measure => measure.name || `Measure ${measure.id}`)
      ];

      // Map data to rows
      const tableData = this._myDataSource.data.map((row) => {
        const rowData = {};

        // Loop through the dimensions and populate the rowData object
        dimensions.forEach(dimension => {
          const dimensionValue = row[dimension.id]?.label || "N/A";
          rowData[dimension.name || `Dimension ${dimension.id}`] = dimensionValue;
        });

        // Loop through the measures and populate the rowData object
        measures.forEach(measure => {
          const measureValue = row[measure.id]?.raw || "N/A";
          rowData[measure.name || `Measure ${measure.id}`] = measureValue;
        });

        return rowData;
      });

      // If no data is found, display a message
      if (tableData.length === 0) {
        this._root.innerHTML = `<p>No data available to display.</p>`;
        return;
      }

      // Create table and populate it with data
      const table = document.createElement("table");

      table.innerHTML = `
          <thead>
              <tr>
                  ${headers.map(header => `<th>${header}</th>`).join("")}
              </tr>
          </thead>
          <tbody>
              ${tableData
                .map(
                  (row) => `
                  <tr>
                      ${headers.map(header => `<td>${row[header] || "N/A"}</td>`).join("")}
                  </tr>
              `
                )
                .join("")}
          </tbody>
      `;

      // Clear existing content and add the table
      this._root.innerHTML = "";
      this._root.appendChild(table);
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
