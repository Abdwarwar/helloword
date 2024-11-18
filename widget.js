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

      const dimensionHeaders = dimensions.map(
        (dim) => this._myDataSource.metadata.dimensions[dim]?.description || dim
      );
      const measureHeaders = measures.map(
        (measure) => this._myDataSource.metadata.mainStructureMembers[measure]?.id || measure
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
                  .map((measure) => `<td contenteditable="true" data-measure="${measure}">${row[measure]}</td>`)
                  .join("")}</tr>`
            )
            .join("")}
        </tbody>
      `;

      this._root.innerHTML = "";
      this._root.appendChild(table);

      this._root.querySelectorAll("td[contenteditable]").forEach((cell) => {
        cell.addEventListener("input", this.handleCellEdit.bind(this));
      });
    }

    async handleCellEdit(event) {
      const cell = event.target;
      const measure = cell.getAttribute("data-measure");
      const newValue = cell.innerText;

      const rowIndex = Array.from(cell.parentNode.parentNode.children).indexOf(cell.parentNode);
      const measureIndex = this._myDataSource.metadata.feeds.measures.values.indexOf(measure);

      if (measureIndex === -1) return;

      const row = this._myDataSource.data[rowIndex];
      row[measure] = newValue;

      console.log(`Updated ${measure} in row ${rowIndex} to ${newValue}`);

      try {
        await this.updatePlanningModel(rowIndex, measure, newValue);
      } catch (error) {
        console.error("Failed to update model:", error);
      }
    }

    async updatePlanningModel(rowIndex, measure, value) {
      const dataSourceId = this._myDataSource.id;
      const dimensionKeys = Object.keys(this._myDataSource.metadata.dimensions);
      const dimensionValues = this._myDataSource.metadata.feeds.dimensions.values;

      const payload = {
        cellData: [
          {
            dimensionKey: dimensionValues[0],
            measureKey: measure,
            value: value,
            rowKey: rowIndex,
          },
        ],
      };

      try {
        const action = await this.triggerPlanningWriteBack(payload);
        console.log("Planning model updated successfully", action);
      } catch (error) {
        console.error("Error while updating planning model:", error);
      }
    }

    async triggerPlanningWriteBack(payload) {
      // Use the correct SAP API for planning write-back.
      try {
        const response = await this._myDataSource.writeBack({
          dataActionName: "UpdateDataAction", // Ensure this matches the name of your action
          inputData: payload,
        });
        console.log("Write-back response:", response);
        return response;
      } catch (error) {
        throw new Error("Failed to trigger write-back API:", error);
      }
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
