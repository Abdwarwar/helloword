(function () {
  const prepared = document.createElement("template");
  prepared.innerHTML = `
    <style>
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f4f4f4; }
      tr:nth-child(even) { background-color: #f9f9f9; }
      tr.selected { background-color: #ffeb3b; }
      .button-cell button { padding: 5px 10px; cursor: pointer; }
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

    set buttonLabel(label) {
      this._buttonLabel = label;
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

      const buttonLabel = this._buttonLabel || "Click Me"; // Use the property or default value

      const table = document.createElement("table");
      const headerRow = `
        <tr>${dimensionHeaders.map((header) => `<th>${header}</th>`).join("")}
        ${measureHeaders.map((header) => `<th>${header}</th>`).join("")}
        <th>Action</th></tr>
      `;

      table.innerHTML = `
        <thead>${headerRow}</thead>
        <tbody>
          ${tableData.map(
            (row) => `
              <tr data-row-id="${row['ID']}">${dimensions
                .map((dim) => `<td>${row[dim]}</td>`)
                .join("")}
                ${measures
                  .map(
                    (measureId) =>
                      `<td contenteditable="true" data-measure="${measureId}" data-row-id="${row['ID']}">${row[measureId]}</td>`
                  )
                  .join("")}
                <td class="button-cell"><button>${buttonLabel}</button></td>
              </tr>`
          ).join("")}
        </tbody>
      `;

      this._root.innerHTML = "";
      this._root.appendChild(table);
      this.addEventListenersToRows();
      this.addButtonListeners();
    }

    addEventListenersToRows() {
      const rows = this._root.querySelectorAll("tr[data-row-id]");
      rows.forEach(row => {
        row.addEventListener("click", (event) => this.handleRowSelection(event, row));
      });
    }

    handleRowSelection(event, row) {
      const previouslySelected = this._root.querySelector(".selected");
      if (previouslySelected) {
        previouslySelected.classList.remove("selected");
      }

      row.classList.add("selected");

      const rowId = row.getAttribute('data-row-id');
      if (!rowId) {
        console.error("Row ID not found.");
        return;
      }

      const rowData = this._myDataSource.data.find(row => row['ID'] === rowId);
      if (!rowData) {
        console.error("Row data not found for ID:", rowId);
        return;
      }

      const dimensions = this._myDataSource.metadata.feeds.dimensions.values;
      const measures = this._myDataSource.metadata.feeds.measures.values;

      const selectedDimensions = dimensions.map((dim) => rowData[dim]?.label || "N/A");
      const selectedMeasure = measures.map((measureId) => rowData[measureId]?.raw || "N/A");

      console.log("Selected Row ID:", rowId);
      console.log("Selected Dimensions:", selectedDimensions);
      console.log("Selected Measure:", selectedMeasure);
    }

    addButtonListeners() {
      const buttons = this._root.querySelectorAll("button");
      buttons.forEach(button => {
        button.addEventListener("click", (event) => this.handleButtonClick(event));
      });
    }

    handleButtonClick(event) {
      const button = event.target;
      const row = button.closest("tr");
      const rowId = row ? row.getAttribute("data-row-id") : null;
      
      if (rowId) {
        const rowData = this._myDataSource.data.find(row => row['ID'] === rowId);
        
        if (!rowData) {
          console.error("Row data not found for ID:", rowId);
          return;
        }

        const dimensions = this._myDataSource.metadata.feeds.dimensions.values;
        const measures = this._myDataSource.metadata.feeds.measures.values;

        const selectedDimensions = dimensions.map((dim) => rowData[dim]?.label || "N/A");
        const selectedMeasures = measures.map((measureId) => rowData[measureId]?.raw || "N/A");

        console.log("Button clicked for Row ID:", rowId);
        console.log("Selected Dimensions:", selectedDimensions);
        console.log("Selected Measures:", selectedMeasures);
      }
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();

