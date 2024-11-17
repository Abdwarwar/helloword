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
          input[type="number"] {
            width: 100%;
            border: none;
            background-color: transparent;
            text-align: left;
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

      if (this._myDataSource.state !== "success") {
        this._root.innerHTML = `<p>Loading data...</p>`;
        return;
      }

      const dimensions = this._myDataSource.metadata.feeds.dimensions.values;
      const measures = this._myDataSource.metadata.feeds.measures.values;

      if (dimensions.length === 0 || measures.length === 0) {
        this._root.innerHTML = `<p>Ensure dimensions and measures are configured.</p>`;
        return;
      }

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

      if (tableData.length === 0) {
        this._root.innerHTML = `<p>No data available to display.</p>`;
        return;
      }

      const table = document.createElement("table");
      table.innerHTML = `
          <thead>
              <tr>
                  ${dimensions.map((dim) => `<th>${dim}</th>`).join("")}
                  ${measures.map((measure) => `<th>${measure}</th>`).join("")}
              </tr>
          </thead>
          <tbody>
              ${tableData
                .map(
                  (row, rowIndex) => `
                  <tr>
                      ${dimensions
                        .map((dim) => `<td>${row[dim]}</td>`)
                        .join("")}
                      ${measures
                        .map(
                          (measure) => `
                          <td>
                              <input 
                                  type="number" 
                                  value="${row[measure]}" 
                                  data-row-index="${rowIndex}" 
                                  data-measure="${measure}" 
                                  class="editable-measure" />
                          </td>
                      `
                        )
                        .join("")}
                  </tr>
              `
                )
                .join("")}
          </tbody>
      `;

      this._root.innerHTML = "";
      this._root.appendChild(table);

      // Attach event listener for editable cells
      this._root.querySelectorAll(".editable-measure").forEach((input) => {
        input.addEventListener("change", (event) => this.handleInputChange(event));
      });
    }

    handleInputChange(event) {
      const input = event.target;
      const rowIndex = parseInt(input.dataset.rowIndex, 10);
      const measure = input.dataset.measure;
      const newValue = parseFloat(input.value);

      console.log(`Updated value for row ${rowIndex}, measure ${measure}: ${newValue}`);

      // Update the data in the model
      if (this._myDataSource) {
        const row = this._myDataSource.data[rowIndex];
        if (row && measure in row) {
          row[measure].raw = newValue; // Update raw value
          this._myDataSource.data[rowIndex] = row; // Save back to the data source
          console.log("Updated row in data source:", row);
        }
      }
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
