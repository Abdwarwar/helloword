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
        // Get the selected values from input controls
        const dimension1 = this.getAttribute("dimension1");
        const dimension2 = this.getAttribute("dimension2");
        const measure = this.getAttribute("measure");

        // Get data from the SAC model (replace this with your actual SAC API call)
        const data = await this.getDataFromSAC(dimension1, dimension2, measure);
        this.populateTable(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    async getDataFromSAC(dimension1, dimension2, measure) {
      // Simulate a call to the SAC model (replace with real data fetch logic)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Example data (replace with actual SAC model data)
          const data = [
            { dimension1: "North", dimension2: "Product A", measure: 1500 },
            { dimension1: "South", dimension2: "Product B", measure: 2000 },
            { dimension1: "East", dimension2: "Product C", measure: 1200 }
          ];
          resolve(data);
        }, 1000);
      });
    }

    populateTable(data) {
      const tableBody = this.shadowRoot.querySelector("#dataTable tbody");
      tableBody.innerHTML = ""; // Clear existing rows

      // Create a row for each piece of data
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
