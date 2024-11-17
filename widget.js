(function () {
  const template = document.createElement("template");
  template.innerHTML = `
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
      const dataBinding = this.dataBindings.getDataBinding('myDataSource');
      const dataSource = dataBinding.getDataSource();

      // Log the data to ensure it's available
      console.log("Dimensions: ", dataSource.getDimensions());
      console.log("Measures: ", dataSource.getMeasures());
      console.log("Data: ", dataSource.getData());

      const dimensions = dataSource.getDimensions();
      const measures = dataSource.getMeasures();

      const headerRow = this.shadowRoot.querySelector("#header-row");
      headerRow.innerHTML = ''; // Clear previous headers

      // Create header cells for each dimension
      dimensions.forEach(dimension => {
        const headerCell = document.createElement('th');
        headerCell.textContent = dimension.name;
        headerRow.appendChild(headerCell);
      });

      // Create header cells for each measure
      measures.forEach(measure => {
        const headerCell = document.createElement('th');
        headerCell.textContent = measure.name;
        headerRow.appendChild(headerCell);
      });

      const bodyRow = this.shadowRoot.querySelector("#body-row");
      bodyRow.innerHTML = ''; // Clear previous rows

      // Loop through data and create rows for the table
      const data = dataSource.getData();
      if (data && data.length > 0) {
        data.forEach(row => {
          const rowElement = document.createElement('tr');

          // Add cells for dimensions
          dimensions.forEach(dimension => {
            const cell = document.createElement('td');
            cell.textContent = row[dimension.name] || 'N/A'; // Default to 'N/A' if no data
            rowElement.appendChild(cell);
          });

          // Add cells for measures
          measures.forEach(measure => {
            const cell = document.createElement('td');
            cell.textContent = row[measure.name] || 'N/A'; // Default to 'N/A' if no data
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
  }

  customElements.define("com-sap-custom-tablewidget", TableWidget);
})();
