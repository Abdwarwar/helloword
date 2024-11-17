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
            <th>Column 1</th>
            <th>Column 2</th>
            <th>Column 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Row 1, Col 1</td>
            <td>Row 1, Col 2</td>
            <td>Row 1, Col 3</td>
          </tr>
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
        // Placeholder for SAC data fetching logic
        // Example: Using the SAC scripting API to get data
        const data = await this.getDataFromSACModel();

        // Populate table with the data
        this.populateTable(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    getDataFromSACModel() {
      // SAC-specific logic to retrieve data from the model
      // Example: Use the data binding APIs to connect to the SAC model
      return new Promise((resolve) => {
        resolve([
          ["Row 1, Col 1", "Row 1, Col 2", "Row 1, Col 3"],
          ["Row 2, Col 1", "Row 2, Col 2", "Row 2, Col 3"],
        ]);
      });
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
