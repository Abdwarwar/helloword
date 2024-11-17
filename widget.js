(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <div>
      <table border="1" style="width:100%; border-collapse: collapse;">
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
      // Access the data binding for the widget
      const dataBinding = this.dataBindings.getDataBinding("myDataSource");

      if (!dataBinding) {
        console.error("Data binding 'myDataSource' is not available.");
        return;
      }

      // Get the data source from the binding
      const dataSource = dataBinding.getDataSource();

      if (!dataSource) {
        console.error("Data source is not available.");
        return;
      }

      // Get dimensions, measures, and data
      const dimensions = dataSource.getDimensions();
      const measures = dataSource.getMeasures();
      const data = dataSource.getData();

      console.log("Dimensions: ", dimensions);
      console.log("Measures: ", measures);
      console.log("Data: ", data);

      const headerRow = this.shadowRoot.querySelector("#header-row");
      headerRow.innerHTML = ""; // Clear previous headers

      // Create header cells for dimensions
      dimensions.forEach((dimension) => {
        const headerCell = document.createElement("th");
        headerCell.textContent = dimension.name;
        headerRow.appendChild(headerCell);
      });

      // Create header cells for measures
      measures.forEach((measure) => {
        const headerCell = document.createElement("th");
        headerCell.textContent = measure.name;
        headerRow.appendChild(headerCell);
      });

      const bodyRow = this.shadowRoot.querySelector("#body-row");
      bodyRow.innerHTML = ""; // Clear previous rows

      // Populate the table rows with data
      if (data && data.length > 0) {
        data.forEach((row) => {
          const rowElement = document.createElement("tr");

          // Add cells for dimensions
          dimensions.forEach((dimension) => {
            const cell = document.createElement("td");
            cell.textContent = row[dimension.name] || "N/A"; // Handle missing data
            rowElement.appendChild(cell);
          });

          // Add cells for measures
          measures.forEach((measure) => {
            const cell = document.createElement("td");
            cell.textContent = row[measure.name] || "N/A"; // Handle missing data
            rowElement.appendChild(cell);
          });

          bodyRow.appendChild(rowElement);
        });
      } else {
        // Handle the case where no data is available
        const noDataRow = document.createElement("tr");
        const noDataCell = document.createElement("td");
        noDataCell.colSpan = dimensions.length + measures.length;
        noDataCell.textContent = "No data available";
        noDataRow.appendChild(noDataCell);
        bodyRow.appendChild(noDataRow);
      }
    }
  }

  customElements.define("com-sap-custom-tablewidget", TableWidget);
})();
