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

    // Simulated method to retrieve data from SAC model, replace with actual API call
    async getDataFromSACModel() {
      return new Promise((resolve, reject) => {
        try {
          // Access the SAC model using data binding API (example)
          const model = this.getSACModel(); // Replace with SAC model API call
          const rows = [];
          
          // Get data dynamically from the SAC model
          model.getData().forEach((row) => {
            rows.push([row.Dimension1, row.Dimension2, row.Measure]);
          });
          
          resolve(rows);
        } catch (error) {
          reject(error);
        }
      });
    }

    // Example model method, replace this with actual API for data binding
    getSACModel() {
      // Use SAC API to get data from the selected model and dimension
      return {
        getData: () => [
          { Dimension1: "A", Dimension2: "X", Measure: 100 },
          { Dimension1: "B", Dimension2: "Y", Measure: 200 },
          { Dimension1: "C", Dimension2: "Z", Measure: 300 }
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
