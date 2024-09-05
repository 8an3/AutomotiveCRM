import React, { forwardRef } from 'react';
import Box from '../Box/Box.js';
import { IconButton } from '../Button/IconButton.js';
import '../Button/ButtonBase.js';
import '../utils/defaultSxProp.js';
import { ButtonComponent } from '../Button/Button.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TrailingAction = /*#__PURE__*/forwardRef(({
  as = 'button',
  icon,
  label,
  href = null,
  ...props
}, forwardedRef) => {
  if (!icon) {
    return /*#__PURE__*/React.createElement(Box, {
      "data-component": "ActionList.TrailingAction",
      as: "span",
      sx: {
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(ButtonComponent, _extends({
      variant: "invisible",
      as: as,
      href: href,
      ref: forwardedRef
    }, props), label));
  } else {
    return /*#__PURE__*/React.createElement(Box, {
      as: "span",
      "data-component": "ActionList.TrailingAction",
      sx: {
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(IconButton, _extends({
      as: as,
      "aria-label": label,
      icon: icon,
      variant: "invisible",
      tooltipDirection: "w",
      href: href
      // @ts-expect-error StyledButton wants both Anchor and Button refs
      ,
      ref: forwardedRef
    }, props)));
  }
});
TrailingAction.displayName = 'ActionList.TrailingAction';

export { TrailingAction };
