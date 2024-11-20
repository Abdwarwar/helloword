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
      this._dataBinding = null; // Initialize the data binding
    }

    set myDataSource(dataBinding) {
      this._dataBinding = dataBinding;
      this.render();
    }

    render() {
      if (!this._dataBinding || this._dataBinding.state !== "success") {
        this._root.innerHTML = `<p>Loading data or data binding not ready...</p>`;
        return;
      }

      // Check if planning is enabled
      if (!this._dataBinding.isPlanningEnabled) {
        this._root.innerHTML = `<p>Planning is not enabled for this data source.</p>`;
        return;
      }

      const dimensions = this.getDimensions();
      const measures = this.getMeasures();

      const table = document.createElement("table");
      table.innerHTML = `
        <thead>
          <tr>
            ${dimensions.map((dim) => `<th>${dim.id}</th>`).join("")}
            ${measures.map((measure) => `<th>${measure.id}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${this._dataBinding.data.map((row, rowIndex) => `
            <tr>
              ${dimensions.map((dim) => `<td>${row[dim.id]?.label || ""}</td>`).join("")}
              ${measures.map((measure) => `
                <td contenteditable="true" data-row="${rowIndex}" data-measure="${measure.id}">
                  ${row[measure.id]?.raw || ""}
                </td>`).join("")}
            </tr>
          `).join("")}
        </tbody>
      `;
      this._root.innerHTML = "";
      this._root.appendChild(table);

      this.addPlanningListeners(dimensions, measures);
    }

    getDimensions() {
      return this._dataBinding.metadata.feeds.dimensions.values.map((dimKey) => ({
        id: dimKey,
        ...this._dataBinding.metadata.dimensions[dimKey]
      }));
    }

    getMeasures() {
      return this._dataBinding.metadata.feeds.measures.values.map((measureKey) => ({
        id: measureKey,
        ...this._dataBinding.metadata.mainStructureMembers[measureKey]
      }));
    }

    addPlanningListeners(dimensions, measures) {
      const cells = this._root.querySelectorAll('td[contenteditable="true"]');
      cells.forEach((cell) => {
        cell.addEventListener("blur", (event) => {
          const rowIndex = event.target.getAttribute("data-row");
          const measureId = event.target.getAttribute("data-measure");
          const newValue = parseFloat(event.target.textContent.trim());

          if (!isNaN(newValue)) {
            this.pushPlanningData(rowIndex, measureId, newValue, dimensions);
          }
        });
      });
    }

    pushPlanningData(rowIndex, measureId, newValue, dimensions) {
      if (!this._dataBinding) {
        console.error("Data binding is not set.");
        return;
      }

      const dimensionValues = dimensions.map((dim) => ({
        dimension: dim.id,
        value: this._dataBinding.data[rowIndex][dim.id]?.id || null,
      }));

      const payload = {
        measure: measureId,
        value: newValue,
        dimensionValues,
      };

      this._dataBinding
        .updatePlanningData(payload)
        .then(() => {
          console.log("Planning data updated successfully.");
          return this._dataBinding.submitPlanningData();
        })
        .then(() => {
          console.log("Planning data submitted successfully.");
          this.refreshData();
        })
        .catch((error) => {
          console.error("Error during planning:", error);
        });
    }

    refreshData() {
      this._dataBinding.refresh().then(() => {
        console.log("Data refreshed successfully.");
        this.render();
      });
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
