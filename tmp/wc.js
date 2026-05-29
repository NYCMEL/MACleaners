(() => {
  "use strict";

  if (!window.wc) {
    window.wc = {};
  }

  if (typeof window.wc.log !== "function") {
    window.wc.log = (...args) => {
      if (window.console && typeof window.console.log === "function") {
        window.console.log(...args);
      }
    };
  }

  if (typeof window.wc.publish !== "function") {
    window.wc.publish = (name, detail) => {
      window.dispatchEvent(new CustomEvent(name, { detail }));
    };
  }

  if (typeof window.wc.subscribe !== "function") {
    window.wc.subscribe = (name, callback) => {
      window.addEventListener(name, event => callback(event.detail || event));
    };
  }

  if (!customElements.get("wc-include")) {
    customElements.define("wc-include", class Include extends HTMLElement {
      connectedCallback() {
        const href = this.getAttribute("href");
        if (!href || this.dataset.loaded === "true") {
          return;
        }
        this.dataset.loaded = "true";
        fetch(href, { credentials: "same-origin" })
          .then(response => {
            if (!response.ok) {
              throw new Error(`Unable to load ${href}`);
            }
            return response.text();
          })
          .then(html => {
            this.outerHTML = html;
            window.dispatchEvent(new CustomEvent("wc-include:loaded", { detail: { href } }));
          })
          .catch(error => {
            wc.log("wc-include error", error);
            this.textContent = "";
          });
      }
    });
  }
})();
