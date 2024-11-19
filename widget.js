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

      // Initialize properties with default values
      this._props = {
        enableDataAnalyzer: false,
        disableInteraction: false,
        allowComments: false,
        planningEnabled: false,
        dataRefreshMode: "AlwaysRefresh"
      };
      console.log("Default Properties:", this._props);
    }

    connectedCallback() {
      console.log("Widget Connected to DOM");
      this.render();
    }

    set enableDataAnalyzer(value) {
      this._props.enableDataAnalyzer = value;
      this.render();
    }

    set disableInteraction(value) {
      this._props.disableInteraction = value;
      this.render();
    }

    set allowComments(value) {
      this._props.allowComments = value;
      this.render();
    }

    set planningEnabled(value) {
      this._props.planningEnabled = value;
      this.render();
    }

    set dataRefreshMode(value) {
      this._props.dataRefreshMode = value;
      this.render();
    }

    set myDataSource(dataBinding) {
      this._myDataSource = dataBinding;
      this.render();
    }

    render() {
      console.log("Rendering Widget with Properties:", this._props);

      // Check if the data source is bound
      if (!this._myDataSource) {
        this._root.innerHTML = `<p>Widget is initializing...</p>`;
        return;
      }

      // Check the state of the data source
      if (this._myDataSource.state !== "success") {
        this._root.innerHTML = `<p>Loading data...</p>`;
        return;
      }

      console.log("Data source ready. Rendering table.");

      const dimensions = this._myDataSource.metadata.feeds.dimensions.values;
      const measures = this._myDataSource.metadata.feeds.measures.values;

      if (dimensions.length === 0 || measures.length === 0) {
        this._root.innerHTML = `<p>Please add Dimensions and Measures in the Builder Panel.</p>`;
        return;
      }

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

      if (tableData.length === 0) {
        this._root.innerHTML = `<p>No data available to display.</p>`;
        return;
      }

      const interactionStyle = this._props.disableInteraction ? "pointer-events: none; opacity: 0.6;" : "";

      const table = document.createElement("table");
      table.style = interactionStyle;

      const headerRow = `
        <tr>${dimensions.map((dim) => `<th>${dim}</th>`).join("")}
        ${measures.map((measure) => `<th>${measure}</th>`).join("")}</tr>
      `;

      table.innerHTML = `
        <thead>${headerRow}</thead>
        <tbody>
          ${tableData
            .map(
              (row) =>
                `<tr>${dimensions
                  .map((dim) => `<td>${row[dim]}</td>`)
                  .join("")}${measures
                  .map((measure) => `<td contenteditable="${this._props.planningEnabled}">${row[measure]}</td>`)
                  .join("")}</tr>`
            )
            .join("")}
        </tbody>
      `;

      this._root.innerHTML = "";
      this._root.appendChild(table);
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);

  const builderTemplate = document.createElement("template");
  builderTemplate.innerHTML = `
    <style>
      .builder-panel { font-family: Arial, sans-serif; }
      .property { margin-bottom: 10px; }
      label { display: block; margin-bottom: 5px; font-weight: bold; }
    </style>
    <div class="builder-panel">
      <div class="property">
        <label for="enableDataAnalyzer">Enable Data Analyzer:</label>
        <input type="checkbox" id="enableDataAnalyzer" />
      </div>
      <div class="property">
        <label for="disableInteraction">Disable Interaction:</label>
        <input type="checkbox" id="disableInteraction" />
      </div>
      <div class="property">
        <label for="allowComments">Allow Comments:</label>
        <input type="checkbox" id="allowComments" />
      </div>
      <div class="property">
        <label for="planningEnabled">Planning Enabled:</label>
        <input type="checkbox" id="planningEnabled" />
      </div>
      <div class="property">
        <label for="dataRefreshMode">Data Refresh Mode:</label>
        <select id="dataRefreshMode">
          <option value="AlwaysRefresh">Always Refresh</option>
          <option value="RefreshActiveWidgetsOnly">Refresh Active Widgets Only</option>
          <option value="AlwaysPause">Always Pause</option>
        </select>
      </div>
    </div>
  `;

  class TableWidgetBuilder extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(builderTemplate.content.cloneNode(true));
    }

    connectedCallback() {
      // Attach event listeners for custom properties
      this.shadowRoot.getElementById("enableDataAnalyzer").addEventListener("change", (event) => {
        this.dispatchEvent(new CustomEvent("propertiesChanged", {
          detail: {
            properties: {
              enableDataAnalyzer: event.target.checked
            }
          }
        }));
      });

      this.shadowRoot.getElementById("disableInteraction").addEventListener("change", (event) => {
        this.dispatchEvent(new CustomEvent("propertiesChanged", {
          detail: {
            properties: {
              disableInteraction: event.target.checked
            }
          }
        }));
      });

      this.shadowRoot.getElementById("allowComments").addEventListener("change", (event) => {
        this.dispatchEvent(new CustomEvent("propertiesChanged", {
          detail: {
            properties: {
              allowComments: event.target.checked
            }
          }
        }));
      });

      this.shadowRoot.getElementById("planningEnabled").addEventListener("change", (event) => {
        this.dispatchEvent(new CustomEvent("propertiesChanged", {
          detail: {
            properties: {
              planningEnabled: event.target.checked
            }
          }
        }));
      });

      this.shadowRoot.getElementById("dataRefreshMode").addEventListener("change", (event) => {
        this.dispatchEvent(new CustomEvent("propertiesChanged", {
          detail: {
            properties: {
              dataRefreshMode: event.target.value
            }
          }
        }));
      });

      // Add Default Data Binding Options (Model, Dimensions, Measures)
      const defaultBindingContainer = document.createElement("div");
      defaultBindingContainer.innerHTML = `
        <div class="property">
          <button id="addModel">Add Model</button>
          <button id="addDimension">Add Dimension</button>
          <button id="addMeasure">Add Measure</button>
        </div>
      `;
      this.shadowRoot.appendChild(defaultBindingContainer);

      this.shadowRoot.getElementById("addModel").addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("openDataBinding", {
          detail: {
            id: "myDataSource"
          }
        }));
      });

      this.shadowRoot.getElementById("addDimension").addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("openFeedDialog", {
          detail: {
            id: "dimensions"
          }
        }));
      });

      this.shadowRoot.getElementById("addMeasure").addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("openFeedDialog", {
          detail: {
            id: "measures"
          }
        }));
      });
    }
  }

  customElements.define("com-sap-custom-tablewidget-builder", TableWidgetBuilder);
})();
