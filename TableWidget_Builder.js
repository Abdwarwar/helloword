(function () {
  const prepared = document.createElement("template");
  prepared.innerHTML = `
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
      this.shadowRoot.appendChild(prepared.content.cloneNode(true));
    }

    connectedCallback() {
      // Attach event listeners for each property
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
