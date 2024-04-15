'use strict';

Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: 'Module' } });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');

function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
  if (e) {
    for (const k in e) {
      if (k !== 'default') {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}

const React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);

const defaultColor = "#005FB8";
const SiMicrosoftstore = React__namespace.forwardRef(function SiMicrosoftstore2({ title = "Microsoft Store", color = "currentColor", size = 24, ...others }, ref) {
  if (color === "default") {
    color = defaultColor;
  }
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      height: size,
      fill: color,
      viewBox: "0 0 24 24",
      ref,
      ...others,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("title", { children: title }),
        /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M11.4 9.6v4.2H7.2V9.6h4.2zm0 9.6V15H7.2v4.2h4.2zm5.4-9.6v4.2h-4.2V9.6h4.2zm0 9.6V15h-4.2v4.2h4.2zM7.2 5.4V2.7c0-1.16.94-2.1 2.1-2.1h5.4c1.16 0 2.1.94 2.1 2.1v2.7h6.3a.9.9 0 0 1 .9.9v13.8a3.3 3.3 0 0 1-3.3 3.3H3.3A3.3 3.3 0 0 1 0 20.1V6.3a.9.9 0 0 1 .9-.9h6.3zM9 2.7v2.7h6V2.7a.3.3 0 0 0-.3-.3H9.3a.3.3 0 0 0-.3.3zM1.8 20.1a1.5 1.5 0 0 0 1.5 1.5h17.4a1.5 1.5 0 0 0 1.5-1.5V7.2H1.8v12.9z" })
      ]
    }
  );
});

exports.default = SiMicrosoftstore;
exports.defaultColor = defaultColor;
