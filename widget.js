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

      // Ensure data source is available
      if (this._myDataSource.state !== "success") {
        this._root.innerHTML = `<p>Loading data...</p>`;
        return;
      }

      const dimensions = this._myDataSource.metadata.feeds.dimensions.values;
      const measures = this._myDataSource.metadata.feeds.measures.values;

      // Ensure there are dimensions and measures to display
      if (dimensions.length === 0 || measures.length === 0) {
        this._root.innerHTML = `<p>Ensure dimensions and measures are configured in the model.</p>`;
        return;
      }

      const dimensionHeaders = dimensions.map(
        (dim) => this._myDataSource.metadata.dimensions[dim]?.description || dim
      );

      // Correctly map measures to their label from the metadata (Reverting to the working version)
      const measureHeaders = measures.map((measure) => {
        const measureMetadata = this._myDataSource.metadata.mainStructureMembers[measure];
        return measureMetadata ? measureMetadata.label : measure; // Use label instead of default measure name
      });

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

      // Create table
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

      // Add event listeners for cell updates
      this._root.querySelectorAll(".editable").forEach((cell) => {
        cell.addEventListener("blur", (event) => {
          this.handleCellUpdate(event);
        });
      });
    }

    handleCellUpdate(event) {
      const measure = event.target.getAttribute("data-measure");
      const newValue = parseFloat(event.target.innerText);
      const rowIndex = event.target.parentElement.rowIndex - 1; // Excluding header row

      const updatedData = this._myDataSource.data[rowIndex];
      updatedData[measure] = newValue;

      // Call SAC Planning API to update the model
      this.updateModelCell(updatedData, measure, newValue);
    }

    // Implement SAC Planning API for write-back
    async updateModelCell(updatedData, measure, newValue) {
      try {
        if (this._myDataSource.planningModel) {
          const planningModel = this._myDataSource.planningModel;

          // Write-back the new value for the measure to the SAC model
          const updateResult = await planningModel.setCellValue({
            rowIndex: updatedData,
            columnName: measure,
            value: newValue,
          });

          if (updateResult.success) {
            console.log(`Successfully updated measure '${measure}' with value ${newValue}`);
          } else {
            console.error(`Failed to update measure '${measure}'.`);
          }
        } else {
          console.log("Planning model is not available.");
        }
      } catch (error) {
        console.error("Error updating model cell:", error);
      }
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
