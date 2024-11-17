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

      // Log structure of one row to inspect how 'status' is stored
      console.log("Single row data:", JSON.stringify(this._myDataSource.data[0], null, 2));

      // Extract dimensions and measures
      const dimension = this._myDataSource.metadata.feeds.dimensions.values[0];
      const measure = this._myDataSource.metadata.feeds.measures.values[0];

      if (!dimension || !measure) {
        this._root.innerHTML = `<p>Ensure dimensions and measures are configured.</p>`;
        return;
      }

      // Filter out only rows with "Booking" status
      const filteredData = this._myDataSource.data.filter((row) => {
        console.log("Row being checked:", row); // Log each row to inspect its structure
        const isBooking = row.status && row.status.label === "Booking"; // Adjust field path here if necessary
        console.log("Is Booking?", isBooking); // Log whether this row matches
        return isBooking;
      });

      console.log("Filtered Data (Booking only):", filteredData); // Log filtered data to confirm it's working

      if (filteredData.length === 0) {
        this._root.innerHTML = `<p>No booking data available to display.</p>`;
        return;
      }

      // Map data to table rows
      const tableData = filteredData.map((row) => ({
        dimension: row[dimension]?.label || "N/A",
        measure: row[measure]?.raw || "N/A",
      }));

      console.log("Mapped Table Data:", tableData);

      if (tableData.length === 0) {
        this._root.innerHTML = `<p>No data available to display.</p>`;
        return;
      }

      // Create table
      const table = document.createElement("table");
      table.innerHTML = `
          <thead>
              <tr>
                  <th>Dimension</th>
                  <th>Measure</th>
              </tr>
          </thead>
          <tbody>
              ${tableData
                .map(
                  (row) => `
                  <tr>
                      <td>${row.dimension}</td>
                      <td>${row.measure}</td>
                  </tr>
              `)
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
