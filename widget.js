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
          input {
            width: 100%;
            box-sizing: border-box;
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

      // Inspect the data structure and check the field for filtering
      console.log("Inspecting data rows:");
      this._myDataSource.data.forEach((row, index) => {
        console.log(`Row ${index + 1}:`, row);
      });

      // Filter data to include only booking records
      const filteredData = this._myDataSource.data.filter((row) => {
        // Replace 'status' with the correct field name (e.g., 'type', 'category', etc.)
        // Make sure the value to filter by is correct, such as 'Booking'
        return row.status && row.status.label === "Booking"; // Modify condition as needed
      });

      console.log("Filtered Data:", filteredData);

      if (filteredData.length === 0) {
        this._root.innerHTML = `<p>No booking data available to display.</p>`;
        return;
      }

      // Extract dimensions and measures
      const dimensions = this._myDataSource.metadata.feeds.dimensions.values;
      const measures = this._myDataSource.metadata.feeds.measures.values;

      if (!dimensions || !measures) {
        this._root.innerHTML = `<p>Ensure dimensions and measures are configured.</p>`;
        return;
      }

      // Map data to table rows
      const tableData = filteredData.map((row) => {
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

      // Create table headers dynamically based on dimensions and measures
      const tableHeaders = [
        ...dimensions.map((dim) => `<th>${dim}</th>`),
        ...measures.map((measure) => `<th>${measure}</th>`),
      ].join("");

      // Create table body with editable cells for measures
      const tableRows = tableData
        .map((row) => {
          const rowCells = [
            ...dimensions.map(
              (dim) => `<td>${row[dim] || "N/A"}</td>`
            ),
            ...measures.map(
              (measure) => `<td><input type="text" value="${row[measure]}" data-measure="${measure}" data-row-id="${row.rowId}" /></td>`
            ),
          ].join("");
          return `<tr>${rowCells}</tr>`;
        })
        .join("");

      // Create table
      const table = document.createElement("table");
      table.innerHTML = `
          <thead>
              <tr>
                  ${tableHeaders}
              </tr>
          </thead>
          <tbody>
              ${tableRows}
          </tbody>
      `;

      // Event listener to handle cell edit
      table.querySelectorAll("input").forEach((input) => {
        input.addEventListener("change", (e) => {
          const measure = e.target.getAttribute("data-measure");
          const rowId = e.target.getAttribute("data-row-id");
          const newValue = e.target.value;

          console.log(`Updated value for measure ${measure} in row ${rowId}: ${newValue}`);
          
          // Here, we should update the internal data structure accordingly
          // Assuming we have a way to find the row by rowId and update the data
          const updatedRow = this._myDataSource.data.find((row) => row.rowId === rowId);
          if (updatedRow) {
            updatedRow[measure].raw = newValue;
          }
        });
      });

      // Clear existing content and add the table
      this._root.innerHTML = "";
      this._root.appendChild(table);
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
