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

      const dimensions = this._myDataSource.metadata.feeds.dimensions.values;
      const measures = this._myDataSource.metadata.feeds.measures.values;

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

      const table = document.createElement("table");
      const headerRow = `
        <tr>${dimensionHeaders.map((header) => `<th>${header}</th>`).join("")}
        ${measureHeaders.map((header) => `<th>${header}</th>`).join("")}</tr>
      `;

      table.innerHTML = `
        <thead>${headerRow}</thead>
        <tbody>
          ${tableData.map(
            (row) => `
              <tr>${dimensions
                .map((dim) => `<td>${row[dim]}</td>`)
                .join("")}
                ${measures
                  .map(
                    (measureId) =>
                      `<td contenteditable="true" data-measure="${measureId}" data-row-id="${row['ID']}">${row[measureId]}</td>`
                  )
                  .join("")}
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
      editableCells.forEach(cell => {
        cell.addEventListener("blur", (event) => this.handleCellEdit(event));
      });
    }

    async handleCellEdit(event) {
      const editedValue = event.target.innerText;
      const rowId = event.target.getAttribute('data-row-id');
      const measure = event.target.getAttribute('data-measure');
      console.log("Selected Row ID:", rowId);
      console.log("Updated Measure:", measure);
      console.log("Edited Value:", editedValue);
      
      // Find the row data from the source
      const rowData = this._myDataSource.data.find(row => row['ID'] === rowId);
      console.log("Row Data:", rowData);

      // Check the row data
      if (rowData) {
        const writeBackPayload = {
          rowId: rowId,
          measure: measure,
          value: parseFloat(editedValue),
        };

        try {
          // Log the write-back payload to check the structure
          console.log("Write-back payload:", writeBackPayload);
          await this.writeBackToModel(writeBackPayload);
        } catch (error) {
          console.error("Write-back failed:", error);
          alert("Failed to update the model.");
        }
      }
    }

    async writeBackToModel(writeBackPayload) {
      try {
        // Attempt to call the SAC API (update based on actual API)
        const response = await this._myDataSource.writeBack({
          data: writeBackPayload,
        });
        console.log("Write-back successful:", response);
      } catch (error) {
        console.error("Write-back failed:", error);
        alert("Failed to update the model.");
      }
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
