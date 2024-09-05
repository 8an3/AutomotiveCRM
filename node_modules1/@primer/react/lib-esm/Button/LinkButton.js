import React, { forwardRef } from 'react';
import { ButtonBase } from './ButtonBase.js';
import { defaultSxProp } from '../utils/defaultSxProp.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const LinkButton = /*#__PURE__*/forwardRef(({
  children,
  as: Component = 'a',
  sx = defaultSxProp,
  ...props
}, forwardedRef) => {
  return /*#__PURE__*/React.createElement(ButtonBase, _extends({
    as: Component
    // @ts-expect-error ButtonBase wants both Anchor and Button refs
    ,
    ref: forwardedRef,
    sx: sx
  }, props), children);
});

export { LinkButton };
