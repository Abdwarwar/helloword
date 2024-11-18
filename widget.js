(function () {
  const prepared = document.createElement("template");
  prepared.innerHTML = `
    <style>
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f4f4f4; }
      tr:nth-child(even) { background-color: #f9f9f9; }
      tr.selected { background-color: #ffeb3b; }
      button { padding: 5px 10px; cursor: pointer; }
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
      this._buttonLabel = "Click Me"; // Default button label
    }

    onCustomWidgetResize(width, height) {
      this.render();
    }

    set myDataSource(dataBinding) {
      this._myDataSource = dataBinding;
      this.render();
    }

    get buttonLabel() {
      return this._buttonLabel;
    }

    set buttonLabel(value) {
      this._buttonLabel = value || "Click Me"; // Fallback to default if value is empty
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
      const measureHeaders = measures.map((measureId) => {
        const measureMeta = this._myDataSource.metadata.mainStructureMembers[measureId];
        return measureMeta && measureMeta.id ? measureMeta.id : measureId;
      });

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
        <tr>
          ${dimensionHeaders.map((header) => `<th>${header}</th>`).join("")}
          ${measureHeaders.map((header) => `<th>${header}</th>`).join("")}
          <th>Actions</th>
        </tr>
      `;

      table.innerHTML = `
        <thead>${headerRow}</thead>
        <tbody>
          ${tableData.map(
            (row, index) => `
              <tr data-row-id="${index}">
                ${dimensions.map((dim) => `<td>${row[dim]}</td>`).join("")}
                ${measures.map((measureId) => `<td>${row[measureId]}</td>`).join("")}
                <td><button class="action-btn" data-row-id="${index}">${this._buttonLabel}</button></td>
              </tr>
            `
          ).join("")}
        </tbody>
      `;

      this._root.innerHTML = "";
      this._root.appendChild(table);
      this.addEventListenersToButtons();
    }

    addEventListenersToButtons() {
      const buttons = this._root.querySelectorAll(".action-btn");
      buttons.forEach(button => {
        button.addEventListener("click", (event) => this.handleButtonClick(event));
      });
    }

    handleButtonClick(event) {
      const rowId = event.target.getAttribute("data-row-id");
      console.log(`Button clicked for row ID: ${rowId}`);
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
