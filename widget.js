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

      // Check if the data source is bound
      if (!this._myDataSource) {
        this._root.innerHTML = `<p>Widget is initializing...</p>`;
        return;
      }

      // Check the state of the data source
      if (this._myDataSource.state !== "success") {
        console.log("Data source not ready. Rendering loading state.");
        this._root.innerHTML = `<p>Loading data...</p>`;
        return;
      }

      console.log("Data source ready. Rendering table.");

      // Resolve dimensions and measures
      const dimensions = this.resolveDimensionMetadata();
      const measures = this.resolveMeasureMetadata();

      if (dimensions.length === 0 || measures.length === 0) {
        this._root.innerHTML = `<p>Please add Dimensions and Measures in the Builder Panel.</p>`;
        return;
      }

      console.log("Resolved Dimensions:", dimensions);
      console.log("Resolved Measures:", measures);

      const dimensionHeaders = dimensions.map((dim) => dim.description || dim.id);
      const measureHeaders = measures.map((measure) => measure.description || measure.id);

      const tableData = this._myDataSource.data.map((row) => {
        const rowData = {};
        dimensions.forEach((dim) => {
          rowData[dim.id] = row[dim.key]?.label || "N/A"; // Use resolved key for dimensions
        });
        measures.forEach((measure) => {
          rowData[measure.id] = row[measure.key]?.raw || "N/A"; // Use resolved key for measures
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

      console.log("Full Data Source Object:", this._myDataSource);
      console.log("Metadata:", this._myDataSource?.metadata);
      console.log("State:", this._myDataSource?.state);      
      
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
          return { id: key, key }; // Fallback
        }
        return {
          id: resolvedDimension.id,
          key,
          description: resolvedDimension.description || resolvedDimension.id,
        };
      });

      console.log("Resolved Dimensions Metadata:", dimensions);
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
          return { id: key, key, description: key }; // Fallback
        }
        return {
          id: resolvedMeasure.id,
          key,
          description: resolvedMeasure.description || resolvedMeasure.id,
        };
      });

      console.log("Resolved Measures Metadata:", measures);
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

          // Push updated value to SAC model
          this.pushDataToModel(rowIndex, measureId, newValue, dimensions);
        });
      });
    }



pushDataToModel(rowIndex, measureId, newValue, dimensions) {
  if (!this._myDataSource) {
    console.error("Data source is not bound. Cannot push data.");
    return;
  }

  // Log the entire data source object for debugging
  console.log("Data Source Debugging:", this._myDataSource);

  if (typeof this._myDataSource.pushPlanningData !== "function") {
    console.error("The 'pushPlanningData' method is not available on the data source.");
    return;
  }

  // Extract dimension members from the selected row
  const dimensionValues = dimensions.map((dim) => {
    const dimensionMember = this._myDataSource.data[rowIndex][dim.key];
    return {
      dimension: dim.id,
      value: dimensionMember?.id || null, // Use the ID of the selected member
    };
  });

  console.log("Resolved Dimension Values:", dimensionValues);

  // Validate dimension values
  const invalidDimensions = dimensionValues.filter((dim) => !dim.value);
  if (invalidDimensions.length > 0) {
    console.error("Invalid dimensions found:", invalidDimensions);
    return;
  }

  const updatedData = {
    measure: measureId,
    value: newValue,
    dimensionValues,
  };

  console.log("Attempting to Push Planning Data:", updatedData);

  // Push planning data to SAC model
  this._myDataSource
    .pushPlanningData([updatedData])
    .then(() => {
      console.log(`Successfully pushed planning data for row ${rowIndex}`);
      this.refreshDataSource();
    })
    .catch((error) => {
      console.error("Error pushing planning data to SAC model:", error);
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
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
