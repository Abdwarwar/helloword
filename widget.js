(function () {
  const prepared = document.createElement("template");
  prepared.innerHTML = `
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
        <div id="root" style="width: 100%; height: 100%; overflow:auto;">
          <table id="custom-table">
            <thead>
              <tr id="header-row"></tr>
            </thead>
            <tbody id="data-rows"></tbody>
          </table>
        </div>
      `;
  class CustomTableWidget extends HTMLElement {
    constructor() {
      super();

      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(prepared.content.cloneNode(true));

      this._tableHeader = this._shadowRoot.getElementById("header-row");
      this._tableBody = this._shadowRoot.getElementById("data-rows");

      this._props = {};
    }

    onCustomWidgetResize(width, height) {
      this.render();
    }

    set myDataSource(dataBinding) {
      this._myDataSource = dataBinding;
      this.render();
    }

    render() {
      if (!this._myDataSource || this._myDataSource.state !== "success") {
        return;
      }

      const dimensions = this._myDataSource.metadata.feeds.dimensions.values;
      const measures = this._myDataSource.metadata.feeds.measures.values;

      // Clear existing table content
      this._tableHeader.innerHTML = "";
      this._tableBody.innerHTML = "";

      // Create table headers
      dimensions.forEach((dim) => {
        const th = document.createElement("th");
        th.textContent = dim;
        this._tableHeader.appendChild(th);
      });
      measures.forEach((measure) => {
        const th = document.createElement("th");
        th.textContent = measure;
        this._tableHeader.appendChild(th);
      });

      // Populate table rows
      this._myDataSource.data.forEach((dataRow) => {
        const tr = document.createElement("tr");

        dimensions.forEach((dim) => {
          const td = document.createElement("td");
          td.textContent = dataRow[dim]?.label || "";
          tr.appendChild(td);
        });

        measures.forEach((measure) => {
          const td = document.createElement("td");
          td.textContent = dataRow[measure]?.raw || "";
          tr.appendChild(td);
        });

        this._tableBody.appendChild(tr);
      });
    }
  }

  customElements.define("com-sap-sample-echarts-custom_table", CustomTableWidget);
})();
