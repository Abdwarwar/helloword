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
      this._selectedRows = new Set(); // Track selected rows
      this._myDataSource = null;
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

      const dimensions = this.getDimensions();
      const measures = this.getMeasures();

      if (dimensions.length === 0 || measures.length === 0) {
        this._root.innerHTML = `<p>Please add Dimensions and Measures in the Builder Panel.</p>`;
        return;
      }

      const tableData = this._myDataSource.data.map((row, index) => ({
        index,
        ...dimensions.reduce((acc, dim) => {
          acc[dim.id] = row[dim.key]?.label || "N/A";
          return acc;
        }, {}),
        ...measures.reduce((acc, measure) => {
          acc[measure.id] = row[measure.key]?.raw || "N/A";
          return acc;
        }, {}),
      }));

      const table = document.createElement("table");
      table.innerHTML = `
        <thead>
          <tr>
            ${dimensions.map((dim) => `<th>${dim.description || dim.id}</th>`).join("")}
            ${measures.map((measure) => `<th>${measure.description || measure.id}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${tableData
            .map(
              (row) =>
                `<tr data-row-index="${row.index}">
                  ${dimensions.map((dim) => `<td>${row[dim.id]}</td>`).join("")}
                  ${measures.map((measure) => `<td>${row[measure.id]}</td>`).join("")}
                </tr>`
            )
            .join("")}
        </tbody>
      `;

      this._root.innerHTML = "";
      this._root.appendChild(table);

      // Attach click event listeners for row selection
      this.attachRowSelectionListeners();
    }

    attachRowSelectionListeners() {
      const rows = this._root.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        row.addEventListener("click", (event) => {
          const rowIndex = event.currentTarget.getAttribute("data-row-index");
          if (this._selectedRows.has(rowIndex)) {
            this._selectedRows.delete(rowIndex);
            event.currentTarget.classList.remove("selected");
          } else {
            this._selectedRows.add(rowIndex);
            event.currentTarget.classList.add("selected");
          }
          console.log(`Selected rows:`, Array.from(this._selectedRows));

          // Fire the onSelect event
          this.fireOnSelectEvent();
        });
      });
    }

    fireOnSelectEvent() {
      const event = new CustomEvent("onSelect", {
        detail: {
          selectedRows: Array.from(this._selectedRows),
        },
      });
      this.dispatchEvent(event);
    }

    // Expose getDataSelections API
    getDataSelections() {
      if (!this._myDataSource) {
        console.error("Data source is not bound.");
        return [];
      }

      const dimensions = this.getDimensions();
      const selectedData = Array.from(this._selectedRows).map((rowIndex) => {
        const row = this._myDataSource.data[rowIndex];
        const dataSelection = {};
        dimensions.forEach((dim) => {
          dataSelection[dim.id] = row[dim.key]?.id || null;
        });
        return dataSelection;
      });

      console.log("Data selections:", selectedData);
      return selectedData;
    }

    getDimensions() {
      if (!this._myDataSource || !this._myDataSource.metadata) {
        return [];
      }
      return this._myDataSource.metadata.feeds.dimensions.values.map((key) => ({
        id: key,
        key,
        description: this._myDataSource.metadata.dimensions[key]?.description || key,
      }));
    }

    getMeasures() {
      if (!this._myDataSource || !this._myDataSource.metadata) {
        return [];
      }
      return this._myDataSource.metadata.feeds.measures.values.map((key) => ({
        id: key,
        key,
        description: this._myDataSource.metadata.mainStructureMembers[key]?.description || key,
      }));
    }
      getSelections() {
    return this.selectedRows.map((index) => this._myDataSource.data[index]);
  }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
