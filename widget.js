(function () {
  const template = document.createElement("template");
  template.innerHTML = `
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
    </style>
    <div>
      <table>
        <thead id="header-row"></thead>
        <tbody id="body-row"></tbody>
      </table>
    </div>
  `;

  class TableWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
      this.updateTable();
    }

    updateTable() {
      if (!this._myDataSource || this._myDataSource.state !== "success") {
        return;
      }

      const dimensions = this._myDataSource.metadata.feeds.dimensions.values[0];
      const measures = this._myDataSource.metadata.feeds.measures.values[0];
      const data = this._myDataSource.data;

      const headerRow = this.shadowRoot.querySelector("#header-row");
      headerRow.innerHTML = ''; // Clear previous headers

      // Create header cells for each dimension
      dimensions.forEach(dimension => {
        const headerCell = document.createElement('th');
        headerCell.textContent = dimension.label;
        headerRow.appendChild(headerCell);
      });

      // Create header cells for each measure
      measures.forEach(measure => {
        const headerCell = document.createElement('th');
        headerCell.textContent = measure.label;
        headerRow.appendChild(headerCell);
      });

      const bodyRow = this.shadowRoot.querySelector("#body-row");
      bodyRow.innerHTML = ''; // Clear previous rows

      // Loop through data and create rows for the table
      if (data && data.length > 0) {
        data.forEach(row => {
          const rowElement = document.createElement('tr');

          // Add cells for dimensions
          dimensions.forEach(dimension => {
            const cell = document.createElement('td');
            cell.textContent = row[dimension.id] || 'N/A'; // Default to 'N/A' if no data
            rowElement.appendChild(cell);
          });

          // Add cells for measures
          measures.forEach(measure => {
            const cell = document.createElement('td');
            cell.textContent = row[measure.id] || 'N/A'; // Default to 'N/A' if no data
            rowElement.appendChild(cell);
          });

          bodyRow.appendChild(rowElement);
        });
      } else {
        // Handle the case where no data is available
        const noDataRow = document.createElement('tr');
        const noDataCell = document.createElement('td');
        noDataCell.colSpan = dimensions.length + measures.length;
        noDataCell.textContent = 'No data available';
        noDataRow.appendChild(noDataCell);
        bodyRow.appendChild(noDataRow);
      }
    }

    set myDataSource(dataBinding) {
      this._myDataSource = dataBinding;
      this.updateTable(); // Update the table when data is bound
    }
  }

  customElements.define("com-sap-custom-tablewidget", TableWidget);
})();
