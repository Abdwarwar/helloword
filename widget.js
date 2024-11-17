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

      // Debug: log the dimensions and measures to make sure we're getting the right data
      console.log("Dimensions:", dimensions);
      console.log("Measures:", measures);

      if (!dimensions.length || !measures.length) {
        this._root.innerHTML = `<p>Ensure dimensions and measures are configured correctly.</p>`;
        return;
      }

      // Generate table headers dynamically based on dimension and measure names from the model
      const headers = [
        ...dimensions.map(dimension => dimension.name), // Use the 'name' of the dimension
        ...measures.map(measure => measure.name)       // Use the 'name' of the measure
      ];

      console.log("Table Headers:", headers);

      // Map data to table rows
      const tableData = this._myDataSource.data.map((row) => {
        const rowData = {};

        // Extracting dimension values for the row
        dimensions.forEach(dimension => {
          const dimensionValue = row[dimension.id]?.label || "N/A"; // Check if the dimension value exists
          rowData[dimension.name] = dimensionValue;
        });

        // Extracting measure values for the row
        measures.forEach(measure => {
          const measureValue = row[measure.id]?.raw || "N/A"; // Check if the measure value exists
          rowData[measure.name] = measureValue;
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

      // Create the table header dynamically based on the 'name' of dimensions and measures
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
