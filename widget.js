var getScriptPromisify = (src) => {
  // Workaround with conflict between geo widget and echarts.
  const __define = define;
  define = undefined;
  return new Promise(resolve => {
    $.getScript(src, () => {
      define = __define;
      resolve();
    });
  });
};

(function () {
  const prepared = document.createElement("template");
  prepared.innerHTML = `
        <style>
        </style>
        <div id="root" style="width: 100%; height: 100%;">
        </div>
      `;
  class CustomTableWidget extends HTMLElement {
    constructor() {
      super();

      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(prepared.content.cloneNode(true));

      this._root = this._shadowRoot.getElementById("root");

      this._props = {};
      this.render();
    }

    onCustomWidgetResize(width, height) {
      this.render();
    }

    set myDataSource(dataBinding) {
      this._myDataSource = dataBinding;
      this.render();
    }

    async render() {
      if (!this._myDataSource || this._myDataSource.state !== "success") {
        return;
      }

      // Extract data and build the table
      const columns = this._myDataSource.metadata.feeds.dimensions.values;
      const rows = this._myDataSource.data;

      // Clear any existing content
      this._root.innerHTML = '';

      // Create table and add header
      const table = document.createElement('table');
      const header = document.createElement('thead');
      const headerRow = document.createElement('tr');

      columns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col.label;
        headerRow.appendChild(th);
      });

      header.appendChild(headerRow);
      table.appendChild(header);

      // Create table body with rows
      const body = document.createElement('tbody');
      rows.forEach(row => {
        const tableRow = document.createElement('tr');
        columns.forEach(col => {
          const td = document.createElement('td');
          td.textContent = row[col.id] ? row[col.id].label : '';
          tableRow.appendChild(td);
        });
        body.appendChild(tableRow);
      });

      table.appendChild(body);
      this._root.appendChild(table);
    }
  }

  customElements.define("com-sap-sample-table-widget", CustomTableWidget);
})();
