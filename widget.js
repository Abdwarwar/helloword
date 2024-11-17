(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <style>
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f4f4f4;
      }
    </style>
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

  class TableWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
      console.log("Table Widget added to the page.");
      this.fetchData();
    }

    async fetchData() {
      try {
        const data = await this.getDataFromSACModel();
        this.populateTable(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    // Here, the getDataFromSACModel method should be dynamically fetching data from SAC Model
    async getDataFromSACModel() {
      return new Promise((resolve, reject) => {
        try {
          // Use SAC SDK to interact with SAC model and get data dynamically
          const model = this.getSACModel(); // Replace with SAC API call to fetch model data
          const rows = [];
          
          // Simulate getting rows from the model, you need to replace this with actual model data fetching
          model.getData().forEach((row) => {
            rows.push([row.Dimension1, row.Dimension2, row.Measure]);
          });
          
          resolve(rows);
        } catch (error) {
          reject(error);
        }
      });
    }

    // Simulate getting model data; you need to replace this with the SAC model binding or API
    getSACModel() {
      return {
        getData: () => [
          { Dimension1: "Abd", Dimension2: "warwar", Measure: 100 },
          { Dimension1: "nasser", Dimension2: "itani", Measure: 200 },
          { Dimension1: "mohamed", Dimension2: "wehbe", Measure: 300 }
        ]
      };
    }

    populateTable(data) {
      const tableBody = this.shadowRoot.querySelector("#dataTable tbody");
      tableBody.innerHTML = ""; // Clear existing rows

      data.forEach((row) => {
        const tr = document.createElement("tr");
        row.forEach((cell) => {
          const td = document.createElement("td");
          td.textContent = cell;
          tr.appendChild(td);
        });
        tableBody.appendChild(tr);
      });
    }
  }

  customElements.define("com-sap-custom-tablewidget", TableWidget);
})();
