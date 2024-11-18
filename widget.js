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

      // Logging for debugging purposes
      console.log("Dimensions:", dimensions);
      console.log("Measures:", measures);

      // Log the structure of mainStructureMembers for clarity
      console.log("mainStructureMembers:", this._myDataSource.metadata.mainStructureMembers);

      // Ensure measure headers are obtained from mainStructureMembers and use their actual names
      const dimensionHeaders = dimensions.map(
        (dim) => this._myDataSource.metadata.dimensions[dim]?.description || dim
      );

      // Map the measure headers to the correct names using the mainStructureMembers metadata
      const measureHeaders = measures.map((measureId) => {
        const measureMeta = this._myDataSource.metadata.mainStructureMembers[measureId];
        console.log("Measure Metadata:", measureMeta); // Debugging output for measure details
        return measureMeta && measureMeta.id // Use 'id' to get the proper measure name
          ? measureMeta.id // Use id (e.g., 'Commitment', 'Cash')
          : measureId; // Fallback to the ID if id is missing
      });

      console.log("Dimension Headers:", dimensionHeaders);
      console.log("Measure Headers:", measureHeaders);

      // Map data to table rows
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

      console.log("Mapped Table Data:", tableData);

      if (tableData.length === 0) {
        this._root.innerHTML = `<p>No data available to display.</p>`;
        return;
      }

      // Create table
      const table = document.createElement("table");

      // Create header row with correct measure names
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
                  .map(
                    (measureId) =>
                      `<td contenteditable="true" data-measure="${measureId}" data-row-id="${row['ID']}">${row[measureId]}</td>`
                  )
                  .join("")}</tr>`
            )
            .join("")}
        </tbody>
      `;

      // Clear existing content and append the new table
      this._root.innerHTML = "";
      this._root.appendChild(table);

      // Make the table cells editable
      this.addEventListenersToEditableCells();
    }

    addEventListenersToEditableCells() {
      const editableCells = this._root.querySelectorAll("td[contenteditable='true']");
      editableCells.forEach(cell => {
        cell.addEventListener("blur", (event) => this.handleCellEdit(event));
      });
    }

    handleCellEdit(event) {
      const editedValue = event.target.innerText;
      const rowId = event.target.getAttribute('data-row-id');
      const measure = event.target.getAttribute('data-measure');

      console.log("Updated value for row:", rowId, "Measure:", measure, "New Value:", editedValue);

      // Update the model with the new value
      this.writeBackToModel(rowId, measure, editedValue);
    }

    writeBackToModel(rowId, measure, value) {
      // Find the row in your data source and update it
      const dataRow = this._myDataSource.data.find(row => row['ID'] === rowId);
      if (dataRow) {
        // Update the value in the row for the corresponding measure
        dataRow[measure] = value;
        console.log("Write-back successful: ", dataRow);

        // Call the SAC planning API to update the data.
        // Make sure to replace this with your actual API for planning write-back.
        try {
          this._myDataSource.writeBack({
            rowId: rowId,
            measure: measure,
            value: value
          }).then(() => {
            console.log("Write-back to SAC model successful.");
          }).catch((error) => {
            console.error("Write-back failed:", error);
          });
        } catch (error) {
          console.error("Write-back failed: ", error);
        }
      }
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
