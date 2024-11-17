(function () {
  const prepared = document.createElement("template");
  prepared.innerHTML = `
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 8px;
            text-align: left;
            border: 1px solid #ddd;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
        <div id="root" style="width: 100%; height: 100%; overflow: auto;">
          <table id="custom-table">
            <thead>
              <tr id="table-header"></tr>
            </thead>
            <tbody id="table-body"></tbody>
          </table>
        </div>
      `;
  
  class CustomTableSample extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(prepared.content.cloneNode(true));
      this._root = this._shadowRoot.getElementById("root");
      this._tableHeader = this._shadowRoot.getElementById("table-header");
      this._tableBody = this._shadowRoot.getElementById("table-body");
      this._props = {};
      this.render();
    }

    onCustomWidgetResize(width, height) {
      this.render();
    }

    set myDataSource(dataBinding) {
      this._myDataSource = dataBinding;
      this.render();
    }

    render() {
      // Log to debug and check if data is available
      console.log('Rendering table widget');
      
      // Check if the data source is valid and has been successfully loaded
      if (!this._myDataSource || this._myDataSource.state !== "success") {
        console.error('Data source is not available or not successful');
        return;
      }

      const dimensionNames = this._myDataSource.metadata.feeds.dimensions.values;
      const measureNames = this._myDataSource.metadata.feeds.measures.values;
      const data = this._myDataSource.data;

      // Log the dimensions, measures, and data to the console
      console.log('Dimensions:', dimensionNames);
      console.log('Measures:', measureNames);
      console.log('Data:', data);

      // Clear the table content first
      this._tableHeader.innerHTML = '';
      this._tableBody.innerHTML = '';

      // Create header row for dimensions and measures
      dimensionNames.forEach(dim => {
        const th = document.createElement("th");
        th.textContent = dim.name;
        this._tableHeader.appendChild(th);
      });

      measureNames.forEach(measure => {
        const th = document.createElement("th");
        th.textContent = measure.name;
        this._tableHeader.appendChild(th);
      });

      // Populate table body with data
      data.forEach((row, index) => {
        const tr = document.createElement("tr");

        // Add dimension values
        dimensionNames.forEach(dim => {
          const td = document.createElement("td");
          td.textContent = row[dim.id] ? row[dim.id].label : 'N/A';  // Check for missing values
          tr.appendChild(td);
        });

        // Add measure values
        measureNames.forEach(measure => {
          const td = document.createElement("td");
          td.textContent = row[measure.id] ? row[measure.id].raw : 'N/A';  // Check for missing values
          tr.appendChild(td);
        });

        this._tableBody.appendChild(tr);
      });
    }
  }

  customElements.define("com-sap-sample-custom_table_widget", CustomTableSample);
})();
