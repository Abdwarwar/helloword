(function () {
  const prepared = document.createElement("template");
  prepared.innerHTML = `
    <style>
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f4f4f4; }
      tr:nth-child(even) { background-color: #f9f9f9; }
    </style>
    <div id="root" style="width: 100%; height: 100%; overflow: auto;"></div>
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

      const tableData = this._myDataSource.data.map((row) => {
        const rowData = {};
        dimensions.forEach((dim) => {
          rowData[dim] = row[dim]?.label || "N/A";
        });
        measures.forEach((measureId) => {
          rowData[measureId] = row[measureId]?.raw || "N/A";
        });
        return rowData;
      });

      if (tableData.length === 0) {
        this._root.innerHTML = `<p>No data available to display.</p>`;
        return;
      }

      const table = document.createElement("table");
      const headerRow = `
        <tr>${dimensions.map((dim) => `<th>${dim}</th>`).join("")}
        ${measures.map((measure) => `<th>${measure}</th>`).join("")}</tr>
      `;

      table.innerHTML = `
        <thead>${headerRow}</thead>
        <tbody>
          ${tableData.map(
            (row) => `
              <tr>${dimensions.map((dim) => `<td>${row[dim]}</td>`).join("")}
                ${measures.map(
                  (measure) =>
                    `<td contenteditable="true" data-dimension="${dimensions[0]}" data-measure="${measure}">${row[measure]}</td>`
                ).join("")}
              </tr>`
          ).join("")}
        </tbody>
      `;

      this._root.innerHTML = "";
      this._root.appendChild(table);
      this.addEventListenersToEditableCells();
    }

    addEventListenersToEditableCells() {
      const editableCells = this._root.querySelectorAll("td[contenteditable='true']");
      editableCells.forEach((cell) => {
        cell.addEventListener("blur", (event) => this.handleCellEdit(event));
      });
    }

    async handleCellEdit(event) {
      const editedValue = event.target.innerText;
      const dimension = event.target.getAttribute("data-dimension");
      const measure = event.target.getAttribute("data-measure");
      const rowIndex = Array.from(event.target.parentElement.parentNode.children).indexOf(
        event.target.parentElement
      );

      try {
        const payload = {
          dimension: dimension,
          measure: measure,
          row: rowIndex,
          value: editedValue,
        };

        const response = await this._myDataSource.writeBack(payload);
        console.log("Planning API Response:", response);
        alert("Data updated successfully!");
      } catch (error) {
        console.error("Write-back failed:", error);
        alert("Failed to update the model.");
      }
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
