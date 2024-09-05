import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { TYPOGRAPHY, COMMON } from './constants.js';
import { useTheme } from './ThemeProvider.js';
import 'focus-visible';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const GlobalStyle = createGlobalStyle(["*{box-sizing:border-box;}body{margin:0;}table{border-collapse:collapse;}input{color-scheme:", ";}[role=\"button\"]:focus:not(:focus-visible):not(.focus-visible),[role=\"tabpanel\"][tabindex=\"0\"]:focus:not(:focus-visible):not(.focus-visible),button:focus:not(:focus-visible):not(.focus-visible),summary:focus:not(:focus-visible):not(.focus-visible),a:focus:not(:focus-visible):not(.focus-visible){outline:none;box-shadow:none;}[tabindex=\"0\"]:focus:not(:focus-visible):not(.focus-visible),details-dialog:focus:not(:focus-visible):not(.focus-visible){outline:none;}"], props => props.colorScheme);
const Base = styled.div.withConfig({
  displayName: "BaseStyles__Base",
  componentId: "sc-nfjs56-0"
})(["", ";", ";"], TYPOGRAPHY, COMMON);
function BaseStyles(props) {
  const {
    children,
    color = 'fg.default',
    fontFamily = 'normal',
    lineHeight = 'default',
    ...rest
  } = props;
  const {
    colorScheme,
    dayScheme,
    nightScheme
  } = useTheme();

  /**
   * We need to map valid primer/react color modes onto valid color modes for primer/primitives
   * valid color modes for primer/primitives: auto | light | dark
   * valid color modes for primer/primer: auto | day | night | light | dark
   */

  return /*#__PURE__*/React.createElement(Base, _extends({}, rest, {
    color: color,
    fontFamily: fontFamily,
    lineHeight: lineHeight,
    "data-portal-root": true,
    "data-color-mode": colorScheme !== null && colorScheme !== void 0 && colorScheme.includes('dark') ? 'dark' : 'light',
    "data-light-theme": dayScheme,
    "data-dark-theme": nightScheme
  }), /*#__PURE__*/React.createElement(GlobalStyle, {
    colorScheme: colorScheme !== null && colorScheme !== void 0 && colorScheme.includes('dark') ? 'dark' : 'light'
  }), children);
}
BaseStyles.displayName = "BaseStyles";

export { BaseStyles as default };
