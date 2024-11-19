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
    console.log("Widget Connected to DOM"); // Debugging

    // Simulate property setting (trigger the setters)
    this.enableDataAnalyzer = this._props.enableDataAnalyzer;
    this.disableInteraction = this._props.disableInteraction;
    this.allowComments = this._props.allowComments;
    this.planningEnabled = this._props.planningEnabled;
    this.dataRefreshMode = this._props.dataRefreshMode;

    console.log("Properties Initialized via connectedCallback");
  }

    // Builder option setters
    set enableDataAnalyzer(value) {
  this._props.enableDataAnalyzer = value;
  this.render(); // Re-render widget based on new property value
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

    // Resize handler
    onCustomWidgetResize(width, height) {
      this.render();
    }

    // Data source setter
    set myDataSource(dataBinding) {
      this._myDataSource = dataBinding;
      this.render();
    }

    // Render the table
    async render() {
      if (!this._myDataSource) {
        this._root.innerHTML = `<p>No data source bound.</p>`;
        return;
      }

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

      this.addEventListenersToRows();
      this.addButtonListeners();
    }

    // Row selection logic
    addEventListenersToRows() {
      const rows = this._root.querySelectorAll("tr[data-row-id]");
      rows.forEach((row) => {
        row.addEventListener("click", (event) => this.handleRowSelection(event, row));
      });
    }

    handleRowSelection(event, row) {
      if (this._props.disableInteraction) return; // Ignore if interaction is disabled

      const previouslySelected = this._root.querySelector(".selected");
      if (previouslySelected) {
        previouslySelected.classList.remove("selected");
      }

      row.classList.add("selected");

      const rowId = row.getAttribute("data-row-id");
      if (!rowId) {
        console.error("Row ID not found.");
        return;
      }

      const rowData = this._myDataSource.data.find((row) => row["ID"] === rowId);
      if (!rowData) {
        console.error("Row data not found for ID:", rowId);
        return;
      }

      const dimensions = this._myDataSource.metadata.feeds.dimensions.values;
      const measures = this._myDataSource.metadata.feeds.measures.values;

      const selectedDimensions = dimensions.map((dim) => rowData[dim]?.label || "N/A");
      const selectedMeasures = measures.map((measureId) => rowData[measureId]?.raw || "N/A");

      console.log("Selected Row ID:", rowId);
      console.log("Selected Dimensions:", selectedDimensions);
      console.log("Selected Measures:", selectedMeasures);
    }

    // Button listeners
    addButtonListeners() {
      const buttons = this._root.querySelectorAll("button");
      buttons.forEach((button) => {
        button.addEventListener("click", (event) => this.handleButtonClick(event));
      });
    }

    handleButtonClick(event) {
      const button = event.target;
      const row = button.closest("tr");
      const rowId = row ? row.getAttribute("data-row-id") : null;

      if (rowId) {
        console.log("Button clicked for Row ID:", rowId);
      }
    }
  }

  customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
})();
