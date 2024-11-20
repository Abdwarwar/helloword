(function () {
  const prepared = document.createElement("template");
  prepared.innerHTML = `
    <style>
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f4f4f4; }
      tr:nth-child(even) { background-color: #f9f9f9; }
      tr.selected { background-color: #ffeb3b; }
    </style>
    <div id="root" style="width: 100%; height: 100%; overflow: auto;"></div>
  `;

  class CustomTableWidget extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(prepared.content.cloneNode(true));
      this._root = this._shadowRoot.getElementById("root");
    }

    connectedCallback() {
      this.render();
    }

    set myDataSource(dataBinding) {
      this._myDataSource = dataBinding;
      this.render();
    }

    render() {
      if (!this._myDataSource || this._myDataSource.state !== "success") {
        this._root.innerHTML = `<p>Loading data...</p>`;
        return;
      }

      const dimensions = this.resolveDimensionMetadata();
      const measures = this.resolveMeasureMetadata();

      if (dimensions.length === 0 || measures.length === 0) {
        this._root.innerHTML = `<p>Please configure dimensions and measures.</p>`;
        return;
      }

      const table = this.createTable(dimensions, measures);
      this._root.innerHTML = "";
      this._root.appendChild(table);
      this.addRowSelectionListener();
    }

    resolveDimensionMetadata() {
      const dimensionKeys = this._myDataSource.metadata.feeds.dimensions.values;
      return dimensionKeys.map((key) => ({
        id: key,
        key,
        description: this._myDataSource.metadata.dimensions[key]?.description || key,
      }));
    }

    resolveMeasureMetadata() {
      const measureKeys = this._myDataSource.metadata.feeds.measures.values;
      return measureKeys.map((key) => ({
        id: key,
        key,
        description: this._myDataSource.metadata.mainStructureMembers[key]?.description || key,
      }));
    }

    createTable(dimensions, measures) {
      const table = document.createElement("table");
      const headers = `
        <thead>
          <tr>
            ${dimensions.map((dim) => `<th>${dim.description}</th>`).join("")}
            ${measures.map((measure) => `<th>${measure.description}</th>`).join("")}
          </tr>
        </thead>
      `;
      const body = `
        <tbody>
          ${this._myDataSource.data
            .map(
              (row) =>
                `<tr>${dimensions
                  .map((dim) => `<td>${row[dim.key]?.label || "N/A"}</td>`)
                  .join("")}${measures
                  .map((measure) => `<td>${row[measure.key]?.raw || "0"}</td>`)
                  .join("")}</tr>`
            )
            .join("")}
        </tbody>
      `;
      table.innerHTML = headers + body;
      return table;
    }

    addRowSelectionListener() {
      const rows = this._root.querySelectorAll("tbody tr");
      rows.forEach((row, rowIndex) => {
        row.addEventListener("click", () => {
          console.log("Row selected:", rowIndex);
          const selectedRowData = this._myDataSource.data[rowIndex];
          console.log("Selected Row Data:", selectedRowData);

          const dimensions = this.resolveDimensionMetadata();
          const selectedDimensions = dimensions.map((dim) => ({
            id: dim.id,
            value: selectedRowData[dim.key]?.label || null,
          }));
          console.log("Selected Dimensions:", selectedDimensions);
        });
      });
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
