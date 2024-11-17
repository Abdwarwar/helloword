(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <div>
      <h1>Hello, World!</h1>
    </div>
  `;

  class HelloWorldWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
      console.log("Hello World widget added to the page.");
    }
  }

  customElements.define("com-sap-custom-helloworld", HelloWorldWidget);
})();
