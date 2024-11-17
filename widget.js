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
      // Check if the data source is available
      if (!this._myDataSource || this._myDataSource.state !== "success") {
        console.error('Data source not available');
        return;
      }

      // Example static data (for testing)
      const headers = ['Dimension 1', 'Dimension 2', 'Measure 1'];
      const rows = [
        ['Value 1', 'Value A', 100],
        ['Value 2', 'Value B', 200],
        ['Value 3', 'Value C', 300]
      ];

      // Clear existing table content
      this._tableHeader.innerHTML = '';
      this._tableBody.innerHTML = '';

      // Create header row
      headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        this._tableHeader.appendChild(th);
      });

      // Create table rows with sample data
      rows.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
          const td = document.createElement("td");
          td.textContent = cell;
          tr.appendChild(td);
        });
        this._tableBody.appendChild(tr);
      });
    }
  }

  customElements.define("com-sap-sample-custom_table_widget", CustomTableSample);
})();
