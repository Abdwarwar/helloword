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
          td[contenteditable="true"] {
            background-color: #e8f0fe;
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
        this._root.innerHTML = `<p>Ensure dimensions and measures are configured in the model.</p>`;
        return;
      }

      // Get metadata names
      const dimensionHeaders = dimensions.map(
        (dim) => this._myDataSource.metadata.dimensions[dim]?.description || dim
      );
      const measureHeaders = measures.map(
        (measure) =>
          this._myDataSource.metadata.mainStructureMembers[measure]?.description ||
          measure
      );

      // Map data to table rows
      const tableData = this._myDataSource.data.map((row, rowIndex) => {
        const rowData = { index: rowIndex };
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

      // Create table
      const table = document.createElement("table");

      // Create header
      const headerRow = `<tr>${dimensionHeaders
        .map((header) => `<th>${header}</th>`)
        .join("")}${measureHeaders
        .map((header) => `<th>${header}</th>`)
        .join("")}</tr>`;
      table.innerHTML = `<thead>${headerRow}</thead>`;

      // Create body
      const tbody = document.createElement("tbody");
      tableData.forEach((row) => {
        const tableRow = document.createElement("tr");
        dimensions.forEach((dim) => {
          const cell = document.createElement("td");
          cell.textContent = row[dim];
          tableRow.appendChild(cell);
        });
        measures.forEach((measure) => {
          const cell = document.createElement("td");
          cell.textContent = row[measure];
          cell.setAttribute("contenteditable", "true");
          cell.setAttribute("data-measure", measure);
          cell.setAttribute("data-row", row.index);

          cell.addEventListener("blur", () => this.handleEdit(cell, measures));
          tableRow.appendChild(cell);
        });
        tbody.appendChild(tableRow);
      });

      table.appendChild(tbody);

      // Clear existing content and add the table
      this._root.innerHTML = "";
      this._root.appendChild(table);
    }

    async handleEdit(cell) {
      const newValue = parseFloat(cell.textContent.trim());
      const measureId = cell.getAttribute("data-measure");
      const rowIndex = parseInt(cell.getAttribute("data-row"), 10);

      if (isNaN(newValue)) {
        alert("Please enter a valid number.");
        return;
      }

      try {
        // Ensure planning is enabled
        if (!this._myDataSource.isPlanningEnabled()) {
          alert("Planning is not enabled for the data source.");
          return;
        }

        // Update the cell value in the model
        await this._myDataSource.setCellValue(
          { row: rowIndex, column: measureId },
          newValue
        );

        // Provide feedback
        alert("Value successfully updated in the model!");
      } catch (error) {
        alert("Failed to update the value: " + error.message);
      } finally {
        cell.removeAttribute("contenteditable");
      }
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
