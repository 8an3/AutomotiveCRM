import React from 'react';
import styled from 'styled-components';
import Box from '../Box/Box.js';
import sx from '../sx.js';
import { getSegmentedControlListItemStyles, getSegmentedControlButtonStyles } from './getSegmentedControlStyles.js';
import { defaultSxProp } from '../utils/defaultSxProp.js';
import merge from 'deepmerge';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SegmentedControlButtonStyled = styled.button.withConfig({
  displayName: "SegmentedControlButton__SegmentedControlButtonStyled",
  componentId: "sc-8lkgxl-0"
})(["", ";"], sx);
const SegmentedControlButton = ({
  children,
  leadingIcon: LeadingIcon,
  selected,
  sx: sxProp = defaultSxProp,
  ...rest
}) => {
  const mergedSx = merge(getSegmentedControlListItemStyles(), sxProp);
  return /*#__PURE__*/React.createElement(Box, {
    as: "li",
    sx: mergedSx
  }, /*#__PURE__*/React.createElement(SegmentedControlButtonStyled, _extends({
    "aria-current": selected,
    sx: getSegmentedControlButtonStyles({
      selected,
      children
    }),
    type: "button"
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "segmentedControl-content"
  }, LeadingIcon && /*#__PURE__*/React.createElement(Box, {
    mr: 1
  }, /*#__PURE__*/React.createElement(LeadingIcon, null)), /*#__PURE__*/React.createElement(Box, {
    className: "segmentedControl-text"
  }, children))));
};
SegmentedControlButton.displayName = "SegmentedControlButton";

export { SegmentedControlButton as default };
