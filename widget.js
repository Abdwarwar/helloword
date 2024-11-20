(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <style>
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f4f4f4; }
      tr:nth-child(even) { background-color: #f9f9f9; }
      tr.selected { background-color: #ffeb3b; }
      td[contenteditable="true"] { background-color: #fffdd0; }
    </style>
    <div id="widget-container" style="width: 100%; height: 100%; overflow: auto;"></div>
  `;

  class CustomTableWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.container = this.shadowRoot.getElementById("widget-container");
      this.dataSource = null;
    }

    set myDataSource(value) {
      this.dataSource = value;
      this.render();
    }

    connectedCallback() {
      this.render();
    }

    render() {
      if (!this.dataSource || this.dataSource.state !== "success") {
        this.container.innerHTML = `<p>Loading data...</p>`;
        return;
      }

      const { metadata, data } = this.dataSource;
      const dimensions = this.resolveMetadata(metadata.feeds.dimensions, metadata.dimensions);
      const measures = this.resolveMetadata(metadata.feeds.measures, metadata.mainStructureMembers);

      if (!dimensions.length || !measures.length) {
        this.container.innerHTML = `<p>Please configure dimensions and measures in the builder.</p>`;
        return;
      }

      const table = this.createTable(dimensions, measures, data);
      this.container.innerHTML = '';
      this.container.appendChild(table);
    }

    resolveMetadata(feedKeys, metadata) {
      return feedKeys.values.map(key => ({
        id: key,
        ...metadata[key],
      }));
    }

    createTable(dimensions, measures, data) {
      const table = document.createElement("table");
      const headers = `
        <thead>
          <tr>
            ${dimensions.map(dim => `<th>${dim.description || dim.id}</th>`).join('')}
            ${measures.map(measure => `<th>${measure.description || measure.id}</th>`).join('')}
          </tr>
        </thead>
      `;

      const body = `
        <tbody>
          ${data.map((row, rowIndex) => `
            <tr>
              ${dimensions.map(dim => `<td>${row[dim.key]?.label || 'N/A'}</td>`).join('')}
              ${measures.map(measure => `
                <td contenteditable="true" data-row="${rowIndex}" data-measure="${measure.id}">
                  ${row[measure.key]?.raw || '0'}
                </td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      `;

      table.innerHTML = headers + body;

      // Add event listeners for planning
      this.addEventListeners(table, dimensions, measures);

      return table;
    }

    addEventListeners(table, dimensions, measures) {
      const cells = table.querySelectorAll('td[contenteditable="true"]');
      cells.forEach(cell => {
        cell.addEventListener('blur', (event) => {
          const rowIndex = event.target.dataset.row;
          const measureId = event.target.dataset.measure;
          const newValue = parseFloat(event.target.textContent.trim());

          this.updatePlanningData(rowIndex, measureId, newValue, dimensions);
        });
      });
    }

    updatePlanningData(rowIndex, measureId, newValue, dimensions) {
      if (!this.dataSource || !this.dataSource.isPlanningEnabled) {
        console.error("Planning is not enabled or the data source is not bound.");
        return;
      }

      const dimensionValues = dimensions.map(dim => ({
        dimension: dim.id,
        value: this.dataSource.data[rowIndex][dim.key]?.id || null,
      }));

      const planningPayload = {
        measure: measureId,
        value: newValue,
        dimensionValues,
      };

      this.dataSource.updatePlanningData(planningPayload)
        .then(() => this.dataSource.submitPlanningData())
        .then(() => this.dataSource.refresh())
        .then(() => this.render())
        .catch(error => console.error("Planning data update failed:", error));
    }
  }

  customElements.define("custom-table-widget", CustomTableWidget);
})();
