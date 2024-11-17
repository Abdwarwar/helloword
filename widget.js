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
      const dimensions = this.dataBindings.getDataBinding('myDataSource').getDataSource().getDimensions();
      const measures = this.dataBindings.getDataBinding('myDataSource').getDataSource().getMeasures();

      const headerRow = this.shadowRoot.querySelector("#header-row");
      headerRow.innerHTML = '';

      dimensions.forEach(dimension => {
        const headerCell = document.createElement('th');
        headerCell.textContent = dimension.name;
        headerRow.appendChild(headerCell);
      });

      measures.forEach(measure => {
        const headerCell = document.createElement('th');
        headerCell.textContent = measure.name;
        headerRow.appendChild(headerCell);
      });

      const bodyRow = this.shadowRoot.querySelector("#body-row");
      bodyRow.innerHTML = '';

      const data = this.dataBindings.getDataBinding('myDataSource').getDataSource().getData();
      data.forEach(row => {
        const rowElement = document.createElement('tr');
        
        dimensions.forEach(dimension => {
          const cell = document.createElement('td');
          cell.textContent = row[dimension.name] || 'N/A'; // Default to N/A if no data
          rowElement.appendChild(cell);
        });

        measures.forEach(measure => {
          const cell = document.createElement('td');
          cell.textContent = row[measure.name] || 'N/A'; // Default to N/A if no data
          rowElement.appendChild(cell);
        });

        bodyRow.appendChild(rowElement);
      });
    }
  }

  customElements.define("com-sap-custom-tablewidget", TableWidget);
})();
