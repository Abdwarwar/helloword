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
      console.log("Default Properties:", this._props); // Debugging
    }

    connectedCallback() {
      console.log("Widget Connected to DOM");

      // Ensure properties are initialized
      const enableDataAnalyzer = this._props.enableDataAnalyzer || false;
      const disableInteraction = this._props.disableInteraction || false;
      const allowComments = this._props.allowComments || false;
      const planningEnabled = this._props.planningEnabled || false;
      const dataRefreshMode = this._props.dataRefreshMode || "AlwaysRefresh";

      console.log("Properties Initialized via connectedCallback");

      // Trigger an initial render
      this.render();
    }

    set enableDataAnalyzer(value) {
      console.log("Set enableDataAnalyzer:", value); // Debugging
      this._props.enableDataAnalyzer = value;
      this.render();
    }

    set disableInteraction(value) {
      console.log("Set disableInteraction:", value); // Debugging
      this._props.disableInteraction = value;
      this.render();
    }

    set allowComments(value) {
      console.log("Setting allowComments:", value); // Log the value being set
      this._props.allowComments = value;
      this.render();
    }

    set planningEnabled(value) {
      console.log("Setting planningEnabled:", value); // Log the value being set
      this._props.planningEnabled = value;
      this.render();
    }

    set dataRefreshMode(value) {
      console.log("Setting dataRefreshMode:", value); // Log the value being set
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
        console.log("No data source bound yet. Rendering default state.");
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

      // Rendering logic for the table goes here
      this._root.innerHTML = `<p>Table will be rendered here based on data source.</p>`;
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);

  // Custom Builder Logic for SAP Builder Panel
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
    }
  }

  customElements.define("com-sap-custom-tablewidget-builder", TableWidgetBuilder);
})();
