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
            border: none;
            text-align: right;
            background-color: transparent;
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

      if (!dimensions.length || !measures.length) {
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

      // Create headers
      table.innerHTML = `
          <thead>
              <tr>
                  ${dimensions.map((dim) => `<th>${dim}</th>`).join("")}
                  ${measures.map((measure) => `<th>${measure}</th>`).join("")}
              </tr>
          </thead>
      `;

      // Create rows
      const tbody = document.createElement("tbody");
      tableData.forEach((row, rowIndex) => {
        const tr = document.createElement("tr");

        dimensions.forEach((dim) => {
          const td = document.createElement("td");
          td.textContent = row[dim];
          tr.appendChild(td);
        });

        measures.forEach((measure) => {
          const td = document.createElement("td");
          const input = document.createElement("input");
          input.type = "number";
          input.value = row[measure];
          input.addEventListener("change", () => this.updateModel(rowIndex, measure, input.value));
          td.appendChild(input);
          tr.appendChild(td);
        });

        tbody.appendChild(tr);
      });

      table.appendChild(tbody);

      this._root.innerHTML = "";
      this._root.appendChild(table);
    }

    updateModel(rowIndex, measure, newValue) {
      const newMeasureValue = parseFloat(newValue);
      if (isNaN(newMeasureValue)) {
        alert("Invalid number!");
        return;
      }

      this._myDataSource.data[rowIndex][measure].raw = newMeasureValue;
      this._myDataSource.data[rowIndex][measure].label = newMeasureValue.toString();

      this._myDataSource.update(this._myDataSource.data);
      console.log(`Updated model: Row ${rowIndex}, Measure ${measure}, New Value ${newMeasureValue}`);
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
