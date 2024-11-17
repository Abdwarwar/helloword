(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <div>
      <table id="table"></table>
    </div>
  `;

  class TableWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
      // Get the selected dimensions and measures from the properties
      const dimension1 = this.getAttribute("dimension1");
      const dimension2 = this.getAttribute("dimension2");
      const measure = this.getAttribute("measure");

      console.log(`Dimension 1: ${dimension1}, Dimension 2: ${dimension2}, Measure: ${measure}`);
      this.fetchData(dimension1, dimension2, measure);
    }

    async fetchData(dimension1, dimension2, measure) {
      try {
        // Here, you would query the SAC model using these properties
        // In this example, we'll just log them, but you can use SAC APIs to fetch data
        console.log(`Fetching data for ${dimension1}, ${dimension2}, ${measure}`);

        // Simulate fetched data for demonstration
        const data = [
          [dimension1, dimension2, measure],
          ["Row 1 Value 1", "Row 1 Value 2", "Row 1 Measure"],
          ["Row 2 Value 1", "Row 2 Value 2", "Row 2 Measure"]
        ];

        this.populateTable(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    populateTable(data) {
      const table = this.shadowRoot.querySelector("#table");
      table.innerHTML = "";  // Clear any existing content
      const headerRow = table.insertRow();
      
      // Create headers based on the dimensions and measure
      data[0].forEach(text => {
        const cell = headerRow.insertCell();
        cell.textContent = text;
      });

      // Populate table rows
      for (let i = 1; i < data.length; i++) {
        const row = table.insertRow();
        data[i].forEach(cellData => {
          const cell = row.insertCell();
          cell.textContent = cellData;
        });
      }
    }
  }

  customElements.define("com-sap-custom-tablewidget", TableWidget);
})();
