import React from 'react';
import styled, { css } from 'styled-components';
import { get } from '../../constants.js';
import sx from '../../sx.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

/**
 * Contract for props passed to the `Header` component.
 */

const StyledHeader = styled.div.withConfig({
  displayName: "Header__StyledHeader",
  componentId: "sc-cjezay-0"
})(["{}padding:6px ", ";font-size:", ";font-weight:", ";color:", ";", " ", ""], get('space.3'), get('fontSizes.0'), get('fontWeights.bold'), get('colors.fg.muted'), ({
  variant
}) => variant === 'filled' && css(["background:", ";margin:", " 0;border-top:1px solid ", ";border-bottom:1px solid ", ";&:first-child{margin-top:0;}"], get('colors.canvas.subtle'), get('space.2'), get('colors.neutral.muted'), get('colors.neutral.muted')), sx);

/**
 * Displays the name and description of a `Group`.
 */
function Header({
  variant = 'subtle',
  title,
  auxiliaryText,
  children: _children,
  ...props
}) {
  return /*#__PURE__*/React.createElement(StyledHeader, _extends({
    role: "heading",
    variant: variant
  }, props), title, auxiliaryText && /*#__PURE__*/React.createElement("span", null, auxiliaryText));
}
Header.displayName = "Header";

export { Header, StyledHeader };
