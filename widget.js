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
          td {
            cursor: pointer;
          }
          td.editable {
            background-color: #eaffea;
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

      const dimensionHeaders = dimensions.map(
        (dim) => this._myDataSource.metadata.dimensions[dim]?.description || dim
      );
      const measureHeaders = measures.map(
        (measure) =>
          this._myDataSource.metadata.mainStructureMembers[measure]?.description || measure
      );

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

      const headerRow = `<tr>${dimensionHeaders
        .map((header) => `<th>${header}</th>`)
        .join("")}${measureHeaders
        .map((header) => `<th>${header}</th>`)
        .join("")}</tr>`;
      table.innerHTML = `
        <thead>${headerRow}</thead>
        <tbody>
          ${tableData
            .map(
              (row, rowIndex) =>
                `<tr>${dimensions
                  .map((dim) => `<td>${row[dim]}</td>`)
                  .join("")}${measures
                  .map(
                    (measure) =>
                      `<td class="editable" data-measure="${measure}" data-row="${rowIndex}">${row[measure]}</td>`
                  )
                  .join("")}</tr>`
            )
            .join("")}
        </tbody>
      `;

      this._root.innerHTML = "";
      this._root.appendChild(table);

      this.addEventListeners(measures);
    }

    addEventListeners(measures) {
      const editableCells = this._root.querySelectorAll("td.editable");
      editableCells.forEach((cell) => {
        cell.addEventListener("click", () => this.makeCellEditable(cell));
        cell.addEventListener("blur", (event) =>
          this.handleEdit(event.target, measures)
        );
      });
    }

    makeCellEditable(cell) {
      const oldValue = cell.textContent;
      cell.setAttribute("contenteditable", "true");
      cell.focus();
      cell.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          cell.blur();
        } else if (event.key === "Escape") {
          cell.textContent = oldValue;
          cell.blur();
        }
      });
    }

    async handleEdit(cell, measures) {
      const newValue = parseFloat(cell.textContent.trim());
      const measureId = cell.getAttribute("data-measure");
      const rowIndex = parseInt(cell.getAttribute("data-row"), 10);

      if (isNaN(newValue)) {
        alert("Please enter a valid number.");
        return;
      }

      try {
        await this._myDataSource.setCellValue(
          { row: rowIndex, column: measureId },
          newValue
        );
        alert("Value successfully updated!");
      } catch (error) {
        alert("Failed to update the value: " + error.message);
      } finally {
        cell.removeAttribute("contenteditable");
      }
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
