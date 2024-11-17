(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <div>
      <table id="dataTable">
        <thead>
          <tr>
            <th>Dimension 1</th>
            <th>Dimension 2</th>
            <th>Measure</th>
          </tr>
        </thead>
        <tbody>
          <!-- Dynamic rows will be inserted here -->
        </tbody>
      </table>
    </div>
  `;

  class DataTableWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
      console.log("Data Table widget added to the page.");
      this.fetchData();
    }

    async fetchData() {
      try {
        const data = await this.getDataFromSAC();
        this.populateTable(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    async getDataFromSAC() {
      // Here, we'll use the widget properties to fetch the selected dimensions and measures
      const dimension1 = this.getAttribute("dimension1");  // Dimension 1 from the property
      const dimension2 = this.getAttribute("dimension2");  // Dimension 2 from the property
      const measure = this.getAttribute("measure");        // Measure from the property

      // Fetch data based on the selected dimensions and measure from SAC
      const data = await this.fetchFromModel(dimension1, dimension2, measure);
      return data;
    }

    async fetchFromModel(dimension1, dimension2, measure) {
      // Here, fetch actual data from SAC model using the given dimensions and measures
      // For now, we simulate data fetching:
      return [
        { dimension1: 'North', dimension2: 'Product A', measure: 1500 },
        { dimension1: 'South', dimension2: 'Product B', measure: 2000 },
        { dimension1: 'East', dimension2: 'Product C', measure: 1200 }
      ];
    }

    populateTable(data) {
      const tableBody = this.shadowRoot.querySelector("#dataTable tbody");
      tableBody.innerHTML = ""; // Clear existing rows

      data.forEach(row => {
        const tr = document.createElement("tr");
        Object.values(row).forEach(cell => {
          const td = document.createElement("td");
          td.textContent = cell;
          tr.appendChild(td);
        });
        tableBody.appendChild(tr);
      });
    }
  }

  customElements.define("com-sap-custom-datatable", DataTableWidget);
})();
