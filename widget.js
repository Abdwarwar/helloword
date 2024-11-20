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

      // Initialize default properties
      this._props = {};
      console.log("Widget initialized with default properties.");
    }

    connectedCallback() {
      console.log("Widget Connected to DOM");
      this.render();
    }

    set myDataSource(dataBinding) {
      this._myDataSource = dataBinding;
      console.log("Data source set:", this._myDataSource);
      this.render();
    }

    render() {
      console.log("Rendering Widget");

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
              (row, rowIndex) =>
                `<tr>${dimensions
                  .map((dim) => `<td>${row[dim.id]}</td>`)
                  .join("")}${measures
                  .map(
                    (measure) =>
                      `<td contenteditable="true" data-row="${rowIndex}" data-measure="${measure.id}">${row[measure.id]}</td>`
                  )
                  .join("")}</tr>`
            )
            .join("")}
        </tbody>
      `;

      this._root.innerHTML = "";
      this._root.appendChild(table);

      // Add event listeners for editable cells
      this.addEditableListeners(dimensions, measures);
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

    addEditableListeners(dimensions, measures) {
      const cells = this._root.querySelectorAll('td[contenteditable="true"]');
      cells.forEach((cell) => {
        cell.addEventListener("blur", (event) => {
          const rowIndex = event.target.getAttribute("data-row");
          const measureId = event.target.getAttribute("data-measure");
          const newValue = parseFloat(event.target.textContent.trim());

          console.log(
            `Updating measure '${measureId}' for row ${rowIndex} with value: ${newValue}`
          );

          this.pushDataToModel(rowIndex, measureId, newValue, dimensions);
        });
      });
    }

    pushDataToModel(rowIndex, measureId, newValue, dimensions) {
      if (!this._myDataSource || !this._myDataSource.isPlanningEnabled) {
        console.error("Planning is not enabled or data source is not bound.");
        return;
      }

      const dimensionValues = dimensions.map((dim) => ({
        dimension: dim.id,
        value: this._myDataSource.data[rowIndex][dim.key]?.id || null,
      }));

      const planningPayload = {
        measure: measureId,
        value: newValue,
        dimensionValues,
      };

      this._myDataSource
        .updatePlanningData(planningPayload)
        .then(() => {
          console.log("Planning data pushed successfully.");
          this._myDataSource.submitPlanningData().then(() => {
            console.log("Planning data submitted successfully.");
            this.refreshDataSource();
          });
        })
        .catch((error) => {
          console.error("Error pushing planning data:", error);
        });
    }

    refreshDataSource() {
      this._myDataSource
        .refresh()
        .then(() => {
          console.log("Data source refreshed successfully.");
          this.render();
        })
        .catch((error) => {
          console.error("Error refreshing data source:", error);
        });
    }

     // Open Model Dialog
    openSelectModelDialog() {
      if (this._dataBinding) {
        this._dataBinding.openSelectModelDialog();
      } else {
        console.error("Data binding is not set. Cannot open model dialog.");
      }
    }

    // Get Dimensions
    getDimensions() {
      if (!this._dataBinding) {
        console.error("Data binding is not set.");
        return [];
      }

      return this._dataBinding.metadata.feeds.dimensions.values.map((dimKey) => ({
        id: dimKey,
        ...this._dataBinding.metadata.dimensions[dimKey]
      }));
    }

    // Get Measures
    getMeasures() {
      if (!this._dataBinding) {
        console.error("Data binding is not set.");
        return [];
      }

      return this._dataBinding.metadata.feeds.measures.values.map((measureKey) => ({
        id: measureKey,
        ...this._dataBinding.metadata.mainStructureMembers[measureKey]
      }));
    }

    // Add Dimension
    addDimension(dimensionId) {
      console.log(`Adding dimension: ${dimensionId}`);
      // Logic to add dimension if needed
    }

    // Add Measure
    addMeasure(measureId) {
      console.log(`Adding measure: ${measureId}`);
      // Logic to add measure if needed
    }

    // Remove Dimension
    removeDimension(dimensionId) {
      console.log(`Removing dimension: ${dimensionId}`);
      // Logic to remove dimension if needed
    }

    // Remove Measure
    removeMeasure(measureId) {
      console.log(`Removing measure: ${measureId}`);
      // Logic to remove measure if needed
    }

    // Get Dimensions on Feed
    getDimensionsOnFeed() {
      if (!this._dataBinding) {
        console.error("Data binding is not set.");
        return [];
      }

      return this._dataBinding.metadata.feeds.dimensions.values;
    }

    // Get Measures on Feed
    getMeasuresOnFeed() {
      if (!this._dataBinding) {
        console.error("Data binding is not set.");
        return [];
      }

      return this._dataBinding.metadata.feeds.measures.values;
    }

    // Get Data Source
    getDataSource() {
      if (!this._dataBinding) {
        console.error("Data binding is not set.");
        return null;
      }

      return this._dataBinding.getDataSource();
    }

    // Set Model
    setModel(modelId) {
      if (this._dataBinding) {
        this._dataBinding.setModel(modelId);
        console.log(`Model set to: ${modelId}`);
      } else {
        console.error("Data binding is not set. Cannot set model.");
      }
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();











