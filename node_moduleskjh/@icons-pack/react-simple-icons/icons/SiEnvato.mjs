import { jsxs, jsx } from 'react/jsx-runtime';
import * as React from 'react';

const defaultColor = "#81B441";
const SiEnvato = React.forwardRef(function SiEnvato2({ title = "Envato", color = "currentColor", size = 24, ...others }, ref) {
  if (color === "default") {
    color = defaultColor;
  }
  return /* @__PURE__ */ jsxs(
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
        /* @__PURE__ */ jsx("title", { children: title }),
        /* @__PURE__ */ jsx("path", { d: "M20.058 1.043C16.744-2.841 6.018 4.682 6.104 14.38a.459.459 0 0 1-.45.451.459.459 0 0 1-.388-.221 10.387 10.387 0 0 1-.412-7.634.42.42 0 0 0-.712-.412 10.284 10.284 0 0 0-2.784 7.033A10.284 10.284 0 0 0 11.76 23.999c14.635-.332 11.257-19.491 8.298-22.956z" })
      ]
    }
  );
});

export { SiEnvato as default, defaultColor };
