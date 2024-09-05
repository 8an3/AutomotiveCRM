import React, { forwardRef } from 'react';
import Box from '../Box/Box.js';
import '@styled-system/css';
import merge from 'deepmerge';
import VisuallyHidden from '../_VisuallyHidden.js';
import { defaultSxProp } from '../utils/defaultSxProp.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CounterLabel = /*#__PURE__*/forwardRef(({
  scheme = 'secondary',
  sx = defaultSxProp,
  children,
  ...props
}, forwardedRef) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Box, _extends({
    "aria-hidden": "true",
    sx: merge({
      display: 'inline-block',
      padding: '2px 5px',
      fontSize: 0,
      fontWeight: 'bold',
      lineHeight: 'condensedUltra',
      borderRadius: '20px',
      backgroundColor: scheme === 'primary' ? 'neutral.emphasis' : 'neutral.muted',
      border: 'var(--borderWidth-thin,max(1px, 0.0625rem)) solid var(--counter-borderColor,var(--color-counter-border))',
      color: scheme === 'primary' ? 'fg.onEmphasis' : 'fg.default',
      '&:empty': {
        display: 'none'
      }
    }, sx)
  }, props, {
    as: "span",
    ref: forwardedRef
  }), children), /*#__PURE__*/React.createElement(VisuallyHidden, null, "\xA0(", children, ")"));
});
CounterLabel.displayName = 'CounterLabel';

export { CounterLabel as default };
