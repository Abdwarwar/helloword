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

    getDataFromSACModel() {
      return new Promise((resolve, reject) => {
        try {
          // Fetch data from the SAC model using SAC's data binding APIs
          const model = this.getSACModel(); // Function to retrieve the SAC model
          const rows = [];

          // Retrieve data (dimensions and measures) dynamically from the model
          model.getData().forEach((row) => {
            rows.push([row.Dimension1, row.Dimension2, row.Measure]); // Adjust according to your model's structure
          });

          resolve(rows);
        } catch (error) {
          reject(error);
        }
      });
    }

    getSACModel() {
      // Replace this with the actual logic to fetch data from your SAC model
      // The following is a simulation of how you might fetch data

      // Placeholder SAC model data example:
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
