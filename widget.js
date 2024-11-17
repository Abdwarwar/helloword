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

      // Extract dimensions and measures
      const dimensions = this._myDataSource.metadata.feeds.dimensions.values;
      const measures = this._myDataSource.metadata.feeds.measures.values;

      if (dimensions.length === 0 || measures.length === 0) {
        this._root.innerHTML = `<p>Ensure dimensions and measures are configured.</p>`;
        return;
      }

      // Map data to table rows with multiple dimensions and measures
      const tableData = this._myDataSource.data.map((row) => {
        const rowData = {};

        // Add all dimension data (each dimension in a separate column)
        dimensions.forEach((dimension) => {
          rowData[dimension] = row[dimension]?.label || "N/A";
        });

        // Add all measure data
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

      // Create table headers dynamically based on the dimensions and measures
      const headers = [
        ...dimensions.map((dimension) => `<th>${dimension}</th>`), // Separate column for each dimension
        ...measures.map((measure) => `<th>${measure}</th>`), // Separate column for each measure
      ].join("");

      // Create table rows dynamically for each row of data
      const rows = tableData
        .map((row) => {
          const rowHtml = [
            ...dimensions.map((dimension) => `<td>${row[dimension]}</td>`), // Add data for each dimension
            ...measures.map((measure) => `<td>${row[measure]}</td>`), // Add data for each measure
          ].join("");
          return `<tr>${rowHtml}</tr>`;
        })
        .join("");

      // Create table with headers and rows
      const table = document.createElement("table");
      table.innerHTML = `
          <thead>
              <tr>
                  ${headers}
              </tr>
          </thead>
          <tbody>
              ${rows}
          </tbody>
      `;

      // Clear existing content and add the table
      this._root.innerHTML = "";
      this._root.appendChild(table);
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
