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
      this._planningEnabled = false; // Flag to check if planning is enabled
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

      console.log("Data Source Metadata:", this._myDataSource.metadata);
      console.log("Data Source Data:", this._myDataSource.data);

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
          this._myDataSource.metadata.mainStructureMembers[measure]?.description ||
          measure
      );

      console.log("Dimension Headers:", dimensionHeaders);
      console.log("Measure Headers:", measureHeaders);

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

      console.log("Mapped Table Data:", tableData);

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
              (row) =>
                `<tr>${dimensions
                  .map((dim) => `<td>${row[dim]}</td>`)
                  .join("")}${measures
                  .map((measure) => `<td contenteditable="true" class="editable" data-measure="${measure}">${row[measure]}</td>`)
                  .join("")}</tr>`
            )
            .join("")}
        </tbody>
      `;

      this._root.innerHTML = "";
      this._root.appendChild(table);

      this._root.querySelectorAll(".editable").forEach((cell) => {
        cell.addEventListener("blur", (event) => {
          this.handleCellUpdate(event);
        });
      });
    }

    handleCellUpdate(event) {
      const measure = event.target.getAttribute("data-measure");
      const newValue = parseFloat(event.target.innerText);
      const rowIndex = event.target.parentElement.rowIndex - 1; // Excluding the header row

      const updatedData = this._myDataSource.data[rowIndex];
      updatedData[measure] = newValue;

      // Call the internal planning API or custom write-back logic to update the model
      this.updateModelCell(updatedData, measure, newValue);
    }

    // API Call to update model (Approach 1 - Using SAC internal API)
    async updateModelCell(updatedData, measure, newValue) {
      try {
        if (this._planningEnabled) {
          const cell = updatedData[measure];
          // Assuming this would trigger SAC's internal write-back API
          // Here we mimic the internal SAC planning behavior
          this._myDataSource.setCellValue({
            row: updatedData,
            column: measure,
            value: newValue
          });

          console.log(`Cell updated with new value: ${newValue}`);
        } else {
          console.log("Planning is not enabled for this measure.");
        }
      } catch (error) {
        console.error("Failed to update the value:", error);
      }
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
