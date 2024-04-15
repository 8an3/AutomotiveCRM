import { jsxs, jsx } from 'react/jsx-runtime';
import * as React from 'react';

const defaultColor = "#5C97FF";
const SiQwant = React.forwardRef(function SiQwant2({ title = "Qwant", color = "currentColor", size = 24, ...others }, ref) {
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
        /* @__PURE__ */ jsx("path", { d: "M11.39 0c5.322 0 9.652 4.46 9.652 9.944 0 5.358-4.132 9.738-9.285 9.938l-.235.006h9.488L22.262 24h-9.62l-1.253-4.11c-5.321-.001-9.65-4.462-9.65-9.946S6.067 0 11.388 0zm0 3.364c-3.522 0-6.387 2.952-6.387 6.58 0 3.63 2.865 6.58 6.387 6.58 3.522 0 6.387-2.95 6.387-6.58 0-3.628-2.865-6.58-6.387-6.58z" })
      ]
    }
  );
});

export { SiQwant as default, defaultColor };
