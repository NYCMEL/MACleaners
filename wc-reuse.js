(function () {
  if (!window.wc) window.wc = {};
  window.wc.log = window.wc.log || function () { console.log.apply(console, arguments); };
  window.wc.publish = window.wc.publish || function (topic, payload) {
    document.dispatchEvent(new CustomEvent(topic, { detail: payload, bubbles: true }));
  };
  window.wc.subscribe = window.wc.subscribe || function (topic, callback) {
    document.addEventListener(topic, function (event) { callback(event.detail); });
  };
  if (!customElements.get('wc-include')) {
    customElements.define('wc-include', class WcInclude extends HTMLElement {
      connectedCallback() {
        const href = this.getAttribute('href');
        if (!href) return;
        fetch(href).then((response) => response.text()).then((html) => {
          this.outerHTML = html;
          document.dispatchEvent(new CustomEvent('wc-include:loaded', { bubbles: true, detail: { href } }));
        }).catch((error) => console.error('wc-include failed', error));
      }
    });
  }
}());
