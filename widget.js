// Promisify the script loading function to ensure dependencies load before execution.
var getScriptPromisify = (src) => {
  const __define = define;
  define = undefined;
  return new Promise((resolve) => {
    $.getScript(src, () => {
      define = __define;
      resolve();
    });
  });
};

(function () {
  // Create the widget's template
  const template = document.createElement("template");
  template.innerHTML = `
    <style>
      #root {
        width: 100%;
        height: 100%;
      }
    </style>
    <div id="root"></div>
  `;

  // Define the custom widget class
  class CustomPieChart extends HTMLElement {
    constructor() {
      super();

      // Attach shadow DOM and set up the widget structure
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this._root = this._shadowRoot.getElementById("root");

      // Initialize widget properties
      this._props = {};
      this._myDataSource = null;
    }

    // Handle resizing the widget
    onCustomWidgetResize(width, height) {
      this.render();
    }

    // Data binding setter
    set myDataSource(dataBinding) {
      this._myDataSource = dataBinding;
      this.render();
    }

    // Main render function
    async render() {
      // Ensure dependencies are loaded
      await getScriptPromisify("https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js");

      // If data source is unavailable, display a message
      if (!this._myDataSource || this._myDataSource.state !== "success") {
        this._root.innerHTML = `<p>Loading data...</p>`;
        return;
      }

      // Extract dimensions and measures from the data source
      const dimension = this._myDataSource.metadata.feeds.dimensions.values[0];
      const measure = this._myDataSource.metadata.feeds.measures.values[0];
      const data = this._myDataSource.data.map((item) => ({
        name: item[dimension].label,
        value: item[measure].raw,
      })).sort((a, b) => a.value - b.value);

      // Initialize the chart with ECharts
      const myChart = echarts.init(this._root, "light");
      const option = {
        backgroundColor: '#FFFFFF',
        tooltip: { trigger: 'item' },
        series: [
          {
            type: 'pie',
            radius: '55%',
            data,
            label: { color: '#1D2D3E' },
            labelLine: { lineStyle: { color: '#1D2D3E' } },
            itemStyle: {
              color: '#0070F2',
              shadowBlur: 15,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
            },
          },
        ],
      };

      // Apply the chart options
      myChart.setOption(option);
    }
  }

  // Define the custom element for the widget
  customElements.define("com-sap-sample-echarts-pie", CustomPieChart);
})();
