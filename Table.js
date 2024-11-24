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

      console.log("Resolved Dimensions:", dimensions);
      console.log("Resolved Measures:", measures);

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

    // Expose getSelections API
    getSelections() {
      try {
        if (!this._myDataSource || !this._myDataSource.data) {
          console.error("Data source is not bound or data is unavailable.");
          return [];
        }

        // Retrieve dimensions metadata
        const dimensions = this.getDimensions();

        // Retrieve selected rows' data
        const selectedData = Array.from(this._selectedRows).map((rowIndex) => {
          const row = this._myDataSource.data[rowIndex];
          if (!row) return null;

          const rowData = {};

          // Add dimension data
          dimensions.forEach((dim) => {
            rowData[dim.id] = {
              id: row[dim.key]?.id || null,
              label: row[dim.key]?.label || "N/A",
            };
          });

          // Add measure data
          Object.keys(row).forEach((key) => {
            if (!dimensions.some((dim) => dim.key === key)) {
              rowData[key] = row[key]?.raw || row[key]?.value || null;
            }
          });

          return rowData;
        });

        console.log("Selected data:", selectedData);
        return selectedData;
      } catch (error) {
        console.error("Error in getSelections:", error);
        return [];
      }
    }

getDimensions() {
  if (!this._myDataSource || !this._myDataSource.metadata) {
    console.error("Data source metadata is unavailable.");
    return [];
  }

  const dimensionsKeys = this._myDataSource.metadata.feeds.dimensions.values;

  const dimensions = dimensionsKeys.map((key) => {
    const dimension = this._myDataSource.metadata.dimensions[key];
    if (!dimension) {
      console.warn(`Dimension with key '${key}' not found in metadata.`);
      return { id: key, key, description: key }; // Fallback
    }

    return {
      id: dimension.id || key, // Use actual dimension ID
      key,
      description: dimension.description || dimension.id || key, // Use actual description
    };
  });

  console.log("Resolved Dimensions:", dimensions);
  return dimensions;
}

getMeasures() {
  if (!this._myDataSource || !this._myDataSource.metadata) {
    console.error("Data source metadata is unavailable.");
    return [];
  }

  const measuresKeys = this._myDataSource.metadata.feeds.measures.values;

  const measures = measuresKeys.map((key) => {
    const measure = this._myDataSource.metadata.mainStructureMembers[key];
    if (!measure) {
      console.warn(`Measure with key '${key}' not found in metadata.`);
      return { id: key, key, description: key }; // Fallback
    }

    return {
      id: measure.id || key, // Use actual measure ID
      key,
      description: measure.description || measure.id || key, // Use actual description
    };
  });

  console.log("Resolved Measures:", measures);
  return measures;
}

  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
