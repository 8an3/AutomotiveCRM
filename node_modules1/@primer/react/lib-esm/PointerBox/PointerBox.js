import React from 'react';
import { ThemeContext } from 'styled-components';
import Box from '../Box/Box.js';
import Caret from '../Caret.js';
import { get } from '../constants.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

// FIXME: Make this work with BetterStyledSystem types

function PointerBox(props) {
  // don't destructure these, just grab them
  const themeContext = React.useContext(ThemeContext);
  const {
    bg,
    border,
    borderColor,
    theme: themeProp,
    sx
  } = props;
  const {
    caret,
    children,
    ...boxProps
  } = props;
  const {
    bg: sxBg,
    backgroundColor,
    ...sxRest
  } = sx || {};
  const theme = themeProp || themeContext;
  const customBackground = bg || sxBg || backgroundColor;
  const caretProps = {
    bg: bg || (sx === null || sx === void 0 ? void 0 : sx.bg) || (sx === null || sx === void 0 ? void 0 : sx.backgroundColor),
    borderColor: borderColor || (sx === null || sx === void 0 ? void 0 : sx.borderColor),
    borderWidth: border,
    location: caret,
    theme
  };
  const defaultBoxProps = {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'border.default',
    borderRadius: 2
  };
  return /*#__PURE__*/React.createElement(Box, _extends({}, defaultBoxProps, boxProps, {
    sx: {
      ...sxRest,
      '--custom-bg': get(`colors.${customBackground}`)({
        theme
      }),
      backgroundImage: customBackground ? `linear-gradient(var(--custom-bg), var(--custom-bg)), linear-gradient(${theme.colors.canvas.default}, ${theme.colors.canvas.default})` : undefined,
      position: 'relative'
    }
  }), children, /*#__PURE__*/React.createElement(Caret, caretProps));
}
PointerBox.displayName = "PointerBox";

export { PointerBox as default };
