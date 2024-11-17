(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <div>
      <h1>Table Widget</h1>
      <table id="data-table">
        <thead>
          <tr id="header-row"></tr>
        </thead>
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
      // Get the data binding for dimensions and measures
      const dimensions = this.dataBindings.getDataBinding('myDataSource').getDataSource().getDimensions();
      const measures = this.dataBindings.getDataBinding('myDataSource').getDataSource().getMeasures();

      // Update the table header with the dimensions and measures
      const headerRow = this.shadowRoot.querySelector("#header-row");
      headerRow.innerHTML = '';

      dimensions.forEach(dimension => {
        const headerCell = document.createElement('th');
        headerCell.textContent = dimension.name; // Dimension name
        headerRow.appendChild(headerCell);
      });

      measures.forEach(measure => {
        const headerCell = document.createElement('th');
        headerCell.textContent = measure.name; // Measure name
        headerRow.appendChild(headerCell);
      });

      // Get the data rows (e.g., the members of the dimensions and measures)
      const bodyRow = this.shadowRoot.querySelector("#body-row");
      bodyRow.innerHTML = '';

      const data = this.dataBindings.getDataBinding('myDataSource').getDataSource().getData();

      data.forEach(row => {
        const rowElement = document.createElement('tr');

        dimensions.forEach(dimension => {
          const cell = document.createElement('td');
          cell.textContent = row[dimension.name]; // Populate dimension values
          rowElement.appendChild(cell);
        });

        measures.forEach(measure => {
          const cell = document.createElement('td');
          cell.textContent = row[measure.name]; // Populate measure values
          rowElement.appendChild(cell);
        });

        bodyRow.appendChild(rowElement);
      });
    }
  }

  customElements.define("com-sap-custom-tablewidget", TableWidget);
})();
