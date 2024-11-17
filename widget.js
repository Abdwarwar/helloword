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
        const data = await this.getDataFromSACModel();
        this.populateTable(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    getDataFromSACModel() {
      return new Promise((resolve, reject) => {
        try {
          // Example: Accessing data from a specific SAC model
          const model = this.getModel(); // SAC model reference

          // Assuming the model has a dimension 'Column1', 'Column2', etc.
          const rows = [];

          // Retrieve the data from the model
          model.getData().forEach((row) => {
            rows.push([row.Column1, row.Column2, row.Column3]); // Mapping columns to table cells
          });

          resolve(rows);
        } catch (error) {
          reject(error);
        }
      });
    }

    getModel() {
      // SAC-specific logic to get a model bound to the widget
      // You would need to use SAC's binding API to get the model you're interested in.
      // Replace this with the actual SAC API call to get the data model
      return {
        getData: () => [
          { Column1: "Row 1, Col 1", Column2: "Row 1, Col 2", Column3: "Row 1, Col 3" },
          { Column1: "Row 2, Col 1", Column2: "Row 2, Col 2", Column3: "Row 2, Col 3" },
        ],
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
