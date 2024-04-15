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

const defaultColor = "#2D72D9";
const SiDesignernews = React__namespace.forwardRef(function SiDesignernews2({ title = "Designer News", color = "currentColor", size = 24, ...others }, ref) {
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
        /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M11.27 11.98c0-3.83-2.354-6.43-6.84-6.43H0v12.9h4.524c4.354 0 6.747-2.624 6.747-6.464v-.005zM8.056 12c0 2.766-1.42 3.963-3.7 3.963h-1.16V8.037h1.16c2.185 0 3.7 1.252 3.7 3.963zM24 18.45V5.55h-2.97v7.213L16.28 5.55h-3.105v12.9h2.973v-7.723l5.084 7.718H24v.004z" })
      ]
    }
  );
});

exports.default = SiDesignernews;
exports.defaultColor = defaultColor;
