import React from 'react';
import styled from 'styled-components';
import { maxWidth } from 'styled-system';
import sx from '../sx.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const StyledTruncate = styled.div.withConfig({
  displayName: "Truncate__StyledTruncate",
  componentId: "sc-23o1d2-0"
})(["display:", ";overflow:hidden;text-overflow:ellipsis;vertical-align:", ";white-space:nowrap;", " ", " ", ";"], props => props.inline ? 'inline-block' : 'inherit', props => props.inline ? 'top' : 'initial', maxWidth, props => props.expandable ? `&:hover { max-width: 10000px; }` : '', sx);
const Truncate = /*#__PURE__*/React.forwardRef(function Truncate({
  as,
  expandable = false,
  inline = false,
  maxWidth = 125,
  ...rest
}, ref) {
  return /*#__PURE__*/React.createElement(StyledTruncate, _extends({
    ref: ref,
    as: as,
    expandable: expandable,
    inline: inline,
    maxWidth: maxWidth
  }, rest));
});
if (process.env.NODE_ENV !== "production") {
  Truncate.displayName = 'Truncate';
}

export { Truncate as default };
