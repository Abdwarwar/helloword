(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <style>
      /* Add any custom styles here */
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

      // Bind the table to the DOM elements
      this.headerRow = this.shadowRoot.querySelector("#header-row");
      this.bodyRow = this.shadowRoot.querySelector("#body-row");
    }

    // Setter for data binding
    set myDataSource(dataBinding) {
      this._myDataSource = dataBinding;
      this.render(); // Trigger render when dataBinding is set
    }

    // Ensure table is updated when resized or when data changes
    onCustomWidgetResize(width, height) {
      this.render();
    }

    // Function to render the table with the data
    async render() {
      // If no dataBinding or invalid state, stop rendering
      if (!this._myDataSource || this._myDataSource.state !== "success") {
        console.log("Invalid data binding or data source");
        return;
      }

      // Retrieve dimensions and measures from the data source
      const dimensions = this._myDataSource.metadata.feeds.dimensions.values;
      const measures = this._myDataSource.metadata.feeds.measures.values;

      // Log the data for debugging purposes
      console.log("Dimensions: ", dimensions);
      console.log("Measures: ", measures);

      // Clear any previous data in the table
      this.headerRow.innerHTML = ''; // Clear previous headers
      this.bodyRow.innerHTML = ''; // Clear previous rows

      // Create header cells for each dimension
      dimensions.forEach(dimension => {
        const headerCell = document.createElement('th');
        headerCell.textContent = dimension.label || dimension.name;
        this.headerRow.appendChild(headerCell);
      });

      // Create header cells for each measure
      measures.forEach(measure => {
        const headerCell = document.createElement('th');
        headerCell.textContent = measure.label || measure.name;
        this.headerRow.appendChild(headerCell);
      });

      // Get the actual data from the data source
      const data = this._myDataSource.data;
      if (data && data.length > 0) {
        data.forEach(row => {
          const rowElement = document.createElement('tr');

          // Add cells for each dimension
          dimensions.forEach(dimension => {
            const cell = document.createElement('td');
            cell.textContent = row[dimension.name] || 'N/A'; // Default if no data available
            rowElement.appendChild(cell);
          });

          // Add cells for each measure
          measures.forEach(measure => {
            const cell = document.createElement('td');
            cell.textContent = row[measure.name] || 'N/A'; // Default if no data available
            rowElement.appendChild(cell);
          });

          this.bodyRow.appendChild(rowElement);
        });
      } else {
        // If no data available, display a message in the table
        const noDataRow = document.createElement('tr');
        const noDataCell = document.createElement('td');
        noDataCell.colSpan = dimensions.length + measures.length;
        noDataCell.textContent = 'No data available';
        noDataRow.appendChild(noDataCell);
        this.bodyRow.appendChild(noDataRow);
      }
    }
  }

  customElements.define("com-sap-custom-tablewidget", TableWidget);
})();
