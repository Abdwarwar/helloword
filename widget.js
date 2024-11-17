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

      if (!dimensions.length || !measures.length) {
        this._root.innerHTML = `<p>Ensure dimensions and measures are configured.</p>`;
        return;
      }

      // Map data to table rows, dynamically creating columns based on dimensions and measures
      const tableData = this._myDataSource.data.map((row) => {
        const rowData = {};
        dimensions.forEach((dimension) => {
          rowData[dimension] = row[dimension]?.label || "N/A";
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

      // Create table header dynamically
      const headers = [...dimensions.map(d => d.name), ...measures.map(m => m.name)];

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
