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
    }

    connectedCallback() {
      this.render();
    }

    set myDataSource(dataBinding) {
      this._myDataSource = dataBinding;
      this.render();
    }

    render() {
      if (!this._myDataSource) {
        this._root.innerHTML = `<p>Widget is initializing...</p>`;
        return;
      }

      if (this._myDataSource.state !== "success") {
        this._root.innerHTML = `<p>Loading data...</p>`;
        return;
      }

      // Resolve dimensions and measures
      const dimensions = this.resolveDimensionMetadata();
      const measures = this.resolveMeasureMetadata();

      if (dimensions.length === 0 || measures.length === 0) {
        this._root.innerHTML = `<p>Please add Dimensions and Measures in the Builder Panel.</p>`;
        return;
      }

      const dimensionHeaders = dimensions.map((dim) => dim.description || dim.id);
      const measureHeaders = measures.map((measure) => measure.description || measure.id);

      const tableData = this._myDataSource.data.map((row) => {
        const rowData = {};
        dimensions.forEach((dim) => {
          rowData[dim.id] = row[dim.key]?.label || "N/A";
        });
        measures.forEach((measure) => {
          rowData[measure.id] = row[measure.key]?.raw || "N/A";
        });
        return rowData;
      });

      if (tableData.length === 0) {
        this._root.innerHTML = `<p>No data available to display.</p>`;
        return;
      }

      const table = document.createElement("table");

      const headerRow = `
        <tr>${dimensionHeaders.map((dim) => `<th>${dim}</th>`).join("")}
        ${measureHeaders.map((measure) => `<th>${measure}</th>`).join("")}</tr>
      `;

      table.innerHTML = `
        <thead>${headerRow}</thead>
        <tbody>
          ${tableData
            .map(
              (row) =>
                `<tr>${dimensions
                  .map((dim) => `<td>${row[dim.id]}</td>`)
                  .join("")}${measures
                  .map((measure) => `<td>${row[measure.id]}</td>`)
                  .join("")}</tr>`
            )
            .join("")}
        </tbody>
      `;

      this._root.innerHTML = "";
      this._root.appendChild(table);
    }

    resolveDimensionMetadata() {
      if (!this._myDataSource || !this._myDataSource.metadata) {
        console.error("Metadata is not available.");
        return [];
      }

      const dimensionKeys = this._myDataSource.metadata.feeds.dimensions.values;
      const dimensions = dimensionKeys.map((key) => {
        const resolvedDimension = this._myDataSource.metadata.dimensions[key];
        if (!resolvedDimension) {
          console.warn(`Dimension key '${key}' could not be resolved.`);
          return { id: key, key };
        }
        return {
          id: resolvedDimension.id,
          key,
          description: resolvedDimension.description || resolvedDimension.id,
        };
      });

      return dimensions;
    }

    resolveMeasureMetadata() {
      if (!this._myDataSource || !this._myDataSource.metadata) {
        console.error("Metadata is not available.");
        return [];
      }

      const measureKeys = this._myDataSource.metadata.feeds.measures.values;
      const measures = measureKeys.map((key) => {
        const resolvedMeasure = this._myDataSource.metadata.mainStructureMembers[key];
        if (!resolvedMeasure) {
          console.warn(`Measure key '${key}' could not be resolved.`);
          return { id: key, key, description: key };
        }
        return {
          id: resolvedMeasure.id,
          key,
          description: resolvedMeasure.description || resolvedMeasure.id,
        };
      });

      return measures;
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
