import { XIcon } from '@primer/octicons-react';
import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { get } from '../../constants.js';
import sx from '../../sx.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const StyledButton = styled.button.withConfig({
  displayName: "ButtonClose__StyledButton",
  componentId: "sc-azdk6r-0"
})(["border:none;padding:0;background:transparent;cursor:pointer;border-radius:", ";color:", ";&:focus{outline:solid 2px ", ";}&:hover{color:", ";}", ";"], get('radii.2'), get('colors.fg.muted'), get('colors.accent.fg'), get('colors.accent.fg'), sx);
const ButtonClose = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/React.createElement(StyledButton, _extends({
    ref: ref,
    "aria-label": "Close"
  }, props), /*#__PURE__*/React.createElement(XIcon, null));
});

export { ButtonClose as default };
